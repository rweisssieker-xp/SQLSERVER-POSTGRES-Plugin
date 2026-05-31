const test = require("node:test");
const assert = require("node:assert/strict");
const { dispatch } = require("../runtime/orchestrator");
const { PostgresAdapter } = require("../runtime/db/postgresAdapter");
const { SqlServerAdapter } = require("../runtime/db/sqlServerAdapter");

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

test("production_readiness_check reports blocking production gaps", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: undefined,
    CODEXDB_MIGRATION_SIGNING_KEY: undefined,
  }, async () => {
    const result = await dispatch("production_readiness_check", {
      environment: "production",
      engine: "postgres",
    });

    assert.equal(result.ready, false);
    assert.ok(result.blockingIssues.includes("live_connection_not_enforced"));
    assert.ok(result.blockingIssues.includes("migration_signing_secret_missing"));
    assert.ok(result.checks.some((check) => check.id === "manifest_tools"));
  });
});

test("live-required mode blocks silent mock fallback", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: "true",
    CODEXDB_POSTGRES_CONNECTION_STRING: undefined,
    CODEXDB_CONNECTION_STRING: undefined,
  }, async () => {
    const result = await dispatch("list_databases", {
      engine: "postgres",
    });

    assert.equal(result.blocked, true);
    assert.equal(result.status, "live_connection_required");
    assert.equal(result.source, "connection");
    assert.equal(result.profile.engine, "postgres");
    assert.ok(result.blockedReason.includes("live_connection_required"));
  });
});

test("production readiness fails when live connection is required but unavailable", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: "true",
    CODEXDB_MIGRATION_SIGNING_KEY: "test-secret",
    CODEXDB_POSTGRES_CONNECTION_STRING: undefined,
    CODEXDB_CONNECTION_STRING: undefined,
  }, async () => {
    const result = await dispatch("production_readiness_check", {
      environment: "production",
      engine: "postgres",
    });

    assert.equal(result.ready, false);
    assert.ok(result.blockingIssues.includes("live_connection_unavailable"));
    assert.ok(result.checks.some((check) => check.id === "live_connection_probe" && check.status === "fail"));
  });
});

test("postgres adapter blocks unsafe multi-statement sql before execution", async () => {
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "mock", engine: "postgres" });
  const result = await adapter.executeSql("SELECT 1; DROP TABLE users", {
    tool: "simulate_query",
  });

  assert.equal(result.executed, false);
  assert.equal(result.error, "unsafe_sql");
  assert.ok(result.violations.includes("multiple_statements"));
  assert.ok(result.violations.includes("dangerous_keyword"));
});

test("sql server adapter blocks unsafe sql before execution", async () => {
  const adapter = new SqlServerAdapter({ sampleCatalog: {} }, { type: "mock", engine: "sqlserver" });
  const result = await adapter.executeSql("EXEC xp_cmdshell 'whoami'", {
    tool: "simulate_query",
  });

  assert.equal(result.executed, false);
  assert.equal(result.error, "unsafe_sql");
  assert.ok(result.violations.includes("dangerous_keyword"));
});

test("sql safety blocks write-like read statements", async () => {
  const sqlServer = new SqlServerAdapter({ sampleCatalog: {} }, { type: "mock", engine: "sqlserver" });
  const postgres = new PostgresAdapter({ sampleCatalog: {} }, { type: "mock", engine: "postgres" });

  const selectInto = await sqlServer.executeSql("SELECT * INTO backup_users FROM users", {
    tool: "simulate_query",
  });
  const volatileFunction = await postgres.executeSql("SELECT nextval('order_seq')", {
    tool: "simulate_query",
  });

  assert.equal(selectInto.executed, false);
  assert.equal(selectInto.error, "unsafe_sql");
  assert.ok(selectInto.violations.includes("write_like_read"));
  assert.equal(volatileFunction.executed, false);
  assert.equal(volatileFunction.error, "unsafe_sql");
  assert.ok(volatileFunction.violations.includes("dangerous_function"));
});

