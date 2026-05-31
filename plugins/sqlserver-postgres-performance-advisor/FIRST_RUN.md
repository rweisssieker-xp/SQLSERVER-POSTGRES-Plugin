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

5. For production, set:

```bash
CODEXDB_REQUIRE_LIVE_CONNECTION=true
CODEXDB_MIGRATION_SIGNING_KEY=<secret>
```

The plugin will block live advisory workflows in production if it only has mock evidence.
