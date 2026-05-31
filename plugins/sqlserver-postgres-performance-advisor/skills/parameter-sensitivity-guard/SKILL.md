---
name: parameter-sensitivity-guard
description: Flags parameter-sensitive plan variance and recommends mitigation paths for SQL Server and PostgreSQL workloads.
---

# Parameter Sensitivity Guard

Run:

```bash
node runtime/runTool.js parameter_sensitivity_guard '{"executions":[{"parameterShape":"small","rows":10,"p95Ms":25,"planHash":"seek"},{"parameterShape":"large","rows":120000,"p95Ms":1800,"planHash":"scan"}]}'
```

Returns variance evidence, parameter-sensitivity status, and mitigation choices.
