---
name: evolve-indexes
description: "Recommend autonomous index evolution steps from workload and schema signals."
---

# Evolve Indexes

## Use when
- User asks which indexes should be created, reviewed, or retired.
- Workload analysis identifies scan-heavy or high-latency access paths.

## Workflow
1. Resolve engine, database, schema, and table.
2. Compare row-count, existing index, and workload hints.
3. Return a staged evolution plan with validation and rollback.

## Governance
- Treat every DDL as dry-run until explicitly applied through governed write tools.
- Validate benefit against write amplification and storage cost.

## Output
- `recommendations`, `evolutionPlan`
