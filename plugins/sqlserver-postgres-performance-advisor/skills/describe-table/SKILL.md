---
name: describe-table
description: "Describe column types, constraints, indexes, and relationship hints for a table in SQL Server or PostgreSQL."
---

# Describe Table

## Use when
- User requests schema details, key structure, or constraint/index impact.

## Workflow
1. Confirm table and schema and resolve quoting rules for target engine.
2. Return column profile: types, defaults, nullability, PK/FK, unique, and check constraints.
3. Return index inventory with usage/uniqueness context if available.
4. Emit relationship hints (inferred joins, upstream/downstream candidates).

## Governance
- Avoid returning large binary payloads unless user explicitly asks.
- Mask sensitive sample literals and never emit raw secrets.

## Output
- `columns`, `constraints`, `indexes`, `relationships`, `riskNotes`
