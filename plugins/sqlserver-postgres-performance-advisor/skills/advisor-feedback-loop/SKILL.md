---
name: advisor-feedback-loop
description: Record whether an advisor recommendation improved performance and feed confidence back into future ranking.
---

# Advisor Feedback Loop

Run:

```bash
node runtime/runTool.js advisor_feedback_loop '{"recommendationId":"narrow_projection","applied":true,"beforeP95Ms":300,"afterP95Ms":180}'
```

Returns outcome, improvement percentage, and confidence delta.
