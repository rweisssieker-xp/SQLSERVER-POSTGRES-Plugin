---
name: environment-drift-detector
description: Detects database configuration drift across staging, production, and other environments.
---

# Environment Drift Detector

Run:

```bash
node runtime/runTool.js environment_drift_detector '{"environments":[{"name":"staging","settings":{"maxDop":4}},{"name":"production","settings":{"maxDop":8}}]}'
```

Returns drift status and drift findings.
