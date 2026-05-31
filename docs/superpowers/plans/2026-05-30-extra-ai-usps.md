# Extra AI USPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add another layer of AI/KI SQL advisor features for code review, schema intelligence, contracts, observability, rollback rehearsal, fleet health, and developer coaching.

**Architecture:** Follow the existing deterministic runtime pattern: add tests first, implement functions in `runtime/orchestrator.js`, register tools in `runtime/tool-manifest.json`, add skill docs, and update README/CHANGELOG.

**Tech Stack:** Node.js CommonJS, `node:test`, existing dispatch runtime, no new dependencies.

---

### Task 1: Red Tests

- [ ] Create `plugins/sqlserver-postgres-performance-advisor/tests/extra-usps.test.js`.
- [ ] Add tests for ten new tools.
- [ ] Run the focused test and confirm `Unknown tool` failures.

### Task 2: Runtime And Manifest

- [ ] Add ten deterministic functions to `runtime/orchestrator.js`.
- [ ] Register handlers.
- [ ] Add manifest entries.
- [ ] Run focused test until green.

### Task 3: Docs

- [ ] Add one skill doc per new tool.
- [ ] Update README and CHANGELOG.

### Task 4: Verification

- [ ] Run `npm test`.
- [ ] Run manifest coverage.
- [ ] Run all-tool smoke.
- [ ] Run audit and readiness.
