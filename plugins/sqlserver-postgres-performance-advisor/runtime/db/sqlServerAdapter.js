const { BaseDbAdapter } = require("./baseAdapter");
const { validateSqlSafety } = require("../sqlSafety");

function mapRow(rows = []) {
  return rows.map((r) => r.value || r);
}

function resolveMockTables(sampleCatalog, database, schema) {
  const requested = sampleCatalog.sqlserver?.schemas?.[database]?.[schema]?.tables;
  if (requested) {
    return requested;
  }
  if (schema === "dbo") {
    return sampleCatalog.sqlserver?.schemas?.[database]?.public?.tables || {};
  }
  return {};
}

class SqlServerAdapter extends BaseDbAdapter {
  constructor(context, connectionConfig) {
    super(context);
    this.connectionConfig = connectionConfig;
    this.connection = null;
    this.driver = null;
  }

  async initialize() {
    try {
      this.driver = require("mssql");
    } catch (_error) {
      this.driver = null;
      return { initialized: true, adapter: "mock_sqlserver" };
    }
    if (!this.connectionConfig || (!this.connectionConfig.server && !this.connectionConfig.connectionString)) {
      return { initialized: true, adapter: "mock_sqlserver" };
    }
    const poolConfig = this.connectionConfig.connectionString
      ? this.connectionConfig.connectionString
      : {
          server: this.connectionConfig.server,
          user: this.connectionConfig.user,
          password: this.connectionConfig.password,
          database: this.connectionConfig.database,
          connectionTimeout: Number(this.context.policy?.auth?.liveConnectionTimeoutMs || 5000),
          requestTimeout: Number(this.connectionConfig.requestTimeoutMs || 30000),
          pool: {
            max: Number(this.connectionConfig.poolMax || 5),
            min: 0,
          },
          options: {
            encrypt: String(this.connectionConfig.encrypt || "true").toLowerCase() !== "false",
            trustServerCertificate: String(this.connectionConfig.trustServerCertificate || "false").toLowerCase() === "true",
          },
        };
    this.connection = new this.driver.ConnectionPool(poolConfig);
    await this.connection.connect();
    return { initialized: true, adapter: "sqlserver_adapter" };
  }

  async close() {
    if (this.connection && this.connection.close) {
      await this.connection.close();
    }
    return { closed: true };
  }

  async listDatabases() {
    if (!this.driver || !this.connection) {
      return mapRow(this.sampleCatalog.sqlserver?.databases || []);
    }
    const result = await this.connection.request().query("SELECT name FROM sys.databases WHERE name NOT IN ('master','tempdb','model','msdb')");
    return mapRow(result.recordset).map((name) => ({
      database: typeof name === "string" ? name : name.name,
      engine: "sqlserver",
      state: "online",
      owner: "dbo",
    }));
  }

  async listTables({ database, schema = "dbo" }) {
    const dbData = resolveMockTables(this.sampleCatalog, database, schema);
    if (!this.driver || !this.connection) {
      return Object.entries(dbData).map(([table, meta]) => ({
        database,
        schema,
        table,
        type: "table",
        rowCountHint: meta.rowCountHint,
        indexCount: meta.indexes.length,
        containsPIIFlag: Boolean(meta.containsPII),
      }));
    }
    const request = this.connection.request();
    request.input("schema", this.driver.VarChar, schema);
    const result = await request.query(
      "SELECT t.name AS name, SUM(p.rows) AS row_count_hint, COUNT(DISTINCT i.index_id) AS index_count " +
        "FROM sys.schemas s JOIN sys.tables t ON t.schema_id=s.schema_id " +
        "LEFT JOIN sys.partitions p ON p.object_id=t.object_id AND p.index_id IN (0,1) " +
        "LEFT JOIN sys.indexes i ON i.object_id=t.object_id AND i.index_id > 0 " +
        "WHERE s.name=@schema GROUP BY t.name ORDER BY t.name"
    );
    return mapRow(result.recordset).map((row) => ({
      database,
      schema,
      table: row.name || row,
      type: "table",
      rowCountHint: Number(row.row_count_hint || 0),
      indexCount: Number(row.index_count || 0),
      containsPIIFlag: /email|ssn|phone|iban/i.test(String(row.name || row)),
    }));
  }

