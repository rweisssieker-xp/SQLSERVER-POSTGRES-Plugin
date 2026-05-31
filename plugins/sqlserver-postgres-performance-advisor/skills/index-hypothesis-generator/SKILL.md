---
name: index-hypothesis-generator
description: Generates candidate index hypotheses from SQL predicates and validation plans.
---

# Index Hypothesis Generator

Run:

```bash
node runtime/runTool.js index_hypothesis_generator '{"sql":"SELECT * FROM orders WHERE status = ''paid''","table":"orders"}'
```

Returns index hypotheses and validation plan.
