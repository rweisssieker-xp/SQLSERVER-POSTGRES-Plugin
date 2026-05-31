---
name: plan-regression-watch
description: Detects query plan regressions from plan hash changes and tail latency drift.
---

# Plan Regression Watch

Run:

```bash
node runtime/runTool.js plan_regression_watch '{"snapshots":[{"capturedAt":"2026-05-28T10:00:00Z","queryId":"q1","planHash":"aaa","p95Ms":120},{"capturedAt":"2026-05-29T10:00:00Z","queryId":"q1","planHash":"bbb","p95Ms":420}]}'
```

Returns regression findings, rollback candidate plan hash, and next actions.
