---
name: release-train-risk-board
description: Aggregates release train database risk and emits go, review, or hold decisions.
---

# Release Train Risk Board

Run:

```bash
node runtime/runTool.js release_train_risk_board '{"releases":[{"id":"rel-1","changes":[{"riskLevel":"high"}]}]}'
```

Returns ranked release board and decisions.
