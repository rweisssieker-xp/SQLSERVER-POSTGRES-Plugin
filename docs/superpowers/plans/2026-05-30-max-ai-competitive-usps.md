# Max AI Competitive USPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a maximum competitive AI/KI USP layer that differentiates the plugin from Redgate, Devart, Quest, Microsoft, JetBrains, Liquibase, and SolarWinds.

**Architecture:** Keep the existing deterministic plugin architecture: one runtime function per USP in `runtime/orchestrator.js`, one manifest entry, one skill doc, and one Node test suite. The tools should compose existing advisor signals into higher-level workflows without adding external dependencies.

**Tech Stack:** Node.js CommonJS, `node:test`, existing dispatch/policy runtime, no new packages.

---

### Task 1: Red Tests

**Files:**
- Create: `plugins/sqlserver-postgres-performance-advisor/tests/competitive-usps.test.js`

- [ ] Write tests for `autonomous_dba_copilot`, `performance_pr_reviewer`, `cross_tool_devops_analyzer`, `ai_guarded_sql_generator`, `synthetic_workload_lab`, `vendor_neutral_devops_brain`, `compliance_query_assistant`, `migration_twin_simulator`, `policy_gated_self_healing`, and `advisor_memory_recommender`.
- [ ] Run `node --test tests\competitive-usps.test.js`.
- [ ] Confirm the tests fail with `Unknown tool`.

### Task 2: Runtime And Manifest

**Files:**
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/orchestrator.js`
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/tool-manifest.json`

- [ ] Add deterministic implementations for the ten tools.
- [ ] Register handlers in `toolHandlers`.
- [ ] Add manifest entries.
- [ ] Run the focused test file until it passes.

### Task 3: Skill Docs And Public Docs

**Files:**
- Create: ten `plugins/sqlserver-postgres-performance-advisor/skills/*/SKILL.md` files
- Modify: `plugins/sqlserver-postgres-performance-advisor/README.md`
- Modify: `plugins/sqlserver-postgres-performance-advisor/CHANGELOG.md`

- [ ] Document each tool with run command and output summary.
- [ ] Add README/CHANGELOG entries.

### Task 4: Full Verification

**Files:**
- No new files.

- [ ] Run `npm test`.
- [ ] Run manifest coverage check.
- [ ] Run all-tool smoke.
- [ ] Run `npm audit --audit-level=moderate`.
- [ ] Run `npm run readiness`.
