---
name: data-skew-detector
description: Detects hot values and skew risk in tenant, status, date, and distribution columns.
---

# Data Skew Detector

Run:

```bash
node runtime/runTool.js data_skew_detector '{"column":"tenant_id","distribution":[{"value":"tenant-a","rows":900000},{"value":"tenant-b","rows":50000}]}'
```

Returns skew status, hot values, and index/statistics recommendations.
