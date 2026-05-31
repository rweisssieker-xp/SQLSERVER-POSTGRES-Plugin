---
name: consultant-brain
description: Produce a clear advisor answer with summary, recommendation, confidence, uncertainty, and next test.
---

# Consultant Brain

Run:

```bash
node runtime/runTool.js consultant_brain '{"question":"Why is this query slow?","engine":"postgres","sql":"SELECT * FROM events WHERE user_email = ''a@example.com''"}'
```

Combines deterministic diagnosis, rewrite suggestions, and forecast into a
human-readable consulting answer.