  async describeTable({ database, schema = "dbo", table }) {
    const catalog = resolveMockTables(this.sampleCatalog, database, schema)?.[table];
    if (!this.driver || !this.connection) {
      if (!catalog) {
        return { error: "table_not_found", table, schema, database };
      }
      return {
        database,
        schema,
        table,
        columns: catalog.columns,
        constraints: catalog.columns.filter((c) => c.isPrimaryKey || c.isForeignKey),
        indexes: catalog.indexes,
        relationships: catalog.relationships,
        riskNotes: catalog.containsPII ? ["Contains PII-like columns"] : [],
      };
    }
    if (!database || !table) {
      return { error: "missing_target" };
    }
    const request = this.connection.request();
    request.input("schema", this.driver.VarChar, schema);
    request.input("table", this.driver.VarChar, table);
    const columns = await request.query(
      "SELECT name FROM sys.columns c JOIN sys.tables t ON t.object_id=c.object_id JOIN sys.schemas s ON t.schema_id=s.schema_id WHERE s.name=@schema AND t.name=@table"
    );
    const indexes = await request.query(
      "SELECT i.name, i.is_unique FROM sys.indexes i " +
      "JOIN sys.tables t ON t.object_id=i.object_id " +
      "JOIN sys.schemas s ON t.schema_id=s.schema_id " +
      "WHERE s.name=@schema AND t.name=@table AND i.index_id > 0"
    );
    return {
      database,
      schema,
      table,
      sampleColumns: mapRow(columns.recordset).map((c) => ({ name: c.name || c })),
      indexes: mapRow(indexes.recordset).map((i) => ({ name: i.name || i, unique: Boolean(i.is_unique) })),
      riskNotes: [],
    };
  }

  async describeRelationships({ database, schema = "dbo" }) {
    const schemaCatalog = this.sampleCatalog.sqlserver?.schemas?.[database]?.[schema]?.tables || {};
    if (!this.driver || !this.connection) {
      return {
        edges: Object.entries(schemaCatalog).flatMap(([source, meta]) =>
          (meta.relationships || []).map((rel) => ({
            source,
            target: rel.target,
            cardinality: rel.cardinality,
            joinHint: rel.via,
            criticality: meta.containsPII ? "high" : "medium",
          }))
        ),
      };
    }
    const request = this.connection.request();
    request.input("schema", this.driver.VarChar, schema);
    const fkRows = await request.query(
      "SELECT OBJECT_NAME(f.parent_object_id) AS source_table, OBJECT_NAME(f.referenced_object_id) AS target_table " +
      "FROM sys.foreign_keys f " +
      "JOIN sys.tables t ON t.object_id = f.parent_object_id " +
      "JOIN sys.schemas s ON s.schema_id = t.schema_id " +
      "WHERE s.name=@schema"
    );
    return {
      edges: mapRow(fkRows.recordset).map((row) => ({
        source: row.source_table,
        target: row.target_table,
        cardinality: "many-to-one",
        joinHint: "foreign key join",
        criticality: "medium",
      })),
    };
  }

  async queryStats() {
    const catalog = this.sampleCatalog.sqlserver || {};
    if (!this.driver || !this.connection) {
      return [
        { queryId: "sql-001", avgMs: 180, p95Ms: 700, ioWait: "low", cpuMs: 65, regressionScore: 0.12 },
        { queryId: "sql-002", avgMs: 24, p95Ms: 40, ioWait: "medium", cpuMs: 11, regressionScore: 0.06 },
      ];
    }
    const top = await this.connection.request().query(
      "SELECT TOP (10) qs.plan_handle, qs.execution_count, qs.total_worker_time, qs.total_elapsed_time, qt.text " +
      "FROM sys.dm_exec_query_stats qs " +
      "CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt " +
      "ORDER BY qs.total_worker_time DESC"
    );
    return mapRow(top.recordset).map((q) => ({
      queryId: (q.plan_handle || "unknown").toString().slice(0, 16),
      avgMs: q.execution_count ? Math.round((q.total_elapsed_time || 0) / Math.max(1, q.execution_count) / 1000) : 0,
      p95Ms: q.execution_count ? Math.round((q.total_worker_time || 0) / Math.max(1, q.execution_count) / 1000) : 0,
      ioWait: "unknown",
      cpuMs: q.total_worker_time ? Math.round((q.total_worker_time || 0) / Math.max(1, q.execution_count) / 1000) : 0,
      regressionScore: 0.15,
    }));
  }

