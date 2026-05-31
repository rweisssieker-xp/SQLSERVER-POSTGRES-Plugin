const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { dispatch } = require("../runtime/orchestrator");

function withEnv(overrides, fn) {
  const previous = {};
  for (const key of Object.keys(overrides)) {
    previous[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    });
}

test("production advisor blocks when live evidence is required but unavailable", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: "true",
    CODEXDB_POSTGRES_CONNECTION_STRING: undefined,
    CODEXDB_CONNECTION_STRING: undefined,
  }, async () => {
    const result = await dispatch("sql_performance_advisor", {
      environment: "production",
      engine: "postgres",
      database: "analytics",
      sql: "SELECT * FROM events",
    });

    assert.equal(result.blocked, true);
    assert.equal(result.status, "live_evidence_required");
    assert.ok(result.blockedReason.includes("mock_evidence_not_allowed"));
  });
});

test("plan_deep_diagnostics detects cardinality, scan, stale stats, and spill risks", async () => {
  const result = await dispatch("plan_deep_diagnostics", {
    engine: "postgres",
    plan: {
      "Node Type": "Seq Scan",
      "Plan Rows": 100,
      "Actual Rows": 50000,
      "Temp Read Blocks": 20,
      "Relation Name": "events",
    },
  });

  assert.equal(result.usp, "plan_deep_diagnostics");
  assert.ok(result.findings.some((finding) => finding.id === "cardinality_misestimation"));
  assert.ok(result.findings.some((finding) => finding.id === "sequential_scan"));
  assert.ok(result.findings.some((finding) => finding.id === "temp_spill_risk"));
});

test("connector action tools prepare real outbound requests without secrets in output", async () => {
  await withEnv({
    CODEXDB_GRAFANA_URL: "https://grafana.example.test",
    CODEXDB_GRAFANA_TOKEN: "secret-token",
    CODEXDB_PROMETHEUS_URL: "https://prom.example.test",
    CODEXDB_NEO4J_URI: "bolt://neo4j.example.test:7687",
    CODEXDB_NEO4J_USER: "neo4j",
    CODEXDB_NEO4J_PASSWORD: "secret-password",
  }, async () => {
    const grafana = await dispatch("grafana_annotation_export", { incidentId: "inc-1", text: "slow query" });
    const prometheus = await dispatch("prometheus_connector_ingest", { query: "rate(db_qps[5m])" });
    const neo4j = await dispatch("neo4j_graph_export", { graphName: "schema" });

    assert.equal(grafana.status, "ready_to_send");
    assert.equal(grafana.request.headers.Authorization, "***redacted***");
    assert.equal(prometheus.status, "configured");
    assert.ok(prometheus.request.url.includes("query="));
    assert.equal(neo4j.status, "configured");
    assert.equal(neo4j.connection.password, "***redacted***");
  });
});

test("packaging and first-run artifacts exist", () => {
  const root = path.resolve(__dirname, "..");
  const required = [
    ".env.example",
    "CHANGELOG.md",
    "FIRST_RUN.md",
    "RELEASE_CHECKLIST.md",
    ".github/workflows/ci.yml",
    "scripts/plugin-readiness-report.js",
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `${file} should exist`);
  }
});

test("all skill docs use the exact SKILL.md installer filename", () => {
  const skillsRoot = path.resolve(__dirname, "..", "skills");
  const offenders = [];

  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const files = fs.readdirSync(path.join(skillsRoot, entry.name), { withFileTypes: true });
    const hasExactSkillDoc = files.some((file) => file.isFile() && file.name === "SKILL.md");
    if (!hasExactSkillDoc) {
      offenders.push(entry.name);
    }
  }

  assert.deepEqual(offenders, []);
});
