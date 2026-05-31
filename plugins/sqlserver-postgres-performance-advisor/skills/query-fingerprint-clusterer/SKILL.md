---
name: query-fingerprint-clusterer
description: Groups SQL variants into query families and ranks them by workload impact.
---

# Query Fingerprint Clusterer

Run:

```bash
node runtime/runTool.js query_fingerprint_clusterer '{"queries":[{"queryId":"q1","sql":"SELECT * FROM events WHERE user_id = 1","calls":1000,"p95Ms":120}]}'
```

Returns normalized fingerprints, query ids, impact scores, and tuning priority.