  async lockAnalysis() {
    if (!this.driver || !this.connection) {
      return {
        deadlockRisk: "unknown",
        topWaiters: [],
        blockingChains: [],
        remediationPlan: ["configure live connection for lock analysis"],
        source: "mock",
      };
    }
    const result = await this.connection.request().query(
      "SELECT TOP (20) wt.session_id, wt.wait_type, wt.wait_duration_ms, wt.blocking_session_id, wt.resource_description " +
        "FROM sys.dm_os_waiting_tasks wt " +
        "WHERE wt.blocking_session_id IS NOT NULL OR wt.wait_type LIKE 'LCK%' " +
        "ORDER BY wt.wait_duration_ms DESC"
    );
    const rows = mapRow(result.recordset);
    const topWaiters = rows.map((row) => ({
      session: String(row.session_id),
      waitType: row.wait_type || "unknown",
      durationMs: Number(row.wait_duration_ms || 0),
      blockingSession: row.blocking_session_id ? String(row.blocking_session_id) : null,
      resource: row.resource_description || null,
    }));
    return {
      deadlockRisk: topWaiters.some((row) => row.durationMs > 10000) ? "high" : topWaiters.length ? "medium" : "low",
      topWaiters,
      blockingChains: topWaiters
        .filter((row) => row.blockingSession)
        .map((row) => ({ waiter: row.session, blocker: row.blockingSession, waitType: row.waitType })),
      remediationPlan: topWaiters.length
        ? ["inspect blocking sessions", "shorten transaction scope", "review missing indexes on blocked resources"]
        : ["no blocking waits observed"],
      source: "live",
    };
  }

  async indexUsage({ schema = "dbo", table } = {}) {
    if (!this.driver || !this.connection) {
      return { indexes: [], recommendation: "configure live connection for index usage", source: "mock" };
    }
    const request = this.connection.request();
    request.input("schema", this.driver.VarChar, schema);
    if (table) {
      request.input("table", this.driver.VarChar, table);
    }
    const tableFilter = table ? "AND t.name=@table " : "";
    const result = await request.query(
      "SELECT TOP (20) t.name AS table_name, i.name AS index_name, " +
        "COALESCE(us.user_seeks, 0) AS user_seeks, COALESCE(us.user_scans, 0) AS user_scans, " +
        "COALESCE(us.user_lookups, 0) AS user_lookups, COALESCE(us.user_updates, 0) AS user_updates " +
        "FROM sys.indexes i " +
        "JOIN sys.tables t ON t.object_id=i.object_id " +
        "JOIN sys.schemas s ON s.schema_id=t.schema_id " +
        "LEFT JOIN sys.dm_db_index_usage_stats us ON us.object_id=i.object_id AND us.index_id=i.index_id AND us.database_id=DB_ID() " +
        "WHERE s.name=@schema AND i.index_id > 0 " +
        tableFilter +
        "ORDER BY (COALESCE(us.user_seeks, 0) + COALESCE(us.user_scans, 0) + COALESCE(us.user_lookups, 0)) DESC"
    );
    const indexes = mapRow(result.recordset).map((row) => {
      const reads = Number(row.user_seeks || 0) + Number(row.user_scans || 0) + Number(row.user_lookups || 0);
      const writes = Number(row.user_updates || 0);
      return {
        table: row.table_name,
        index: row.index_name,
        usageScore: reads,
        reads,
        writes,
        recommendation: reads === 0 && writes > 0 ? "review write-only index before dropping" : "keep monitoring workload benefit",
      };
    });
    return { table, indexes, source: "live" };
  }

  async explainQuery({ query, sql }) {
    const statement = String(sql || query || "");
    const safety = validateSqlSafety(statement, { readOnly: true });
    if (!safety.safe) {
      return {
        error: "unsafe_sql",
        executed: false,
        violations: safety.violations,
        source: this.driver && this.connection ? "live" : "mock",
      };
    }
    if (!statement || !this.driver || !this.connection) {
      return {
        plan: "Adapter-ExecutionPlan(offline)",
        bottlenecks: [],
        rewriteHints: [],
        estimatedCost: null,
        confidence: "low",
        source: "mock",
      };
    }
    const request = this.connection.request();
    try {
      await request.query("SET SHOWPLAN_XML ON");
      const result = await this.connection.request().query(statement);
      const planRow = mapRow(result.recordset)[0] || {};
      const plan =
        planRow["Microsoft SQL Server 2005 XML Showplan"] ||
        planRow.ShowPlanXML ||
        planRow.showplan_xml ||
        "showplan_xml_unavailable";
      return {
        plan,
        bottlenecks: ["inspect showplan operators for scans, spills, and key lookups"],
        rewriteHints: ["validate predicates and projected indexes against showplan"],
        estimatedCost: null,
        confidence: plan === "showplan_xml_unavailable" ? "low" : "medium",
        source: "live",
        sourceQuery: statement,
      };
    } finally {
      await this.connection.request().query("SET SHOWPLAN_XML OFF");
    }
  }

