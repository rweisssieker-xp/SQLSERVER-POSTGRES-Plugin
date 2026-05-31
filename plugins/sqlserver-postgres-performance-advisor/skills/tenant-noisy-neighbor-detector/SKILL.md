---
name: tenant-noisy-neighbor-detector
description: Finds tenant-level resource outliers and noisy-neighbor risks.
---

# Tenant Noisy Neighbor Detector

Run:

```bash
node runtime/runTool.js tenant_noisy_neighbor_detector '{"tenants":[{"tenantId":"a","cpuMs":90000,"reads":1000000,"calls":100}]}'
```

Returns noisy tenants and actions.
