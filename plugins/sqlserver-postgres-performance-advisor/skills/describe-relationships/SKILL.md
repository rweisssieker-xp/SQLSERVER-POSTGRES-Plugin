---
name: describe-relationships
description: "Reveal inferred and catalog-defined relationships between entities, including cardinality, join-risk, and policy-aware traversal guidance."
---

# Describe Relationships

## Use when
- User asks for dependency graph, join candidates, or migration impact paths.

## Workflow
1. Resolve requested domain/schemas.
2. Merge catalog FK metadata with query-pattern hints.
3. Compute relationship criticality using cascade/deadlock/PII risk heuristics.
4. Return ranked relationship graph snippets.

## Governance
- Flag relationships that cross regulated domains.
- Request human confirmation before sharing broad dependency graphs outside the approved scope.

## Output
- `edges`, `cardinality`, `risk`, `criticalPathHint`
