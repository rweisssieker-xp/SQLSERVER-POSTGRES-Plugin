const { getPolicy } = require("./config");

const writeActions = new Set([
  "propose_migration",
  "simulate_query",
  "create_index",
  "rollback_migration",
  "optimize_query",
  "create_partitioning",
]);
const migrationActions = new Set(["create_index", "create_partitioning", "rollback_migration", "optimize_query", "propose_migration"]);

function normalizeActorRole(actor, rolePolicy) {
  if (actor && typeof actor === "object") {
    const directRole = actor.role || actor.roles?.[0] || actor.idpRole;
    if (directRole) {
      return normalizeActorRole(String(directRole), rolePolicy);
    }
    const roleClaim = actor.roleClaim || actor.role_claim;
    if (roleClaim) {
      return normalizeActorRole(String(roleClaim), rolePolicy);
    }
    return (rolePolicy && rolePolicy.defaultRole) || "developer";
  }
  const fallback = rolePolicy.defaultRole || "developer";
  const roles = rolePolicy && rolePolicy.roles ? rolePolicy.roles : {};
  const roleAliases = rolePolicy && rolePolicy.roleAliases ? rolePolicy.roleAliases : {};
  if (!actor || typeof actor !== "string") {
    return fallback;
  }
  const trimmed = actor.trim();
  if (!trimmed) {
    return fallback;
  }
  if (trimmed.includes("|")) {
    const [left, right] = trimmed.split("|");
    if (right) {
      const rightCandidate = right.trim().toLowerCase().replace(/^role:/, "");
      if (roleAliases[rightCandidate]) {
        return roleAliases[rightCandidate];
      }
      if (roles[rightCandidate]) {
        return rightCandidate;
      }
    }
    if (left) {
      const leftCandidate = left.trim().toLowerCase().replace(/^role:/, "");
      if (roleAliases[leftCandidate]) {
        return roleAliases[leftCandidate];
      }
      if (roles[leftCandidate]) {
        return leftCandidate;
      }
    }
  }
  const direct = trimmed.toLowerCase().replace(/^role:/, "");
  const directAlias = roleAliases[direct];
  if (directAlias) {
    return directAlias;
  }
  if (roles[direct]) {
    return direct;
  }
  if (trimmed.toLowerCase().startsWith("role:")) {
    const candidate = trimmed.slice(5).toLowerCase();
    const alias = roleAliases[candidate];
    if (alias) {
      return alias;
    }
    if (roles[candidate]) {
      return candidate;
    }
  }
  return fallback;
}

