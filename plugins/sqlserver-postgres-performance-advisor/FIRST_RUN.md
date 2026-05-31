# First Run

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` into your local environment and set only the connectors you need.

3. Run the deterministic test suite:

```bash
npm test
```

4. Run readiness:

```bash
npm run readiness
```

5. Run the AI USP contract smoke test:

```bash
node --test tests/release-contracts.test.js
```

6. Try a closed-loop dry-run demo:

```bash
node runtime/runTool.js knowledge_gap_detector '{"objective":"recommend production index","evidence":{"hasSchema":true,"hasLivePlan":false,"hasTelemetry":false,"hasPolicy":true}}'
```

7. Review the curated killer demos:

```text
demos/KILLER_DEMOS.md
```

8. Review the launch messaging and sales flow:

```text
MARKETING.md
demos/SALES_PLAYBOOK.md
```

9. For production, set:

```bash
CODEXDB_REQUIRE_LIVE_CONNECTION=true
CODEXDB_MIGRATION_SIGNING_KEY=<secret>
```

The plugin will block live advisory workflows in production if it only has mock evidence.
