---
name: suggest-policy-updates
description: Propose governance policy hardening based on recent blocked or reviewed intents and execution decisions.
---

# Suggest Policy Updates

Run:

```bash
node runtime/runTool.js suggest_policy_updates '{"environment":"production","database":"analytics","schema":"public"}'
```

Returns suggested policy changes, evidence, confidence, and governance notes. It never applies policy changes directly.
