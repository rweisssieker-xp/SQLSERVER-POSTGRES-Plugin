---
name: capacity-headroom-forecast
description: Forecasts storage, CPU, and IO saturation risk from growth and utilization signals.
---

# Capacity Headroom Forecast

Run:

```bash
node runtime/runTool.js capacity_headroom_forecast '{"currentSizeGb":820,"maxSizeGb":1000,"dailyGrowthGb":15,"cpuP95Pct":88,"ioP95Pct":74}'
```

Returns days to saturation, resource risks, and capacity actions.
