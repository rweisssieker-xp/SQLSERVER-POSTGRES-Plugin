---
name: describe-business-layer
description: "Map relational schema structures into business entities, sensitivity domains, and operational criticality."
---

# Describe Business Layer

## Use when
- User needs a semantic business view of technical database tables.
- Governance work needs domains, sensitivity, and critical paths.

## Workflow
1. Build the semantic schema graph.
2. Translate tables into business entities and domains.
3. Emit governance hints for regulated or operationally critical data.

## Governance
- Flag PII-bearing entities for masking, retention, and narrow projection.
- Keep business inference explicit and reviewable.

## Output
- `businessEntities`, `semanticSummary`, `governanceHints`
