---
name: classify-risk
description: "Classify SQL operations by risk level (LOW/MEDIUM/HIGH/CRITICAL) and required control actions."
---

# Classify Risk

## Use when
- Query execution is requested and pre-flight control is required.

## Workflow
1. Parse SQL into AST and classify statement type.
2. Detect destructive, privileged, and policy-violating patterns.
3. Estimate impact and blast radius.
4. Map to governance action: auto-run, human confirmation, block, or sandbox only.

## Governance
- Default to the strictest policy when uncertainty exists.
- Return risk rationale and controls applied.

## Output
- `riskLevel`, `riskSignals`, `requiredAction`, `policyReferences`