test("sql server sample catalog uses dbo schema by default", async () => {
  const result = await dispatch("describe_table", {
    engine: "sqlserver",
    database: "app_prod",
    table: "users",
  });

  assert.equal(result.schema, "dbo");
  assert.equal(result.table, "users");
  assert.ok(Array.isArray(result.columns));
  assert.ok(result.riskNotes.includes("Contains PII-like columns"));
});

test("postgres query stats reads pg_stat_statements when live", async () => {
  const queries = [];
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "configured", engine: "postgres" });
  adapter.driver = {};
  adapter.pool = {
    async connect() {
      return {
        async query(sql) {
          queries.push(sql);
          return {
            rows: [
              {
                queryid: "42",
                mean_exec_time: 12.8,
                calls: 4,
                total_exec_time: 80,
                rows: 20,
                shared_blks_read: 3,
              },
            ],
          };
        },
        release() {},
      };
    },
  };

  const result = await adapter.queryStats();

  assert.match(queries[0], /pg_stat_statements/);
  assert.equal(result[0].queryId, "42");
  assert.equal(result[0].avgMs, 13);
  assert.equal(result[0].executionCount, 4);
  assert.equal(result[0].ioWait, "medium");
});

test("postgres query stats reports unavailable extension explicitly", async () => {
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "configured", engine: "postgres" });
  adapter.driver = {};
  adapter.pool = {
    async connect() {
      return {
        async query() {
          throw new Error("relation pg_stat_statements does not exist");
        },
        release() {},
      };
    },
  };

  const result = await adapter.queryStats();

  assert.equal(result.error, "pg_stat_statements_unavailable");
  assert.equal(result.source, "live_error");
  assert.equal(result.queryStats.length, 0);
});

test("query stats does not replace live empty stats with sample data", async () => {
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "configured", engine: "postgres" });
  adapter.driver = {};
  adapter.pool = {
    async connect() {
      return {
        async query() {
          return { rows: [] };
        },
        release() {},
      };
    },
  };

  const result = await adapter.queryStats();

  assert.deepEqual(result, []);
});

test("production live-required mode blocks mock-only runtime tools", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: "true",
    CODEXDB_MIGRATION_SIGNING_KEY: "test-secret",
  }, async () => {
    const result = await dispatch("query_time_machine", {
      environment: "production",
      engine: "postgres",
      database: "analytics",
      schema: "public",
      queryId: "q-1122",
    });

    assert.equal(result.blocked, true);
    assert.equal(result.status, "mock_runtime_blocked");
    assert.ok(result.blockedReason.includes("mock_runtime_not_allowed_in_production"));
  });
});

test("production live-required workload analysis requires live database connection", async () => {
  await withEnv({
    CODEXDB_REQUIRE_LIVE_CONNECTION: "true",
    CODEXDB_MIGRATION_SIGNING_KEY: "test-secret",
    CODEXDB_POSTGRES_CONNECTION_STRING: undefined,
    CODEXDB_CONNECTION_STRING: undefined,
  }, async () => {
    const result = await dispatch("analyze_workload", {
      environment: "production",
      engine: "postgres",
      database: "analytics",
      schema: "public",
    });

    assert.equal(result.blocked, true);
    assert.equal(result.status, "live_connection_required");
    assert.ok(result.blockedReason.includes("live_connection_required"));
  });
});

test("postgres explain defaults to non-executing explain", async () => {
  const queries = [];
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "configured", engine: "postgres" });
  adapter.driver = {};
  adapter.pool = {
    async connect() {
      return {
        async query(sql) {
          queries.push(sql);
          return { rows: [{ "QUERY PLAN": [{ Plan: { "Node Type": "Seq Scan" } }] }] };
        },
        release() {},
      };
    },
  };

  const result = await adapter.explainQuery({ sql: "SELECT * FROM users" });

  assert.match(queries[0], /^EXPLAIN \(BUFFERS, FORMAT JSON\)/);
  assert.doesNotMatch(queries[0], /ANALYZE/);
  assert.equal(result.source, "live");
});

