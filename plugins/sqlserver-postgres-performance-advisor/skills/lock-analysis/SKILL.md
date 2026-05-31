---
name: lock-analysis
description: "Analyze lock topologies, wait chains, and deadlock-prone paths for a selected window."
---

# Lock Analysis

## Use when
- User reports blocking/deadlock symptoms.
- Incident analysis requests lock graph reconstruction.

## Workflow
1. Confirm window and database context.
2. Pull wait graph snapshots and top waiters/holders.
3. Build chain summary with blocking depth and session roles.
4. Recommend non-invasive mitigations first, then structural fixes.

## Governance
- Do not run invasive diagnostics on high-risk production windows without explicit approval.
- Avoid exposing raw session identifiers unless necessary and policy permits.

## Output
- `deadlockRisk`, `topWaiters`, `blockingChains`, `remediationPlan`
