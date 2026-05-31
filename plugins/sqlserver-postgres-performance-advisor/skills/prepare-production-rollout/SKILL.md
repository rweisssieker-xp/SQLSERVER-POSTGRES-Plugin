---
name: prepare-production-rollout
description: Prepare a production rollout by combining rollout gates, verification evidence, and performance forecast.
---

# Prepare Production Rollout

Run:

```bash
node runtime/runTool.js prepare_production_rollout '{"engine":"postgres","database":"analytics","schema":"public","table":"events","proposedSql":"CREATE INDEX ix_events_email ON events(user_email)"}'
```

Returns rollout plan, verification gates, forecast, and operator checklist.
