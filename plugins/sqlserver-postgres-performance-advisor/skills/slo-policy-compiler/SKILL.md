---
name: slo-policy-compiler
description: Converts service SLO intent into database change guardrails.
---

# SLO Policy Compiler

Run:

```bash
node runtime/runTool.js slo_policy_compiler '{"service":"checkout","p95Ms":300,"errorBudgetBurnRate":2}'
```

Returns policy and guardrails.
