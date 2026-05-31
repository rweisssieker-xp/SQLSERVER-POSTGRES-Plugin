---
name: propose-migration
description: "Generate a safe migration proposal with forward and rollback paths, deployment strategy, and compatibility analysis."
---

# Propose Migration

## Use when
- User requests schema evolution, new tables/columns, or index adjustments as code.

## Workflow
1. Parse desired schema change and environment target.
2. Validate naming conventions and dependency impact.
3. Generate forward migration and rollback script drafts.
4. Attach pre/post-checks and risk tags.

## Governance
- Never output destructive migrations (DROP without equivalent safety guard) without explicit risk confirmation.
- Include maintenance window and blast-radius estimate.

## Output
- `forwardSql`, `rollbackSql`, `dependencyGraph`, `riskProfile`, `validationChecklist`
