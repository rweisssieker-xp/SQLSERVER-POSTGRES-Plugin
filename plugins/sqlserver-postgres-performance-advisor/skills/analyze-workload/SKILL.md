---
name: analyze-workload
description: "Perform semantic workload analysis and propose workload-specific optimization, migration, and cost-control actions."
---

# Analyze Workload

## Use when
- User asks for recurring workload health review.
- Preparing capacity planning or optimization roadmap.

## Workflow
1. Aggregate query shape, frequency, and cost metrics.
2. Cluster recurring patterns and outliers.
3. Correlate with index and lock patterns.
4. Return a prioritized remediation backlog with effort and risk.

## Governance
- Keep recommendations explainable and cite evidence.
- Do not include PII-bearing samples in workload summaries.

## Output
- `workloadClusters`, `opportunityList`, `riskRanking`, `nextActions`
