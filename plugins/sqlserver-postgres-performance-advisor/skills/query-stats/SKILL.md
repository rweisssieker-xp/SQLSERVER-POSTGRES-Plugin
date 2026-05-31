---
name: query-stats
description: "Retrieve workload and historical query statistics: duration, plan changes, tempdb/IO pressure, wait profiles, and regression signals."
---

# Query Stats

## Use when
- User asks for top consumers, slow query list, or workload trends.

## Workflow
1. Resolve time window and environment.
2. Pull top-N query families by resource footprint.
3. Correlate plan hash drift and runtime variance.
4. Highlight regression candidates.

## Governance
- Enforce retention and sampling limits configured by policy.
- Suppress literal SQL containing secrets or PII-heavy predicate constants.

## Output
- `queryId`, `avgMs`, `p95Ms`, `ioWait`, `cpuMs`, `regressionScore`
