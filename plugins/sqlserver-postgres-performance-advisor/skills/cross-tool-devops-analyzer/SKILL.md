---
name: cross-tool-devops-analyzer
description: Normalizes Flyway, Liquibase, SSDT, Redgate, dbForge, and ApexSQL artifacts into one risk and policy view.
---

# Cross Tool DevOps Analyzer

Run:

```bash
node runtime/runTool.js cross_tool_devops_analyzer '{"artifacts":[{"tool":"flyway","path":"V42__add_index.sql","content":"CREATE INDEX ix ON t(c)"}]}'
```

Returns normalized artifacts, operations, risk hints, and pipeline advice.
