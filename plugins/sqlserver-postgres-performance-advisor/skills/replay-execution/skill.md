---
name: replay-execution
description: "Replay a previous tool execution from audit/replay evidence."
---

# Replay Execution

## Use when
- A previous tool run must be reproduced for debugging, drift analysis, or compliance evidence.

## Workflow
1. Load the latest or explicit `replayId` from `.codexdb/replay.jsonl`.
2. Resolve original tool, args, actor, and policy snapshot.
3. Re-run the original tool handler with deterministic policy-context replay.
4. Return:
   - original replay record
   - rerun output
   - decision comparison (`decisionMatch`).
   - replay diff (`replay_diff`)
   - decision graph snapshot (`decisionGraph`)
   - replay reproducibility status (`replay_reproducibility`)

## Governance
- Replay output is an audit action and always records a new event.
- If policy snapshot was blocked, replay preserves blocked outcome.
