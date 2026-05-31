---
name: explainable-refactoring-dossier
description: Compare before and after SQL or migration changes with risk, reasons, side effects, and rollback steps.
---

# Explainable Refactoring Dossier

Use this skill to explain why a query or schema refactor is safer, cheaper, or
requires review.

Run:

```bash
node runtime/runTool.js explainable_refactoring_dossier '{"beforeSql":"SELECT * FROM events","afterSql":"SELECT event_id FROM events LIMIT 500","objective":"reduce IO and PII exposure"}'
```

The dossier includes before/after fingerprints, risk deltas, reasons, expected
side effects, and rollback steps.
