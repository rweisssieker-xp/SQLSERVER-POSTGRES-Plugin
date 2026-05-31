---
name: grafana-annotation-export
description: Build Grafana annotation payloads for incidents, rollouts, and query regressions.
---

# Grafana Annotation Export

Run:

```bash
node runtime/runTool.js grafana_annotation_export '{"incidentId":"inc-1","text":"query regression"}'
```

Returns a dry-run annotation unless Grafana environment variables are configured.
