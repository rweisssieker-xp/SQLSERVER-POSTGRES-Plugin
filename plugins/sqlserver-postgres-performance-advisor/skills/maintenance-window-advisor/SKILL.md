---
name: maintenance-window-advisor
description: Converts stale statistics, dead tuples, bloat, and write pressure into a safe database maintenance runbook.
---

# Maintenance Window Advisor

Run:

```bash
node runtime/runTool.js maintenance_window_advisor '{"engine":"postgres","tables":[{"table":"events","deadTuplePct":28,"statsAgeHours":96,"bloatPct":35,"writeQps":200}]}'
```

Returns prioritized table actions, safety gates, and maintenance-window risk.
