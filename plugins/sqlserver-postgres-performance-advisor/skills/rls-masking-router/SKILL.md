---
name: rls-masking-router
description: Build a tenant-scoped, PII-masked projection plan for safe reads across SQL Server and PostgreSQL.
---

# RLS Masking Router

Use this skill when a user needs a safe query shape for tenant-scoped data access
or PII-aware projection.

Run:

```bash
node runtime/runTool.js rls_masking_router '{"engine":"postgres","database":"analytics","schema":"public","table":"events","tenantId":"tenant-a","requestedColumns":["event_id","user_email","payload"]}'
```

The tool returns a route plan, masking decisions, governance controls, and safe
SQL with a tenant predicate.
