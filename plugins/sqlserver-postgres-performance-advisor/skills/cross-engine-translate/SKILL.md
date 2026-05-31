---
name: cross-engine-translate
description: "Translate SQL between SQL Server and PostgreSQL with explicit compatibility notes."
---

# Cross Engine Translate

## Use when
- A migration or query draft must move between SQL Server and PostgreSQL.
- You need explicit semantic compatibility checks before apply.

## Workflow
1. Detect source and target dialect.
2. Apply deterministic compatibility rewrites and mark incompatible spots.
3. Return translated SQL and migration hints.

## Governance
- Never treat translations as fully equivalent without explicit review.
- Return semantic risk warnings for identity, locking, and pagination semantics.

## Output
- `sourceEngine`, `targetEngine`, `translation`, `compatibility`
