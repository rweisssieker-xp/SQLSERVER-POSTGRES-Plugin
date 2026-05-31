---
name: schema-compare-intelligence
description: Explains schema diffs by added columns, foreign-key/index risk, and migration intent.
---

# Schema Compare Intelligence

Run:

```bash
node runtime/runTool.js schema_compare_intelligence '{"before":[{"table":"orders","columns":["id"]}],"after":[{"table":"orders","columns":["id","customer_id"],"foreignKeys":[{"column":"customer_id","indexed":false}]}]}'
```

Returns diff summary, risks, and inferred intent.
