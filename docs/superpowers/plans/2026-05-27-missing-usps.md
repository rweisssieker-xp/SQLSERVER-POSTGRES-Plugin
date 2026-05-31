# Missing USPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the remaining PRD USP capabilities as deterministic CodexDB runtime tools.

**Architecture:** Extend the existing Node.js runtime without changing its policy/audit envelope. Each new USP is a `runtime/orchestrator.js` handler, surfaced in `runtime/tool-manifest.json`, documented by a skill file, and covered by Node's built-in test runner.

**Tech Stack:** Node.js CommonJS, `node:test`, local JSON memory, existing Codex plugin skill files.

---

### Task 1: USP Tool Tests

**Files:**
- Create: `plugins/sqlserver-postgres-performance-advisor/tests/usp-tools.test.js`

- [ ] **Step 1: Write failing tests**

Create tests that dispatch `retrieve_context`, `query_time_machine`, `deadlock_simulator`, `evolve_indexes`, `describe_business_layer`, `cost_intelligence`, `telemetry_correlation`, and `agent_coordination`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/usp-tools.test.js`
Expected: FAIL with `Unknown tool` for the first missing USP.

### Task 2: Runtime USP Handlers

**Files:**
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/orchestrator.js`
- Modify: `plugins/sqlserver-postgres-performance-advisor/runtime/tool-manifest.json`

- [ ] **Step 1: Add handler implementations**

Implement deterministic handlers using existing helpers: `classify`, `remember`, `recall`, `buildSemanticGraph`, `summarize`, `correlateSignals`, and `orchestrateAgents`.

- [ ] **Step 2: Register handlers**

Add the new names to `toolHandlers` and `tool-manifest.json`.

- [ ] **Step 3: Run tests**

Run: `node --test tests/usp-tools.test.js`
Expected: PASS.

### Task 3: Skill Docs And PRD Mapping

**Files:**
- Create skill folders for each new USP under `plugins/sqlserver-postgres-performance-advisor/skills/`
- Modify: `plugins/sqlserver-postgres-performance-advisor/README.md`
- Modify: `plugins/sqlserver-postgres-performance-advisor/PRD_IMPLEMENTATION_MAP.md`
- Modify: `plugins/sqlserver-postgres-performance-advisor/PRD_COMPLETION_REPORT.md`

- [ ] **Step 1: Add skill files**

Each new tool gets a concise `SKILL.md` covering inputs, behavior, and expected output.

- [ ] **Step 2: Update documentation**

Mark the previously missing PRD USPs as implemented at deterministic MVP level.

- [ ] **Step 3: Verify representative tools**

Run `node runtime/runTool.js <tool> '{}'` for representative new tools and check JSON output.
