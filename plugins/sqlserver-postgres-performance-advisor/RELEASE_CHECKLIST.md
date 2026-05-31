# Release Checklist

- [ ] `npm install` completes on a clean checkout.
- [ ] `npm test` passes.
- [ ] `npm audit --audit-level=moderate` passes.
- [ ] `npm run readiness` has no unexpected blockers.
- [ ] Production environments set `CODEXDB_REQUIRE_LIVE_CONNECTION=true`.
- [ ] Migration signing key is configured outside source control.
- [ ] PostgreSQL or SQL Server connection is configured for live evidence.
- [ ] Optional Prometheus, Grafana, pgvector, and Neo4j connectors are configured when used.
- [ ] Secrets are redacted in tool output and audit logs.
- [ ] Release notes in `CHANGELOG.md` match the shipped version.
