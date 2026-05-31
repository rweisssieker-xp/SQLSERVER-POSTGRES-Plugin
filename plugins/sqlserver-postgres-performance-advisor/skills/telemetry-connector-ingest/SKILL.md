---
name: telemetry-connector-ingest
description: Normalize OpenTelemetry-like metrics and route them into correlation, anomaly triage, and incident analysis.
---

# Telemetry Connector Ingest

Use this skill when importing metrics or wait events from OTEL-compatible
observability systems.

Run:

```bash
node runtime/runTool.js telemetry_connector_ingest '{"provider":"otel","signals":[{"name":"db.query.duration","value":950,"unit":"ms"}]}'
```

The output contains normalized signals, correlation refs, severity, and routing
targets.
