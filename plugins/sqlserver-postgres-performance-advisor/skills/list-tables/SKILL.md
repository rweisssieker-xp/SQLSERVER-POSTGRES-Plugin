---
name: list-tables
description: "Enumerate tables (and optionally views/materialized views) for selected schema and database, while honoring row-level access policy constraints."
---

# List Tables

## Use when
- User asks what tables exist for a domain/schema.
- Orchestrator needs table inventory before dependency, migration, or tuning analysis.

## Workflow
1. Confirm target database + schema context.
2. Fetch table-type objects and key metadata: row counts, row width category, and freshness marker.
3. Optionally include views and materialized views if requested.
4. Present in grouped output by schema.

## Governance
- Respect policy that blocks metadata discovery in restricted schemas.
- Surface access limitations instead of returning empty lists.

## Output
- `schema`, `table`, `type`, `rowCountHint`, `indexCount`, `containsPIIFlag`
