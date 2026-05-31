---
name: query-plan-narrator
description: Explains execution plans as action-oriented performance stories.
---

# Query Plan Narrator

Run:

```bash
node runtime/runTool.js query_plan_narrator '{"plan":{"Node Type":"Seq Scan","Relation Name":"events","Actual Rows":50000,"Plan Rows":100}}'
```

Returns plan story and next actions.
