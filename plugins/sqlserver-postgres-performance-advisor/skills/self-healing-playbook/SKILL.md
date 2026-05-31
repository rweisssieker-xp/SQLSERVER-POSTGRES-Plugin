---
name: self-healing-playbook
description: "Generate repeatable, approval-aware runbooks for recurring operational incidents."
---

# Self-Healing DBA Playbook

## Use when
- You observe repeated lock, migration, or regression patterns.
- You need an actionable incident response path without manual reconstruction.

## Workflow
1. Read recent workload and policy-memory signals.
2. Produce prioritized scenarios with approval paths.
3. Include next-step playbook steps and evidence-backed rationale.

## Governance
- Playbooks are recommendations only; execution still requires explicit approval.
- Keep blast radius and rollback intent explicit in each scenario.

## Output
- `generatedAt`, `playbook`, `source`
