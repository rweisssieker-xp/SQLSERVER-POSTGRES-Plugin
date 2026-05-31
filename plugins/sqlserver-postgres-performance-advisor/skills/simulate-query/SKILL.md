---
name: simulate-query
description: "Run safe simulation or dry-run for risky SQL to estimate impact before real execution."
---

# Simulate Query

## Use when
- Query risk level is MEDIUM/HIGH and execution safety requires estimation.

## Workflow
1. Validate query parseability and risk class.
2. Execute in controlled simulation mode with reduced blast radius settings where available.
3. Report estimated duration, affected rows, lock/timeouts, and rollback effort.
4. Ask for user confirmation before any non-simulated action.

## Governance
- Never simulate and execute in one step unless user explicitly allows.
- Log simulation inputs and outputs in audit trace.

## Output
- `affectedRowsEstimate`, `costEstimate`, `lockEstimate`, `rollbackPlan`
