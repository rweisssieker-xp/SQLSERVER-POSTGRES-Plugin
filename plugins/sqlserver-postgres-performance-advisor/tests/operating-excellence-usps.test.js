const test = require("node:test");
const assert = require("node:assert/strict");
const { dispatch } = require("../runtime/orchestrator");

test("query_plan_narrator explains plans as an action-oriented story", async () => {
  const result = await dispatch("query_plan_narrator", {
    plan: { "Node Type": "Seq Scan", "Relation Name": "events", "Actual Rows": 50000, "Plan Rows": 100 },
  });

  assert.equal(result.usp, "query_plan_narrator");
  assert.ok(result.story.includes("Seq Scan"));
  assert.ok(result.actions.includes("run_plan_deep_diagnostics"));
});

test("slo_policy_compiler converts SLO intent into database guardrails", async () => {
  const result = await dispatch("slo_policy_compiler", {
    service: "checkout",
    p95Ms: 300,
    errorBudgetBurnRate: 2,
  });

  assert.equal(result.usp, "slo_policy_compiler");
  assert.equal(result.policy.service, "checkout");
  assert.ok(result.guardrails.includes("block_unbenchmarked_high_risk_changes"));
});

test("index_retirement_planner creates safe retirement candidates", async () => {
  const result = await dispatch("index_retirement_planner", {
    indexes: [
      { name: "ix_unused", reads: 0, writes: 500, lastUsedDays: 120 },
      { name: "ix_hot", reads: 10000, writes: 100, lastUsedDays: 1 },
    ],
  });

  assert.equal(result.usp, "index_retirement_planner");
  assert.equal(result.retirementCandidates[0].name, "ix_unused");
  assert.ok(result.safetySteps.includes("monitor_after_disable"));
});

test("hotfix_risk_assessor rates emergency database hotfix risk", async () => {
  const result = await dispatch("hotfix_risk_assessor", {
    change: "ALTER TABLE orders ADD COLUMN priority int NOT NULL DEFAULT 0",
    environment: "production",
    hasRollback: false,
  });

  assert.equal(result.usp, "hotfix_risk_assessor");
  assert.equal(result.decision, "block");
  assert.ok(result.risks.includes("missing_rollback"));
});

test("tenant_noisy_neighbor_detector finds tenant-level resource outliers", async () => {
  const result = await dispatch("tenant_noisy_neighbor_detector", {
    tenants: [
      { tenantId: "a", cpuMs: 90000, reads: 1000000, calls: 100 },
      { tenantId: "b", cpuMs: 1000, reads: 2000, calls: 50 },
    ],
  });

  assert.equal(result.usp, "tenant_noisy_neighbor_detector");
  assert.equal(result.noisyTenants[0].tenantId, "a");
  assert.ok(result.actions.includes("isolate_or_rate_limit_hot_tenant"));
});

test("partition_strategy_advisor recommends partitioning strategy", async () => {
  const result = await dispatch("partition_strategy_advisor", {
    table: "events",
    rowCount: 500000000,
    timeColumn: "created_at",
    dailyGrowthRows: 5000000,
  });

  assert.equal(result.usp, "partition_strategy_advisor");
  assert.equal(result.strategy.type, "range_time");
  assert.ok(result.strategy.partitionKey.includes("created_at"));
});

test("statistics_health_doctor diagnoses stale statistics", async () => {
  const result = await dispatch("statistics_health_doctor", {
    stats: [
      { table: "events", column: "tenant_id", ageHours: 96, modificationPct: 35 },
    ],
  });

  assert.equal(result.usp, "statistics_health_doctor");
  assert.equal(result.findings[0].id, "stale_statistics");
  assert.ok(result.actions.includes("run_analyze_or_update_statistics"));
});

test("connection_pool_advisor detects pool pressure and sizing risks", async () => {
  const result = await dispatch("connection_pool_advisor", {
    maxConnections: 100,
    activeConnections: 95,
    waitMs: 1500,
  });

  assert.equal(result.usp, "connection_pool_advisor");
  assert.equal(result.status, "pool_pressure");
  assert.ok(result.actions.includes("tune_pool_size_or_reduce_connection_hold_time"));
});

test("backup_restore_readiness_guard validates restore readiness", async () => {
  const result = await dispatch("backup_restore_readiness_guard", {
    lastBackupAgeHours: 30,
    lastRestoreTestDays: 45,
    rpoHours: 24,
  });

  assert.equal(result.usp, "backup_restore_readiness_guard");
  assert.equal(result.status, "not_ready");
  assert.ok(result.findings.includes("backup_older_than_rpo"));
});

test("vendor_feature_mapper maps competitor tool capabilities to plugin USPs", async () => {
  const result = await dispatch("vendor_feature_mapper", {
    vendor: "Redgate",
    capability: "schema compare and SQL monitor",
  });

  assert.equal(result.usp, "vendor_feature_mapper");
  assert.ok(result.pluginDifferentiators.includes("ai_evidence_pack"));
  assert.ok(result.coverageMap.length >= 1);
});
