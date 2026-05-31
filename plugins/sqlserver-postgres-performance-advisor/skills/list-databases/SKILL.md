---
name: list-databases
description: "List all available SQL Server and PostgreSQL databases in the configured environment. Validate environment identity and emit only non-sensitive metadata unless explicit includeMetadata policy is enabled."
---

# List Databases

## Use when
- User asks for available databases, environments, or top-level catalog inventory.
- A governance audit or migration plan needs a canonical source list.

## Preconditions
- Resolve connection profile and environment context first.
- Confirm read scope with user if multiple environments are configured.

## Workflow
1. Load configured connection aliases and validate authentication.
2. Enumerate databases with connection metadata (`name`, `owner`, `state`).
3. Exclude system and hidden databases unless `includeSystem` is requested.
4. Return a stable, deterministic list sorted alphabetically.

## Governance
- Never disclose secrets, DSNs, or raw credentials.
- If environment policy requires explicit approval for cross-environment reads, request confirmation before proceeding.

## Output
- `database`, `engine`, `state`, `lastUsedHint`
- short risk note for each environment if unavailable or read-restricted
