---
name: replication-status
description: "Check replication lag, lag trend, failover-readiness indicators, and cross-node consistency risks."
---

# Replication Status

## Use when
- User requests replication health check.
- Incident review includes lag or failover concerns.

## Workflow
1. Resolve primary/secondary/topology map.
2. Pull lag metrics, retry backlog, and recovery position.
3. Correlate with deployment or load events in selected window.
4. Return risk score and recommended actions.

## Governance
- Do not promote manual failover suggestions without explicit governance approval.
- Keep remediation suggestions non-destructive by default.

## Output
- `topology`, `lagSeconds`, `trend`, `consistencyRisk`, `actions`
