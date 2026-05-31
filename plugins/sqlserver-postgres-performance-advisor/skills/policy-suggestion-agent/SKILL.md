---
name: policy-suggestion-agent
description: "Propose governance policy hardening based on recent blocked/reviewed intents and execution decisions."
---

# Policy Suggestion Agent

## Use when
- Repeated policy denials indicate a pattern.
- You want machine-assisted policy improvement proposals before manual change control.

## Workflow
1. Analyse recent policy decisions and risk outcomes.
2. Detect recurring rejection patterns.
3. Return concrete policy update proposals with confidence levels.

## Governance
- Never auto-apply; proposals remain suggestions.
- Keep recommendations bounded to observed evidence.

## Output
- `suggestionCount`, `suggestions`, `evidence`
