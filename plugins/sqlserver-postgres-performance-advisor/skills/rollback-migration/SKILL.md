---
name: rollback-migration
description: "Execute or prepare rollback flow for a prior migration with state verification and recovery checkpoints."
---

# Rollback Migration

## Use when
- User needs safe undo path after failed or risky rollout.

## Workflow
1. Confirm migration id, environment, and dependency lock.
2. Verify preconditions and snapshot/baseline availability.
3. Execute or draft rollback sequence with transactional checks.
4. Validate resulting schema and workload health signal.

## Governance
- Only proceed after explicit human approval in production.
- Capture before/after evidence and incident notes.

## Output
- `rollbackExecuted`, `verificationResult`, `residualRisk`, `postRollbackChecks`
