# Advisor 10 USPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ten end-to-end SQL performance advisor USP tools that turn existing diagnostics into evidence packs, experiments, migration performance prediction, workload replay risk, index portfolio optimization, incident timelines, evidence grading, change-ticket export, cost-to-performance advice, and schema-evolution performance guardrails.

**Architecture:** Follow the existing plugin pattern: deterministic functions in `runtime/orchestrator.js`, entries in `runtime/tool-manifest.json`, one skill doc per tool under `skills/<tool-name>/SKILL.md`, and Node test coverage in `tests/advisor-usps-core.test.js`. Keep all tools offline and side-effect free, returning structured outputs that can later consume live evidence.

**Tech Stack:** Node.js CommonJS, `node:test`, existing runtime dispatch/policy wrapper, no new dependencies.

---

### Task 1: Core USP Tests

**Files:**
- Create: `plugins/sqlserver-postgres-performance-advisor/tests/advisor-usps-core.test.js`

- [ ] **Step 1: Write failing tests**

Create tests for:
`evidence_pack_generator`, `auto_tuning_experiment_designer`, `migration_performance_predictor`, `workload_replay_risk_simulator`, `index_portfolio_optimizer`, `incident_timeline_builder`, `advisor_confidence_grader`, `change_ticket_exporter`, `cost_to_performance_advisor`, and `schema_evolution_guard`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests\advisor-usps-core.test.js`
Expected: FAIL with `Unknown tool`.

### Task 2: Runtime Functions And Dispatch

**Files:**
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/orchestrator.js`

- [ ] **Step 1: Add deterministic functions**

Add one function per USP, each returning `usp`, structured evidence, recommendation/action fields, and `source: "analysis"`.

- [ ] **Step 2: Register handlers**

Add all ten handlers to `toolHandlers`.

- [ ] **Step 3: Verify GREEN**

Run: `node --test tests\advisor-usps-core.test.js`
Expected: PASS.

### Task 3: Manifest, Skill Docs, README, Changelog

**Files:**
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/tool-manifest.json`
- Modify: `plugins/sqlserver-postgres-performance-advisor/README.md`
- Modify: `plugins/sqlserver-postgres-performance-advisor/CHANGELOG.md`
- Create: ten `skills/*/SKILL.md` files

- [ ] **Step 1: Register manifest tools**

Add all ten tools to the runtime tool list.

- [ ] **Step 2: Add skill docs**

Each skill doc includes name, description, run command, and output summary.

- [ ] **Step 3: Update README and changelog**

Document the new USP layer and outputs.

### Task 4: Full Verification

**Files:**
- No new files.

- [ ] **Step 1: Run full tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run manifest smoke**

Dispatch all manifest tools with representative args.
Expected: all tools pass.

- [ ] **Step 3: Run audit and readiness**

Run: `npm audit --audit-level=moderate` and `npm run readiness`.
Expected: audit clean; readiness may remain false only for missing real production env.
