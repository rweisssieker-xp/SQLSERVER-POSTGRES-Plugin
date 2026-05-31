---
name: deadlock-simulator
description: "Predict deadlock risk from transaction lock ordering and wait-for graph patterns."
---

# Deadlock Simulator

## Use when
- User needs a deadlock-risk forecast before running concurrent writes.
- Incident analysis shows blocking chains or lock storms.

## Workflow
1. Normalize transaction lock requests.
2. Build a wait-for graph between sessions or transactions.
3. Classify deadlock risk and provide mitigations.

## Governance
- High-risk results require operator review before execution.
- Prefer lock-ordering changes and transaction-scope reduction over brute-force retries.

## Output
- `deadlockRisk`, `waitForGraph`, `mitigations`
