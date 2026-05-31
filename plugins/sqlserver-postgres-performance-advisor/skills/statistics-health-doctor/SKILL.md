---
name: statistics-health-doctor
description: Diagnoses stale statistics and cardinality-estimate maintenance needs.
---

# Statistics Health Doctor

Run:

```bash
node runtime/runTool.js statistics_health_doctor '{"stats":[{"table":"events","column":"tenant_id","ageHours":96,"modificationPct":35}]}'
```

Returns findings and actions.
