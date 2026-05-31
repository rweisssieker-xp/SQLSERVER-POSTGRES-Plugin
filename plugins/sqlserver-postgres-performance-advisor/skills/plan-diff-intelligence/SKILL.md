---
name: plan-diff-intelligence
description: Compare before and after query plans and explain scan, join, cost, and cardinality changes.
---

# Plan Diff Intelligence

Run:

```bash
node runtime/runTool.js plan_diff_intelligence '{"beforePlan":{"scan":"Index Scan","join":"Nested Loop","cost":100},"afterPlan":{"scan":"Seq Scan","join":"Hash Join","cost":420}}'
```

Returns plan changes, likely causes, confidence, and next checks.
