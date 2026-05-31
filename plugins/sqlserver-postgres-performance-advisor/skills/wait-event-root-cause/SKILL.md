---
name: wait-event-root-cause
description: Maps SQL Server and PostgreSQL wait pressure to likely root causes and next actions.
---

# Wait Event Root Cause

Run:

```bash
node runtime/runTool.js wait_event_root_cause '{"waits":[{"waitType":"LCK_M_X","waitMs":5000,"sessions":4}]}'
```

Returns primary cause, ranked wait findings, and action plan.
