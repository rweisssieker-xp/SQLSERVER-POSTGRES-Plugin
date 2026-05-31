---
name: prometheus-connector-ingest
description: Normalize Prometheus-style metrics for health assessment and telemetry correlation.
---

# Prometheus Connector Ingest

Run:

```bash
node runtime/runTool.js prometheus_connector_ingest '{"metrics":[{"name":"db_qps","value":42}]}'
```

Returns normalized metrics and downstream routing targets.
