---
name: optimize-query
description: "Suggest and prepare low-risk query rewrites plus index/plan alternatives, with explainability and impact estimates."
---

# Optimize Query

## Use when
- User requests query speed-up or better index usage.
- Tuning agent proposes rewrite candidates.

## Workflow
1. Run explain analysis and identify bottlenecks.
2. Generate candidate rewrites in order of least risk.
3. Estimate gain, side effects, and validation tests.
4. Return rollout-safe plan with canary strategy.

## Governance
- Never apply rewrites automatically in production.
- Exclude rewrites touching data semantics without explicit approval.

## Output
- `rewrites`, `explainDiff`, `expectedGain`, `regressionRisk`, `validationSql`
