---
name: run-health-assessment
description: Summarize readiness, query stats, replication, and telemetry into an operator health report.
---

# Run Health Assessment

Run:

```bash
node runtime/runTool.js run_health_assessment '{"engine":"postgres","database":"analytics","schema":"public","table":"events"}'
```

Returns a compact health summary and detailed sections.
