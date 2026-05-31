# Marketplace Submission Notes

CodexDB Agent is a Codex plugin for safety-governed SQL Server and PostgreSQL
analysis, performance diagnostics, migration planning, and policy-controlled
database operations.

## Marketplace Install Path

Submit the plugin directory URL:

```text
https://github.com/rweisssieker-xp/SQLSERVER-POSTGRES-Plugin/tree/master/plugins/sqlserver-postgres-performance-advisor
```

Users can install the plugin with:

```bash
npx codex-marketplace add rweisssieker-xp/SQLSERVER-POSTGRES-Plugin/plugins/sqlserver-postgres-performance-advisor --plugin --project
```

## Required Manifest

The marketplace scanner expects a plugin manifest at the repository root:

```text
.codex-plugin/plugin.json
```

The nested plugin directory also keeps its local manifest for development:

```text
plugins/sqlserver-postgres-performance-advisor/.codex-plugin/plugin.json
```

The submitted artifact must stay at or below the scanner file-count limit of
128 files. The repository keeps a compact marketplace skill set for submission
while the runtime manifest remains the source of truth for executable tools.

## Safety Positioning

This plugin is an advisor and governed operations layer. It is not a replacement
for SSMS, DataGrip, dbForge, SSDT, Redgate SQL Prompt, SQL Sentry, or other IDE
and monitoring suites. It focuses on deterministic advisory workflows, evidence
packages, policy gates, rollback planning, and Codex skill orchestration.

## Disruptive AI Demo Positioning

Default narrative:

```text
Autonomous Database Operations without autonomous production risk.
```

Use `demos/enterprise-ai-usp-scenarios.json` for machine-readable marketplace
demos and `demos/KILLER_DEMOS.md` for the curated talk track. The killer demos
show unsafe prompt escalation, board-level operator briefings, cross-agent
disagreement before a wrong index, and executive ROI storytelling while staying
in closed-loop dry-run mode.

The formal output expectations for the autonomous operator and AI cognitive
control-plane tools are declared in `runtime/tool-contracts.json`.

## Marketing Assets

Use `MARKETING.md` for launch-ready product messaging, buyer personas, USP
matrix, competitive positioning, marketplace copy, landing-page copy, FAQ,
pricing narrative, and launch blurb.

Use `demos/SALES_PLAYBOOK.md` for discovery questions, qualification signals,
demo sequencing, objection handling, follow-up email copy, and pilot success
criteria.
