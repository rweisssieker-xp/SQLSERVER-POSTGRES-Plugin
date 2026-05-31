---
name: plan-deep-diagnostics
description: Deep execution-plan diagnostics for SQL Server and PostgreSQL plans, including cardinality, scan, stale statistics, and spill findings.
---

# Plan Deep Diagnostics

Run:

```bash
node runtime/runTool.js plan_deep_diagnostics '{"engine":"postgres","plan":{"Node Type":"Seq Scan","Plan Rows":100,"Actual Rows":50000,"Temp Read Blocks":20,"Relation Name":"events"}}'
```

Returns findings, evidence, plan hash, and next checks for the SQL performance advisor workflow.
