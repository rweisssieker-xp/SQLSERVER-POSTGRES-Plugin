---
name: cost-intelligence
description: "Rank query and infrastructure cost drivers with unit-economics and budget controls."
---

# Cost Intelligence

## Use when
- User asks for cost impact, dominant resource usage, or budget risk.
- A query or migration needs cost-aware approval evidence.

## Workflow
1. Estimate CPU, IO, lock, and latency deltas.
2. Rank dominant cost drivers.
3. Return unit economics and recommended budget controls.

## Governance
- High-cost or high-risk changes require dry-run and human review.
- Include assumptions and confidence with every estimate.

## Output
- `estimatedCost`, `costDrivers`, `unitEconomics`, `budgetControls`
