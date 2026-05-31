---
name: onboard-database
description: Run the first database onboarding workflow across catalog discovery, table description, and PII detection.
---

# Onboard Database

Run:

```bash
node runtime/runTool.js onboard_database '{"engine":"postgres","database":"analytics","schema":"public","table":"events"}'
```

Summarizes the first evidence needed to bring a database under CodexDB governance.
