---
name: sql-firewall-learning
description: Learn normalized SQL fingerprints, detect unsafe query-family drift, and propose allowlist policy rules.
---

# SQL Firewall Learning

Use this skill to bootstrap query allowlists or detect new risky SQL families.

Run:

```bash
node runtime/runTool.js sql_firewall_learning '{"samples":["SELECT event_id FROM events WHERE user_email = ''a@example.com''","DROP TABLE events"]}'
```

The output includes learned fingerprints, drift findings, and proposed policy
rules.
