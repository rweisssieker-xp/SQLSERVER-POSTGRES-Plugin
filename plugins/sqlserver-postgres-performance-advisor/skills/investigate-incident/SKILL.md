---
name: investigate-incident
description: Run incident triage, causal graph generation, and self-healing playbook selection.
---

# Investigate Incident

Run:

```bash
node runtime/runTool.js investigate_incident '{"engine":"postgres","database":"analytics","deploymentId":"deploy-42"}'
```

Returns triage, causal graph, playbook, and next actions.
