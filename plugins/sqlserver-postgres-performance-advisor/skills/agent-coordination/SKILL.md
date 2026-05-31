---
name: agent-coordination
description: "Plan policy-gated multi-agent execution for database optimization, governance, and incident work."
---

# Agent Coordination

## Use when
- User asks how the agent system should divide database work.
- A task needs query, tuning, security, compliance, cost, or incident agents.

## Workflow
1. Normalize the objective and risk level.
2. Select agents through the runtime orchestration policy.
3. Return ordered responsibilities and execution controls.

## Governance
- High-risk plans require human review before execution.
- Keep delegated tasks explicit and replayable.

## Output
- `objective`, `coordinationPlan`, `agentPlan`
