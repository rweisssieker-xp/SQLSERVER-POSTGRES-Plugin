---
name: connection-pool-advisor
description: Detects connection pool pressure and sizing risks.
---

# Connection Pool Advisor

Run:

```bash
node runtime/runTool.js connection_pool_advisor '{"maxConnections":100,"activeConnections":95,"waitMs":1500}'
```

Returns pool status, utilization, and actions.
