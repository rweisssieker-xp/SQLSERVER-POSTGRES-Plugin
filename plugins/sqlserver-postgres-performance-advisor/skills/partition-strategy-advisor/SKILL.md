---
name: partition-strategy-advisor
description: Recommends partition strategy from table size, time column, and growth rate.
---

# Partition Strategy Advisor

Run:

```bash
node runtime/runTool.js partition_strategy_advisor '{"table":"events","rowCount":500000000,"timeColumn":"created_at","dailyGrowthRows":5000000}'
```

Returns partition strategy and cadence.
