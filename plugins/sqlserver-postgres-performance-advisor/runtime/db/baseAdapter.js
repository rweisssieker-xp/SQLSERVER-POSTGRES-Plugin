class BaseDbAdapter {
  constructor(context) {
    this.context = context;
    this.sampleCatalog = context.sampleCatalog || {};
  }

  async initialize() {
    return { initialized: true, adapter: this.constructor.name };
  }

  async close() {
    return { closed: true };
  }

  async listDatabases(_args = {}) {
    return [];
  }

  async listTables(_args = {}) {
    return { error: "not_implemented", tables: [] };
  }

  async describeTable(_args = {}) {
    return { error: "not_implemented", table: null };
  }

  async describeRelationships(_args = {}) {
    return { error: "not_implemented", edges: [] };
  }

  async queryStats(_args = {}) {
    return [];
  }

  async lockAnalysis(_args = {}) {
    return { error: "not_implemented", topWaiters: [], blockingChains: [] };
  }

  async indexUsage(_args = {}) {
    return { error: "not_implemented", indexes: [] };
  }

  async detectPii(_args = {}) {
    return { piiColumns: [], sensitivityLevel: "unknown", policyViolations: [], remediation: "adapter_not_implemented" };
  }

  async replicationStatus(_args = {}) {
    return { error: "not_implemented" };
  }

  async queryStatsTimeline(_args = {}) {
    return [];
  }

  async executeSql(_sql, _options = {}) {
    return {
      error: "not_implemented",
      executed: false,
      affectedRows: 0,
      durationMs: 0,
    };
  }

  async explainQuery(_args = {}) {
    return {
      plan: "Adapter-noch nicht implementiert",
      bottlenecks: [],
      rewriteHints: [],
      estimatedCost: null,
      confidence: "low",
      source: _args.query,
    };
  }
}

module.exports = {
  BaseDbAdapter,
};
