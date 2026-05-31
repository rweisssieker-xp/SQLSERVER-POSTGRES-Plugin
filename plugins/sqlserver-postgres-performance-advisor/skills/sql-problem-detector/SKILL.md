---
name: sql-problem-detector
description: Detect common SQL performance smells such as SELECT *, unbounded reads, non-sargable predicates, unsafe joins, and unbounded sorts.
---

# SQL Problem Detector

Run:

```bash
node runtime/runTool.js sql_problem_detector '{"engine":"postgres","sql":"SELECT * FROM events WHERE user_email = ''a@example.com''"}'
```

Returns deterministic findings with severity, message, recommendation, and SQL
fingerprint evidence.
