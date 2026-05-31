---
name: cost-to-performance-advisor
description: Balance monthly database cost change against expected latency improvement and efficiency.
---

# Cost To Performance Advisor

Run:

```bash
node runtime/runTool.js cost_to_performance_advisor '{"currentMonthlyCost":1200,"projectedMonthlyCost":1500,"currentP95Ms":900,"projectedP95Ms":300}'
```

Returns cost delta, latency improvement, efficiency, and recommendation.
