---
name: auto-tuning-experiment-designer
description: Create controlled SQL tuning experiments with hypothesis, success criteria, abort criteria, and rollback plan.
---

# Auto Tuning Experiment Designer

Run:

```bash
node runtime/runTool.js auto_tuning_experiment_designer '{"hypothesis":"covering index reduces p95","candidateChange":"CREATE INDEX ix_orders_status ON orders(status)","baseline":{"p95Ms":700},"target":{"p95Ms":350}}'
```

Returns experiment design, measurement window, success criteria, abort criteria, and rollback plan.
