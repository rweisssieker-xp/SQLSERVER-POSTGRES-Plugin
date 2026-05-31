---
name: incident-timeline-builder
description: Build a causal incident timeline from deployments, plan changes, waits, and SLO events.
---

# Incident Timeline Builder

Run:

```bash
node runtime/runTool.js incident_timeline_builder '{"events":[{"ts":"2026-05-30T10:00:00Z","type":"deployment","summary":"release 42"}]}'
```

Returns ordered timeline, narrative, likely cause, and next actions.