  async replicationStatus() {
    if (!this.driver || !this.connection) {
      return {
        topology: "primary-replica-1",
        lagSeconds: 0.0,
        trend: "stable",
        consistencyRisk: "low",
        action: "no configured replication adapter",
      };
    }
    const rs = await this.connection.request().query("SELECT @@SERVERNAME AS server_name, SERVERPROPERTY('IsHadrEnabled') AS hadr_enabled");
    const row = mapRow(rs.recordset)[0] || {};
    return {
      topology: row.hadr_enabled ? "hadr_enabled" : "standalone_or_unknown",
      lagSeconds: 0,
      trend: "stable",
      consistencyRisk: row.hadr_enabled ? "low" : "unknown",
      action: row.hadr_enabled ? "monitor_dtc_and_replication" : "confirm_replication_topology",
      source: "live",
    };
  }

  async detectPii({ database, schema = "dbo", table }) {
    const catalog = this.sampleCatalog.sqlserver?.schemas?.[database]?.[schema]?.tables?.[table];
    if (!this.driver || !this.connection) {
      if (!catalog) {
        return { piiColumns: [], sensitivityLevel: "unknown", policyViolations: [], remediation: "no schema context", source: "mock" };
      }
      const piiColumns = catalog.columns.filter((c) => c.pii).map((c) => c.name);
      return {
        piiColumns,
        sensitivityLevel: piiColumns.length ? "high" : "low",
        policyViolations: piiColumns.length ? ["PII exposure candidate detected"] : [],
        remediation: piiColumns.length ? "mask output and apply least privilege" : "no direct PII in sampled metadata",
        source: "mock",
      };
    }
    if (!table) {
      return { piiColumns: [], sensitivityLevel: "unknown", policyViolations: ["missing_target_table"], remediation: "provide table" };
    }
    const request = this.connection.request();
    request.input("schema", this.driver.VarChar, schema);
    request.input("table", this.driver.VarChar, table);
    const rows = await request.query(
      "SELECT c.name AS name FROM sys.columns c " +
      "JOIN sys.tables t ON c.object_id = t.object_id " +
      "JOIN sys.schemas s ON t.schema_id = s.schema_id " +
      "WHERE s.name=@schema AND t.name=@table AND " +
      "(c.name LIKE '%email%' OR c.name LIKE '%ssn%' OR c.name LIKE '%phone%' OR c.name LIKE '%iban%')"
    );
    const piiColumns = mapRow(rows.recordset).map((r) => r.name || r);
    return {
      piiColumns,
      sensitivityLevel: piiColumns.length ? "high" : "low",
      policyViolations: piiColumns.length ? ["PII exposure candidate detected"] : [],
      remediation: piiColumns.length ? "mask output and narrow projection" : "no direct PII columns detected",
      source: "live",
    };
  }

  async executeSql(sql, options = {}) {
    const statement = String(sql || "").trim();
    if (!statement) {
      return { error: "missing_sql", executed: false, source: "mock" };
    }
    const safety = validateSqlSafety(statement, {
      readOnly: !options.isMigration,
      allowWrite: Boolean(options.isMigration || options.allowWrite),
      isMigration: Boolean(options.isMigration),
    });
    if (!safety.safe) {
      return {
        error: "unsafe_sql",
        executed: false,
        violations: safety.violations,
        statement,
        database: options.database,
        schema: options.schema,
        tool: options.tool,
        source: this.driver && this.connection ? "live" : "mock",
      };
    }
    const fallback = {
      statement,
      executed: false,
      affectedRows: 0,
      durationMs: 0,
      database: options.database,
      schema: options.schema,
      tool: options.tool,
      source: this.driver && this.connection ? "live" : "mock",
    };
    if (!this.driver || !this.connection) {
      return {
        ...fallback,
        mockReason: "no_connection",
      };
    }
    const start = Date.now();
    try {
      const result = await this.connection.request().query(statement);
      return {
        ...fallback,
        executed: true,
        affectedRows: result?.rowsAffected?.reduce((sum, value) => sum + Number(value || 0), 0) || 0,
        durationMs: Date.now() - start,
        columns: result?.recordset ? result.recordset.columns : null,
        source: "live",
      };
    } catch (error) {
      return {
        ...fallback,
        error: "execution_failed",
        message: String(error?.message || error),
        durationMs: Date.now() - start,
        source: "live_error",
      };
    }
  }
}

module.exports = {
  SqlServerAdapter,
};
