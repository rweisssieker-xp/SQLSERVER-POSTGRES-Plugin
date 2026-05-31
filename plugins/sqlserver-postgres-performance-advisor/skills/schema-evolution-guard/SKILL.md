---
name: schema-evolution-guard
description: Detect performance and locking risks in planned schema changes before release.
---

# Schema Evolution Guard

Run:

```bash
node runtime/runTool.js schema_evolution_guard '{"changes":[{"type":"add_foreign_key","table":"orders","column":"customer_id","hasSupportingIndex":false}]}'
```

Returns release risk, findings, and mitigations.
