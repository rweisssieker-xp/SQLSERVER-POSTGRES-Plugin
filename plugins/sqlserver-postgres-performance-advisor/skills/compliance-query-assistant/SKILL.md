---
name: compliance-query-assistant
description: Rewrites SQL with tenant filters, PII masking, and audit controls.
---

# Compliance Query Assistant

Run:

```bash
node runtime/runTool.js compliance_query_assistant '{"sql":"SELECT email,total FROM orders","tenantId":"tenant-a","piiColumns":["email"]}'
```

Returns safe SQL, masked columns, and controls.
