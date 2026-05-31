---
name: create-index
description: "Propose and prepare controlled index creation with safety checks and rollback strategy."
---

# Create Index

## Use when
- User wants index creation based on query pattern or tuning recommendations.

## Workflow
1. Validate index design against workload and storage constraints.
2. Recommend ONLINE/CONCURRENT options where supported.
3. Emit create statement draft plus create/drop fallback plan.
4. Queue post-create validation checklist (selectivity, plan shifts, lock impact).

## Governance
- Mark as WRITE with human confirmation required in production unless explicitly pre-approved.
- If HIGH risk, route through change ticket template.

## Output
- `indexStatement`, `safetyChecks`, `validationPlan`, `rollbackPlan`
