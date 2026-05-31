---
name: query-time-machine
description: "Reconstruct historical query performance states and identify likely regression points."
---

# Query Time Machine

## Use when
- User asks why a query became slower over time.
- Incident triage needs historical plan, latency, or index-state reconstruction.

## Workflow
1. Select the query id, query hash, or SQL fingerprint.
2. Build a time-window timeline from historical runtime signals.
3. Identify the worst regression point and recommend replay evidence.

## Governance
- Do not apply changes; this is diagnostic-only.
- Include confidence and replay recommendations before remediation.

## Output
- `queryId`, `timeline`, `regressionPoint`, `reconstruction`
