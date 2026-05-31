---
name: compile-intent
description: "Compile natural language DB intent into a deterministic contract and policy-ready SQL execution plan."
---

# Compile Intent

## Use when
- User provides natural-language operational intent and needs structured execution framing.
- You need a reproducible, policy-checkable representation before tool execution.

## Workflow
1. Parse intent text into `intent_type`, `scope`, `risk_tier`, `expected_side_effects`, and `required_approvals`.
2. Build deterministic risk summary from SQL/risk classifier.
3. Produce a round-trip-validated SQL draft for traceability.

## Governance
- Only policy-consistent intent contracts pass through.
- Always return machine-parseable fields plus decision-reproducibility hints.

## Output
- `intentContract`, `compiledSql`, `roundTrip`
