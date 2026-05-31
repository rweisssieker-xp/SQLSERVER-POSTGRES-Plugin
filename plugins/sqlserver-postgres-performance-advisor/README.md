# CodexDB Agent

CodexDB Agent is a Codex plugin for safety-governed SQL Server and PostgreSQL
analysis, performance diagnostics, migration planning, and policy-controlled
database operations.

The plugin is designed as an advisor and governed operations layer. It is not a
replacement for SSMS, DataGrip, dbForge, SSDT, Redgate SQL Prompt, SQL Sentry,
or other IDE and monitoring suites. It focuses on deterministic Codex skills,
evidence packages, policy gates, rollback planning, and repeatable database
operations.

## What It Provides

- SQL Server and PostgreSQL metadata discovery.
- Query, plan, wait, lock, index, replication, and workload analysis.
- Policy-gated migration, rollback, index, partitioning, and optimization flows.
- Production readiness checks, signed migration artifacts, audit records, and
  replay support.
- Advisor workflows for SLO impact, release readiness, incident analysis,
  workload impact, cost-performance tradeoffs, and governed self-healing.
- Disruptive AI cognitive control plane for strategy synthesis, prompt risk,
  trust scoring, knowledge gaps, semantic incident prediction, multi-agent
  consensus, and executive ROI narratives.
- Marketplace-ready Codex skills under `skills/`.

## Plugin Layout

```text
.codex-plugin/plugin.json
skills/
runtime/
scripts/
tests/
.env.example
README.md
MARKETING.md
LICENSE
SECURITY.md
PRIVACY.md
CONTRIBUTING.md
SUPPORT.md
MARKETPLACE.md
```

The repository root also contains `.codex-plugin/plugin.json`, because the
marketplace scanner expects the required manifest at the submitted artifact
root. The plugin keeps a compact marketplace skill set to stay within the
128-file scan limit; executable runtime tools are declared in
`runtime/tool-manifest.json`.

## Installation

Install dependencies from the plugin directory:

```bash
npm install
```

Run the test suite:

```bash
npm test
```

Run the readiness report:

```bash
npm run readiness
```

Run the strict production gate:

```bash
npm run readiness:strict
```

## Marketplace Installation

After publication, users can install the plugin with:

```bash
npx codex-marketplace add rweisssieker-xp/SQLSERVER-POSTGRES-Plugin/plugins/sqlserver-postgres-performance-advisor --plugin --project
```

Submit this plugin directory URL for review:

```text
https://github.com/rweisssieker-xp/SQLSERVER-POSTGRES-Plugin/tree/master/plugins/sqlserver-postgres-performance-advisor
```

## Runtime Usage

Run a tool directly:

```bash
node runtime/runTool.js list_databases '{"engine":"postgres"}'
```

Run a production readiness check:

```bash
node runtime/runTool.js production_readiness_check '{"environment":"production","engine":"postgres"}'
```

Run an advisor workflow:

```bash
node runtime/runTool.js sql_performance_advisor '{"engine":"postgres","database":"analytics","sql":"SELECT * FROM orders"}'
```

Run an enterprise AI USP smoke scenario:

```bash
node runtime/runTool.js llm_prompt_risk_auditor '{"prompt":"Fix production by dropping slow indexes and update all customers","environment":"production"}'
```

Release contracts for the disruptive autonomous and AI USP layers are
declared in `runtime/tool-contracts.json`. Demo-ready enterprise scenarios are
declared in `demos/enterprise-ai-usp-scenarios.json`, with curated killer-demo
scripts in `demos/KILLER_DEMOS.md` and sales guidance in
`demos/SALES_PLAYBOOK.md`. Launch-ready positioning, buyer personas, USP
matrix, competitive framing, marketplace copy, and landing-page copy are
available in `MARKETING.md`.

## Production Configuration

For production use, configure real database connectivity and signing outside
source control:

```bash
CODEXDB_DEFAULT_ENV=production
CODEXDB_REQUIRE_LIVE_CONNECTION=true
CODEXDB_MIGRATION_SIGNING_KEY=<hmac-secret>
```

Optional connector settings are documented in `.env.example`.

If `CODEXDB_REQUIRE_LIVE_CONNECTION=true` is enabled, the runtime blocks silent
mock fallbacks. Missing drivers, secrets, or connection data produce an explicit
readiness failure instead of a false-positive success.

## Safety Model

- Low-risk read workflows may run automatically.
- Medium-risk actions require human approval.
- High-risk actions are blocked by policy.
- Critical actions are sandbox-only.
- Write-like flows default to dry-run behavior where applicable.
- Dangerous SQL patterns are rejected before adapter execution in normal
  query/simulation paths.

Migration-like tools produce or validate rollback plans, safety checks,
execution metadata, and migration signing artifacts.

## Key Runtime Files

- `runtime/orchestrator.js`: deterministic tool dispatcher.
- `runtime/policyEngine.js`: policy decisions and production controls.
- `runtime/riskEngine.js`: risk classification.
- `runtime/sqlSafety.js`: SQL safety checks.
- `runtime/db/`: SQL Server and PostgreSQL adapters.
- `runtime/tool-manifest.json`: tool catalog.
- `scripts/plugin-readiness-report.js`: release readiness report.

## Main Tool Areas

- Inventory: `list_databases`, `list_tables`, `describe_table`,
  `describe_relationships`.
- Query analysis: `explain_query`, `query_stats`, `plan_deep_diagnostics`,
  `plan_diff_intelligence`, `query_plan_narrator`.
- Performance: `wait_event_root_cause`, `lock_analysis`, `deadlock_simulator`,
  `index_usage`, `index_roi_simulator`, `statistics_health_doctor`.
- Migration: `propose_migration`, `rollback_migration`,
  `ai_migration_risk_radar`, `migration_twin_simulator`,
  `rollback_rehearsal_engine`.
- Governance: `classify_risk`, `audit_query`, `enforce_policy`,
  `validate_compliance`, `production_readiness_check`.
- Operations: `release_readiness_report`, `run_health_assessment`,
  `incident_analysis`, `fleet_health_scorecard`, `sql_performance_advisor`.
- Closed-loop autonomous operator: `objective_to_ops_plan`,
  `autonomous_experiment_planner`, `counterfactual_risk_engine`,
  `decision_evidence_compiler`, `next_best_safe_action`,
  `autonomous_ops_briefing`.
- AI cognitive control plane: `ai_strategy_synthesizer`,
  `cognitive_schema_mapper`, `llm_prompt_risk_auditor`,
  `ai_decision_simulator`, `autonomous_learning_backlog`,
  `knowledge_gap_detector`, `ai_trust_scorecard`,
  `semantic_incident_predictor`, `cross_agent_consensus_builder`,
  `ai_roi_narrative_generator`.

See `runtime/tool-manifest.json` for the full tool list.
