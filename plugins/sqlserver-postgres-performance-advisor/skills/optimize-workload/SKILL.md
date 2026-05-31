---
name: optimize-workload
description: Coordinate rewrite lab, performance forecast, index evolution, and workload twin analysis.
---

# Optimize Workload

Run:

```bash
node runtime/runTool.js optimize_workload '{"engine":"postgres","database":"analytics","schema":"public","table":"events","sql":"SELECT * FROM events WHERE user_email = ''a@example.com''"}'
```

Returns optimization evidence and a recommendation.
