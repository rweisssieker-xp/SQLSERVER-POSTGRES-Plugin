---
name: sql-performance-advisor
description: Top-level AI/KI SQL performance advisor that orchestrates detection, rewrite candidates, ranking, workload impact, benchmarks, and consultant answer.
---

# SQL Performance Advisor

Run:

```bash
node runtime/runTool.js sql_performance_advisor '{"question":"Optimize this events lookup","engine":"postgres","database":"analytics","schema":"public","table":"events","sql":"SELECT * FROM events WHERE user_email = ''a@example.com''"}'
```

Returns diagnosis, ranked recommendations, workload impact, optional benchmark,
consultant answer, and evidence chain.
