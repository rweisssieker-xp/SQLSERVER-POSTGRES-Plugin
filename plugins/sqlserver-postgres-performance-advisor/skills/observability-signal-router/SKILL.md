---
name: observability-signal-router
description: Routes waits, plan changes, SLO breaches, and capacity signals to the right advisor tools.
---

# Observability Signal Router

Run:

```bash
node runtime/runTool.js observability_signal_router '{"signals":[{"type":"wait","waitType":"LCK_M_X"},{"type":"plan_change"}]}'
```

Returns advisor tool routes and routing mode.
