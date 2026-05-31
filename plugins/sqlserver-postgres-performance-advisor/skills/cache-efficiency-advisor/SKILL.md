---
name: cache-efficiency-advisor
description: Assesses buffer cache health, read amplification, and cache-pressure actions.
---

# Cache Efficiency Advisor

Run:

```bash
node runtime/runTool.js cache_efficiency_advisor '{"bufferHitRatio":0.82,"physicalReads":900000,"logicalReads":1200000,"table":"events"}'
```

Returns cache status, findings, and actions for reducing physical reads.
