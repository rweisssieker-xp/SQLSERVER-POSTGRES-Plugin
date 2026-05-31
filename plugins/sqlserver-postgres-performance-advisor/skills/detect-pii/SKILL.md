---
name: detect-pii
description: "Scan schema metadata and query examples for PII exposure patterns and classify data sensitivity risk."
---

# Detect PII

## Use when
- User asks to classify sensitivity or enforce data-handling policy.

## Workflow
1. Build candidate list from column names, comments, and sample metadata.
2. Classify using configurable PII patterns and regex signatures.
3. Rank sensitivity and generate handling recommendations.
4. Return policy-aware masking or redaction guidance.

## Governance
- This is a read-only risk-assessment workflow unless explicitly requested.
- Never return full sample datasets while detecting; metadata and aggregated results only.

## Output
- `piiColumns`, `sensitivityLevel`, `policyViolations`, `remediation`
