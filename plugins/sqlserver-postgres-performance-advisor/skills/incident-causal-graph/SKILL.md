---
name: incident-causal-graph
description: "Build a causal incident graph from policy blocks and workload signal correlation."
---

# Incident Causal Graph

## Use when
- You need an evidence-first explanation of how policy events and workload signals correlate.

## Workflow
1. Read incident/policy signals from memory.
2. Compute a minimal causal graph (nodes/edges).
3. Return MTTD/MTTR estimates and confidence.

## Governance
- Do not execute changes from this tool; recommendations only.

## Output
- `incident_causal_graph`, `mttdMinutes`, `mttrMinutesEstimate`, `evidenceWindow`
