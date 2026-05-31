---
name: index-usage
description: "Inspect index usage and inefficiencies across tables to propose retention, rebuild, or removal candidates."
---

# Index Usage

## Use when
- User asks whether an index helps or hurts current workload.
- Tuning pass requires index ROI baseline.

## Workflow
1. Collect scan seek frequency and user-impacted index stats.
2. Segment by query family and environment.
3. Detect duplicate or low-usage indexes and high maintenance overhead candidates.
4. Return ranked suggestions with rollback-safe sequencing.

## Governance
- Never recommend dropping indexes without explicit user confirmation in production.
- Include recovery/validation steps for every potentially destructive suggestion.

## Output
- `index`, `usageScore`, `storageCost`, `maintenanceCost`, `recommendation`