function evaluateAction({
  actionType,
  environment = "lab",
  riskLevel = "LOW",
  database,
  schema,
  actor = "codex-user",
  sqlFingerprint = "",
  migrationSignature = "",
  actionFingerprint = "",
  isDryRun = false,
  rlsContext = {},
}) {
  const policy = getPolicy();
  const decision = {
    actionType,
    environment,
    riskLevel,
    policyVersion: "1.0",
    requiredControls: [],
    decision: "ALLOW",
    reasonCodes: [],
  };
  const env = String(environment || "lab").toLowerCase();
  const normalizedAction = String(actionType || "").toLowerCase();
  const effectiveSchema = schema ? String(schema).toLowerCase() : "";
  const rolePolicy = policy.rolePolicy || {};
  const role = normalizeActorRole(actor, rolePolicy);
  const roleConfig = rolePolicy.roles && rolePolicy.roles[role] ? rolePolicy.roles[role] : {};
  const productionAllowedWrites = roleConfig.allowedWriteActionsInProduction || rolePolicy.allowedWriteActionsInProduction || policy.allowedWriteActionsInProduction || [];
  const productionAllowedSchemas = roleConfig.allowedSchemasInProduction || ["public", "dbo"];
  const productionAllowedTools = roleConfig.allowedToolsInProduction || roleConfig.allowedTools || rolePolicy.allowedToolsInProduction;
  const isWriteAction = writeActions.has(normalizedAction);
  const isProduction = env === "production";
  const isMigrationAction = migrationActions.has(normalizedAction);
  const signatureRequired = policy.migrationSigning?.requireInProduction && isMigrationAction;
  const allowDryRunWithoutSignature = policy.migrationSigning?.allowDryRunWithoutSignature;
  const enforceSignatureTools = new Set(
    (policy.migrationSigning && policy.migrationSigning.enforceForTools && policy.migrationSigning.enforceForTools.length)
      ? policy.migrationSigning.enforceForTools
      : []
  );
  const requireSignature =
    enforceSignatureTools.has(normalizedAction) ||
    (signatureRequired && isProduction && isMigrationAction && !(allowDryRunWithoutSignature && isDryRun));
  const allowlistActive = String(policy.queryAllowlistMode || "off").toLowerCase() === "enforce" || String(policy.queryAllowlistMode || "off").toLowerCase() === "warn";
  const hasQueryFingerprint = Boolean(sqlFingerprint || actionFingerprint);
  const queryId = sqlFingerprint || actionFingerprint;
  const isQueryAllowlisted = !queryId || !policy.queryAllowlist.length || policy.queryAllowlist.includes(queryId);
  const hasRoleAllowlist = Array.isArray(productionAllowedTools) && productionAllowedTools.length > 0;

  if (riskLevel === "CRITICAL") {
    decision.decision = "SCOPE_TO_SANDBOX";
    decision.requiredControls.push("sandbox_profile", "forensic_snapshot", "network_isolation");
    decision.reasonCodes.push("critical_operation_requires_sandbox");
  } else if (riskLevel === "HIGH") {
    if (String(policy.sandboxPolicy?.highRiskDecision || "BLOCK").toUpperCase() === "SCOPE_TO_SANDBOX") {
      decision.decision = "SCOPE_TO_SANDBOX";
      decision.requiredControls.push("sandbox_profile", "forensic_snapshot", "network_isolation");
      decision.reasonCodes.push("high_risk_requires_sandbox");
    } else {
      decision.decision = "BLOCK";
      decision.requiredControls.push("high_risk_blocked");
      decision.reasonCodes.push("high_risk_blocked_by_policy");
    }
  } else if (riskLevel === "MEDIUM") {
    decision.decision = "REQUIRES_APPROVAL";
    decision.requiredControls.push("human_approval", "risk_review_note");
    decision.reasonCodes.push("medium_risk_requires_human_approval");
  }

  if (isProduction && isWriteAction && !productionAllowedWrites.includes(normalizedAction)) {
    decision.decision = "BLOCK";
    decision.requiredControls.push("role_write_allowlist", "policy_override_request");
    decision.reasonCodes.push("prod_write_not_allowed_for_role");
  }

  if (hasRoleAllowlist && isProduction && !productionAllowedTools.includes(normalizedAction)) {
    decision.decision = "BLOCK";
    decision.requiredControls.push("role_tool_allowlist", "policy_owner_signoff");
    decision.reasonCodes.push("tool_not_allowlisted_for_role");
  }

  if (isProduction && isWriteAction && riskLevel === "LOW") {
    decision.requiredControls.push("human_approval", "rollback_plan");
    if (!decision.requiredControls.includes("policy_owner_signoff")) {
      decision.requiredControls.push("policy_owner_signoff");
    }
    if (decision.decision === "ALLOW") {
      decision.decision = "REQUIRES_APPROVAL";
    }
    if (!decision.reasonCodes.includes("prod_write_requires_approval")) {
      decision.reasonCodes.push("prod_write_requires_approval");
    }
  } else if (isProduction && isWriteAction && riskLevel !== "LOW") {
    if (!decision.requiredControls.includes("human_approval")) {
      decision.requiredControls.push("human_approval", "rollback_plan");
    }
    if (!decision.requiredControls.includes("policy_owner_signoff")) {
      decision.requiredControls.push("policy_owner_signoff");
    }
    if (!decision.reasonCodes.includes("prod_write_requires_human_approval")) {
      decision.reasonCodes.push("prod_write_requires_human_approval");
    }
  }

  if (schema && policy.restrictedSchemas.includes(schema.toLowerCase())) {
    decision.decision = "BLOCK";
    decision.requiredControls.push("restricted_schema_override");
    decision.reasonCodes.push("restricted_schema_access");
  }

  if (isProduction && isWriteAction && effectiveSchema && !productionAllowedSchemas.includes(effectiveSchema)) {
    if (decision.decision !== "BLOCK") {
      decision.decision = "BLOCK";
    }
    decision.requiredControls.push("schema_scope_override");
    decision.reasonCodes.push("prod_schema_access_not_permitted");
  }

  const piiSensitiveActions = new Set(["query", "analyze", "detect_pii", "explain_query"]);
  if (piiSensitiveActions.has(normalizedAction) && !database) {
    decision.decision = "BLOCK";
    decision.requiredControls.push("database_scope");
    decision.reasonCodes.push("missing_database_context");
  }

  if (allowlistActive && !isWriteAction && hasQueryFingerprint && !isQueryAllowlisted) {
    if (String(policy.queryAllowlistMode).toLowerCase() === "enforce") {
      decision.decision = "BLOCK";
      decision.requiredControls.push("query_allowlist");
      decision.reasonCodes.push("query_not_allowlisted");
    } else if (!decision.reasonCodes.includes("query_not_allowlisted")) {
      decision.requiredControls.push("query_allowlist_audit");
      decision.reasonCodes.push("query_not_on_allowlist");
    }
  }

  if (requireSignature && isMigrationAction && !migrationSignature) {
    decision.requiredControls.push("migration_signature");
    decision.reasonCodes.push("missing_migration_signature");
    if (decision.decision === "ALLOW") {
      decision.decision = "BLOCK";
    }
  }

  decision.actorRole = role;

  const rlsEnabled = policy.rls?.enabled;
  const requireRlsContext = policy.rls?.requireTenantContext;
  const allowedTenantIds = policy.rls?.allowedTenantIds || [];
  const tenantId = rlsContext?.tenantId || rlsContext?.tenant;
  if (rlsEnabled && requireRlsContext && !tenantId) {
    if (policy.rls?.fallbackMode === "block") {
      decision.decision = "BLOCK";
      decision.requiredControls.push("rls_context_required");
      decision.reasonCodes.push("missing_rls_context");
    } else {
      decision.requiredControls.push("rls_context_warning");
    }
  }
  if (rlsEnabled && tenantId && allowedTenantIds.length && !allowedTenantIds.includes(String(tenantId))) {
    decision.requiredControls.push("tenant_access_denied", "tenant_access_review");
    if (decision.decision === "ALLOW") {
      decision.decision = "BLOCK";
    }
    decision.reasonCodes.push("tenant_not_allowed");
  }

  if (isMigrationAction && policy.migrationSigning?.requireNotExpired) {
    const signatureExpiresAt = String(migrationSignature || "").split("|").at(-1) || "";
    if (signatureExpiresAt && Date.parse(signatureExpiresAt) < Date.now()) {
      decision.decision = "BLOCK";
      decision.requiredControls.push("migration_signature_expired");
      decision.reasonCodes.push("policy_requires_unexpired_signature");
    }
  }

  return decision;
}

function classifyDecision(actionType, environment, riskLevel, database, schema, actor, options = {}) {
  if (typeof actionType === "object" && actionType !== null) {
    return evaluateAction(actionType);
  }
  return evaluateAction({
    actionType,
    environment,
    riskLevel,
    database,
    schema,
    actor,
    rlsContext: options.rlsContext || {},
  });
}

module.exports = {
  evaluateAction,
  classifyDecision,
};
