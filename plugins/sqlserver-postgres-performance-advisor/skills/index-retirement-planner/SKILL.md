---
name: index-retirement-planner
description: Plans safe retirement of unused high-write-cost indexes.
---

# Index Retirement Planner

Run:

```bash
node runtime/runTool.js index_retirement_planner '{"indexes":[{"name":"ix_unused","reads":0,"writes":500,"lastUsedDays":120}]}'
```

Returns retirement candidates and safety steps.
