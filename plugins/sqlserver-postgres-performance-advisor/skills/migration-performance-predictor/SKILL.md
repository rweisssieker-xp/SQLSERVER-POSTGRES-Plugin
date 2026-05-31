---
name: migration-performance-predictor
description: Predict SQL Server to PostgreSQL performance risks from query features, syntax, JSON, CTEs, collation, and parameterization.
---

# Migration Performance Predictor

Run:

```bash
node runtime/runTool.js migration_performance_predictor '{"sourceEngine":"sqlserver","targetEngine":"postgres","sql":"SELECT TOP 100 * FROM events"}'
```

Returns migration slowdown risks, risk level, recommendations, and target checks.
