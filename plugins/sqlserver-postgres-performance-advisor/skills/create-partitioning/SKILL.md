---
name: create-partitioning
description: "Design and stage partitioning strategy aligned with workload and retention needs."
---

# Create Partitioning

## Use when
- User asks to reduce data size scan cost or improve archival performance.

## Workflow
1. Identify partition key candidates from access and age patterns.
2. Validate query compatibility and maintenance operations.
3. Draft create/attach/switch partition flow and cutover timeline.
4. Provide migration verification checkpoints.

## Governance
- Requires explicit production approval and backout plan.
- Include long-running lock and IO impact guardrails.

## Output
- `partitionPlan`, `ddlDraft`, `backoutPlan`, `healthChecks`