test("sql server explain requests showplan xml instead of returning placeholder", async () => {
  const queries = [];
  const adapter = new SqlServerAdapter({ sampleCatalog: {} }, { type: "configured", engine: "sqlserver" });
  adapter.driver = {};
  adapter.connection = {
    request() {
      return {
        async query(sql) {
          queries.push(sql);
          return sql.includes("SELECT")
            ? { recordset: [{ "Microsoft SQL Server 2005 XML Showplan": "<ShowPlanXML />" }] }
            : { recordset: [] };
        },
      };
    },
  };

  const result = await adapter.explainQuery({ sql: "SELECT * FROM dbo.users" });

  assert.deepEqual(queries, ["SET SHOWPLAN_XML ON", "SELECT * FROM dbo.users", "SET SHOWPLAN_XML OFF"]);
  assert.equal(result.plan, "<ShowPlanXML />");
  assert.equal(result.source, "live");
});

test("postgres adapter reads live lock analysis and index usage", async () => {
  const queries = [];
  const adapter = new PostgresAdapter({ sampleCatalog: {} }, { type: "configured", engine: "postgres" });
  adapter.driver = {};
  adapter.pool = {
    async connect() {
      return {
        async query(sql) {
          queries.push(sql);
          if (sql.includes("pg_locks")) {
            return {
              rows: [
                { pid: 11, wait_event_type: "Lock", wait_event: "transactionid", state: "active", duration_ms: 2500, relation_name: "orders" },
              ],
            };
          }
          return {
            rows: [
              { indexrelname: "orders_user_idx", idx_scan: 42, idx_tup_read: 1000, idx_tup_fetch: 900, relname: "orders", index_size_bytes: 8192 },
            ],
          };
        },
        release() {},
      };
    },
  };

  const locks = await adapter.lockAnalysis();
  const indexes = await adapter.indexUsage({ table: "orders" });

  assert.match(queries[0], /pg_locks/);
  assert.equal(locks.source, "live");
  assert.equal(locks.deadlockRisk, "medium");
  assert.equal(locks.topWaiters[0].session, "11");
  assert.match(queries[1], /pg_stat_user_indexes/);
  assert.equal(indexes.source, "live");
  assert.equal(indexes.indexes[0].index, "orders_user_idx");
  assert.equal(indexes.indexes[0].usageScore, 42);
});

test("sql server adapter reads live lock analysis and index usage", async () => {
  const queries = [];
  const adapter = new SqlServerAdapter({ sampleCatalog: {} }, { type: "configured", engine: "sqlserver" });
  adapter.driver = { VarChar: "VarChar" };
  adapter.connection = {
    request() {
      const inputs = {};
      return {
        input(name, _type, value) {
          inputs[name] = value;
          return this;
        },
        async query(sql) {
          queries.push({ sql, inputs });
          if (sql.includes("dm_os_waiting_tasks")) {
            return {
              recordset: [
                { session_id: 55, wait_type: "LCK_M_X", wait_duration_ms: 1200, blocking_session_id: 77, resource_description: "OBJECT: 5" },
              ],
            };
          }
          return {
            recordset: [
              { table_name: "orders", index_name: "ix_orders_user", user_seeks: 7, user_scans: 1, user_lookups: 0, user_updates: 3 },
            ],
          };
        },
      };
    },
  };

  const locks = await adapter.lockAnalysis();
  const indexes = await adapter.indexUsage({ table: "orders" });

  assert.match(queries[0].sql, /dm_os_waiting_tasks/);
  assert.equal(locks.source, "live");
  assert.equal(locks.topWaiters[0].session, "55");
  assert.match(queries[1].sql, /dm_db_index_usage_stats/);
  assert.equal(indexes.source, "live");
  assert.equal(indexes.indexes[0].index, "ix_orders_user");
  assert.equal(indexes.indexes[0].usageScore, 8);
});
