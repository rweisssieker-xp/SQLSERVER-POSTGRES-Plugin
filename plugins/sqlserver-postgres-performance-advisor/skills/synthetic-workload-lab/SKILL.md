---
name: synthetic-workload-lab
description: Builds anonymized synthetic data and workload replay plans from schema shape and query families.
---

# Synthetic Workload Lab

Run:

```bash
node runtime/runTool.js synthetic_workload_lab '{"tables":[{"table":"orders","rowCount":1000000,"piiColumns":["email"]}],"queryFamilies":[{"fingerprint":"orders by status","calls":2000}]}'
```

Returns masked synthetic data plan and workload script.
