---
name: workload-replay-risk-simulator
description: Estimate rollout blast radius by replaying workload shape against read, write, lock, and cache side-effect heuristics.
---

# Workload Replay Risk Simulator

Run:

```bash
node runtime/runTool.js workload_replay_risk_simulator '{"change":"add index","workload":[{"queryId":"q1","calls":2000,"p95Ms":120,"writesPerSecond":1}]}'
```

Returns risk score, side effects, and rollout recommendation.
