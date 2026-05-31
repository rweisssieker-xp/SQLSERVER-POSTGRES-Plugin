# Operating Excellence USPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ten more AI/KI SQL advisor features for operational excellence across plans, SLOs, index retirement, hotfixes, tenants, partitioning, statistics, connection pools, restore readiness, and vendor mapping.

**Architecture:** Keep the existing deterministic tool pattern: tests first, functions in `runtime/orchestrator.js`, tool manifest entries, skill docs, README/CHANGELOG updates, then full verification.

**Tech Stack:** Node.js CommonJS, `node:test`, existing dispatch runtime, no new dependencies.

---

### Task 1: Red Tests
- [ ] Create `tests/operating-excellence-usps.test.js`.
- [ ] Add tests for ten new tools.
- [ ] Verify they fail with `Unknown tool`.

### Task 2: Runtime
- [ ] Add ten deterministic functions to `runtime/orchestrator.js`.
- [ ] Register handlers and manifest entries.
- [ ] Verify focused tests pass.

### Task 3: Docs
- [ ] Add skill docs.
- [ ] Update README and CHANGELOG.

### Task 4: Verification
- [ ] Run `npm test`, manifest coverage, all-tool smoke, audit, and readiness.
