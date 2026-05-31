const { SqlServerAdapter } = require("./sqlServerAdapter");
const { PostgresAdapter } = require("./postgresAdapter");
const fs = require("node:fs");
const { getPolicy } = require("../config");

function safeParseJson(value) {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

function mergeSecretProfile(profileName, policy) {
  const storeCandidates = [];
  if (policy?.auth?.secretStoreEnv) {
    for (const envName of policy.auth.secretStoreEnv) {
      if (process.env[envName]) {
        storeCandidates.push(process.env[envName]);
      }
    }
  }
  if (policy?.auth?.secretStorePaths) {
    for (const envName of policy.auth.secretStorePaths) {
      const p = process.env[envName];
      if (p && fs.existsSync(p)) {
        try {
          const fileValue = fs.readFileSync(p, "utf8");
          storeCandidates.push(fileValue);
        } catch {}
      }
    }
  }
  const merged = {};
  for (const raw of storeCandidates) {
    const parsed = safeParseJson(raw);
    if (!parsed || typeof parsed !== "object") {
      continue;
    }
    Object.assign(merged, parsed);
  }
  const profile = safeParseJson(merged[profileName]) || safeParseJson(merged.default) || merged[profileName] || merged.default;
  if (!profile || typeof profile !== "object") {
    return null;
  }
  return {
    server: profile.server || profile.host || profile.hostname,
    user: profile.user || profile.username,
    password: profile.password || profile.pass,
    database: profile.database || profile.db || profile.name,
    engine: profile.engine || profile.type || "sqlserver",
    connectionString: profile.connectionString || profile.url,
    type: "configured",
  };
}

function redactProfile(profile = {}) {
  const safe = {};
  for (const [key, value] of Object.entries(profile || {})) {
    if (/password|secret|token|credential|key|connectionstring/i.test(key)) {
      safe[key] = value ? "***redacted***" : value;
    } else {
      safe[key] = value;
    }
  }
  return safe;
}

function readProfile(name) {
  const safeName = String(name || "default");
  const policy = getPolicy();
  const prefix = `CODEXDB_${safeName.toUpperCase()}_`;
  const profileEngine = normalizeEngine(process.env[`${prefix}ENGINE`] || (safeName === "postgres" || safeName === "sqlserver" ? safeName : process.env.CODEXDB_ENGINE || "sqlserver"));
  const db = process.env[`${prefix}DB`] || process.env[`${prefix}DATABASE`] || process.env["CODEXDB_DATABASE"] || process.env["CODEXDB_DB"] || undefined;
  const secretProfile = mergeSecretProfile(safeName, policy);
  const connectionString = process.env[`${prefix}CONNECTION_STRING`] || process.env["CODEXDB_CONNECTION_STRING"];
  if (safeName === "default" && !db) {
    if (secretProfile) {
      return secretProfile;
    }
    if (connectionString) {
      return {
        type: "configured",
        engine: profileEngine,
        connectionString,
      };
    }
    return {
      type: "mock",
      engine: profileEngine,
    };
  }
  const fallback = {
    type: "configured",
    engine: profileEngine,
    server: process.env[`${prefix}SERVER`],
    user: process.env[`${prefix}USER`],
    password: process.env[`${prefix}PASSWORD`],
    database: db,
    connectionString,
    port: process.env[`${prefix}PORT`],
    ssl: process.env[`${prefix}SSL`],
    encrypt: process.env[`${prefix}ENCRYPT`],
    trustServerCertificate: process.env[`${prefix}TRUST_SERVER_CERTIFICATE`],
  };
  if (secretProfile && secretProfile.database) {
    return { ...fallback, ...secretProfile };
  }
  if (secretProfile && !fallback.server && !fallback.user && !fallback.password) {
    return secretProfile;
  }
  return fallback;
}

function normalizeEngine(name = "sqlserver") {
  const v = String(name || "").toLowerCase();
  if (v.includes("postg")) return "postgres";
  if (v.includes("sql")) return "sqlserver";
  return v || "sqlserver";
}

async function createAdapter(context, args = {}) {
  const engine = normalizeEngine(args.engine || context.policy?.defaultEngine || "sqlserver");
  const profile = readProfile(args.connectionProfile || context.policy?.connectionProfile || engine);

  if (engine === "postgres") {
    const adapter = new PostgresAdapter(context, profile);
    const status = await adapter.initialize();
    if (hasMockAdapter(status) && context.policy?.auth?.requireLiveConnection) {
      return {
        adapter,
        status: {
          initialized: false,
          adapter: status.adapter,
          blocked: true,
          status: "live_connection_required",
          source: "connection",
          blockedReason: ["live_connection_required"],
          profile: redactProfile(profile),
        },
        engine,
      };
    }
    return { adapter, status, engine };
  }
  const adapter = new SqlServerAdapter(context, profile);
  const status = await adapter.initialize();
  if (hasMockAdapter(status) && context.policy?.auth?.requireLiveConnection) {
    return {
      adapter,
      status: {
        initialized: false,
        adapter: status.adapter,
        blocked: true,
        status: "live_connection_required",
        source: "connection",
        blockedReason: ["live_connection_required"],
        profile: redactProfile(profile),
      },
      engine,
    };
  }
  return { adapter, status, engine };
}

function hasMockAdapter(status = {}) {
  return String(status.adapter || "").includes("mock");
}

module.exports = {
  readProfile,
  createAdapter,
  hasMockAdapter,
  redactProfile,
};
