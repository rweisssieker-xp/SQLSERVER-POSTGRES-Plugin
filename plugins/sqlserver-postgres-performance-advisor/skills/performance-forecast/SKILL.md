---
name: performance-forecast
description: Predict p95 latency and budget risk from query risk, baseline latency, and traffic growth.
---

# Performance Forecast

Use this skill before rollout when query or workload changes may affect SLOs or
cost budgets.

Run:

```bash
node runtime/runTool.js performance_forecast '{"sql":"SELECT * FROM events WHERE user_email = ''a@example.com''","baselineP95":120,"trafficGrowthPct":35,"budgetLimitUnits":80}'
```

The forecast returns predicted p95, budget units, risk level, confidence, and
recommendations.
