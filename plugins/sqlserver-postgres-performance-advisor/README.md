# CodexDB Agent (PRD-Umsetzung)

## Zielbild aus dem PRD

Dieses Plugin transformiert das PRD `prd_ai_codex_plugin_sqlserver_postgres.md` in ein
ausführbares, governance-zentriertes Toolset für SQL Server und PostgreSQL.

## Umgesetzte Ebene

- PRD-Ziele im Bereich **Safe Autonomous Execution**  
  - Risiko-Klassifikation in `runtime/riskEngine.js`
  - Policy-Gating in `runtime/policyEngine.js`
  - Audit Trail in `runtime/auditLogger.js`
  - Persistent Memory in `runtime/memoryLayer.js`
  - Semantik-Graph in `runtime/semanticGraph.js`
  - Observability-Korrelation in `runtime/observabilityEngine.js`
- PRD Tool-Layer (7. Architektur)  
  - Read-Tools, Write-Tools, Governance-/Compliance-Tools implementiert in `runtime/orchestrator.js`
  - Incident Reasoning via `incident_analysis`
  - Neue AI-USP-Tools: `compile_intent`, `cross_engine_translate`, `suggest_policy_updates`, `self_healing_playbook`
  - Erweiterte PRD-USPs: `retrieve_context`, `query_time_machine`, `deadlock_simulator`,
    `evolve_indexes`, `describe_business_layer`, `cost_intelligence`,
    `telemetry_correlation`, `agent_coordination`
  - Zusätzliche deterministische KI-USPs ohne externe API:
    `ai_anomaly_triage`, `ai_query_rewrite_lab`, `ai_migration_risk_radar`,
    `ai_data_contract_guardian`
  - Vollständige Enterprise-USP-Erweiterung:
    `rls_masking_router`, `explainable_refactoring_dossier`,
    `performance_forecast`, `semantic_memory_index`,
    `telemetry_connector_ingest`, `autonomous_verification_loop`,
    `sql_firewall_learning`, `workload_twin`
  - Production Completion Layer:
    `production_rollout_orchestrator`, `pgvector_connector_check`,
    `prometheus_connector_ingest`, `grafana_annotation_export`,
    `neo4j_graph_export`, `onboard_database`, `run_health_assessment`,
    `prepare_production_rollout`, `investigate_incident`,
    `optimize_workload`, `release_readiness_report`
  - SQL Performance Advisor Layer:
    `sql_problem_detector`, `plan_deep_diagnostics`, `plan_diff_intelligence`,
    `recommendation_ranker`, `index_roi_simulator`, `plan_regression_watch`,
    `parameter_sensitivity_guard`, `maintenance_window_advisor`,
    `slo_impact_guard`, `query_fingerprint_clusterer`,
    `wait_event_root_cause`, `data_skew_detector`,
    `cache_efficiency_advisor`, `capacity_headroom_forecast`,
    `evidence_pack_generator`, `auto_tuning_experiment_designer`,
    `migration_performance_predictor`, `workload_replay_risk_simulator`,
    `index_portfolio_optimizer`, `incident_timeline_builder`,
    `advisor_confidence_grader`, `change_ticket_exporter`,
    `cost_to_performance_advisor`, `schema_evolution_guard`,
    `autonomous_dba_copilot`, `performance_pr_reviewer`,
    `cross_tool_devops_analyzer`, `ai_guarded_sql_generator`,
    `synthetic_workload_lab`, `vendor_neutral_devops_brain`,
    `compliance_query_assistant`, `migration_twin_simulator`,
    `policy_gated_self_healing`, `advisor_memory_recommender`,
    `sql_code_review_assistant`, `schema_compare_intelligence`,
    `query_contract_tester`, `rollback_rehearsal_engine`,
    `release_train_risk_board`, `observability_signal_router`,
    `fleet_health_scorecard`, `index_hypothesis_generator`,
    `developer_sql_coach`, `environment_drift_detector`,
    `query_plan_narrator`, `slo_policy_compiler`,
    `index_retirement_planner`, `hotfix_risk_assessor`,
    `tenant_noisy_neighbor_detector`, `partition_strategy_advisor`,
    `statistics_health_doctor`, `connection_pool_advisor`,
    `backup_restore_readiness_guard`, `vendor_feature_mapper`,
    `advisor_feedback_loop`,
    `benchmark_ab_runner`, `workload_impact_analyzer`,
    `consultant_brain`, `sql_performance_advisor`
- Rollen- und Produktions-Governance: `runtime/policyEngine.js` erzwingt jetzt eine
  rollenbewusste Allowlist für Schreiboperationen in `production`, inklusive
  Schema-Restriktionen pro Rolle.
- Multi-DB Runtime-Connector in `runtime/db/` (SQL Server + PostgreSQL Adapter)
- MCP-Skilloberfläche  
  - Toolbeschreibungen in `skills/*/SKILL.md`

## Ausführung

Einmalig Abhängigkeiten installieren:

```bash
npm install
```

Lokaler Release-Readiness-Report:

```bash
npm run readiness
```

Strikter CI-/Release-Gate, der bei offenen Blockern mit Exit-Code 1 endet:

```bash
npm run readiness:strict
```

Lokaler Debug-/Ausführungspfad:

```bash
node runtime/runTool.js <tool_name> '{"engine":"postgres","database":"analytics"}'
```

Beispiel:

```bash
node runtime/runTool.js list_databases '{"engine":"sqlserver"}'
```

## Production Readiness

Vor einem produktiven Einsatz sollte der harte Readiness-Check laufen:

```bash
node runtime/runTool.js production_readiness_check '{"environment":"production","engine":"postgres"}'
```

`ready: true` wird nur geliefert, wenn keine produktionsblockierenden Punkte gefunden
werden. Der Check validiert Plugin-Manifest, Runtime-Toolkatalog, Skill-Dokumente,
Live-Connection-Pflicht, verfügbare DB-Treiber, Migration-Signing und Audit-Replay.

Für produktive Umgebungen empfohlen:

```bash
CODEXDB_REQUIRE_LIVE_CONNECTION=true
CODEXDB_MIGRATION_SIGNING_KEY=<hmac-secret>
CODEXDB_DEFAULT_ENV=production
```

Engine-spezifische Verbindungen können über Profile gesetzt werden:

```bash
CODEXDB_POSTGRES_CONNECTION_STRING=postgres://user:pass@host:5432/db
CODEXDB_SQLSERVER_SERVER=sql.example.internal
CODEXDB_SQLSERVER_USER=codexdb
CODEXDB_SQLSERVER_PASSWORD=<secret>
CODEXDB_SQLSERVER_DATABASE=app_prod
```

Wenn `CODEXDB_REQUIRE_LIVE_CONNECTION=true` aktiv ist, blockt die Runtime stille
Mock-Fallbacks. Fehlende Treiber, fehlende Secrets oder fehlende Verbindungsdaten
führen dann zu einem expliziten `live_connection_required`-Ergebnis statt zu
scheinbar erfolgreichen Mock-Ausgaben.

Zusätzlich blocken die Adapter unsichere SQL-Ausführung vor dem Datenbankaufruf:
Multi-Statement-SQL und gefährliche Befehle wie `DROP`, `TRUNCATE`, `GRANT`,
`REVOKE`, `EXEC` oder `xp_cmdshell` werden für normale Query-/Simulation-Pfade
abgewiesen. Migration-Tools bleiben policy-gated und laufen weiterhin standardmäßig
im `dry_run`.

## Wichtige Dateien

- `runtime/orchestrator.js`  
  Dispatcher und deterministische Toolausgaben
- `runtime/config.js`  
  Policy, Risk-Defaults, Sample-Catalog als Referenzmodell
- `runtime/tool-manifest.json`  
  PRD-Toolkatalog + Risikoverhalten
- `runtime/sqlSafety.js`  
  SQL-Sicherheitsprüfung gegen gefährliche Statements vor Adapter-Ausführung
- `runtime/db/sqlServerAdapter.js` und `runtime/db/postgresAdapter.js`
  - `executeSql` für echten Wiederlauf/SQL-Applikation in Migration- und Replay-Pfaden
- `.codexdb/replay.jsonl`  
  Replay-Kette und Re-Run-Auswertung über `replay_execution` (`rerun` + `decisionMatch`)
- Replay-Ausgaben ergänzen jetzt:
  - `replay_diff`, `decisionGraph`, `incident_causality`, `replay_reproducibility`
- `skills/*/SKILL.md`  
  Verhalten und Governance-Regeln je Tool

## Governance-Konventionen

- LOW: Auto-Execution-Pfad (Default: Dry-Run für schreibende Flows, Apply via `executionMode`)
- MEDIUM: Human-in-the-Loop
- HIGH: Block
- CRITICAL: Sandbox-only

## Replizierung der Migration-Funktionalität

- Migrationstools unterstützen `executionMode: "dry_run" | "apply"` (Standard: `dry_run` bei write-like Operationen, falls nicht explizit gesetzt).
- `propose_migration`, `create_index`, `rollback_migration`, `optimize_query`, `create_partitioning` liefern bei Apply:
  - SQL-Ausführungsdetails (`execution`)
  - Validierungsresultate (`validation`)
  - Migrationssignatur-Chain

## Wichtige Policy-Konfigurationsvariablen

- `CODEXDB_DEFAULT_ENV`: Standard-Umgebung (`lab`, `staging`, `production`).
- `CODEXDB_RESTRICTED_SCHEMAS`: Komma-separierte Liste kritischer Systemschemata.
- `CODEXDB_PII_HINTS`: Komma-separierte PII-Hinweise für das Risiko-/Policy-Modell.
- `CODEXDB_ALLOWED_WRITE_ACTIONS_PROD`: Override für erlaubte Produktions-Schreibactions.
- `CODEXDB_REQUIRE_LIVE_CONNECTION`: Erzwingt echte DB-Verbindungen und blockt
  Mock-Fallbacks.
- `CODEXDB_LIVE_CONNECTION_TIMEOUT_MS`: Timeout für Live-Verbindungsaufbau.
- `CODEXDB_ROLE_POLICY`: JSON-Payload für rollenbasierte Overrides, z. B.:

```json
{
  "roles": {
    "db_admin": {
      "allowedWriteActionsInProduction": ["simulate_query", "optimize_query"],
      "allowedSchemasInProduction": ["public", "analytics"]
    }
  }
}
```
- `CODEXDB_QUERY_ALLOWLIST_MODE` / `CODEXDB_QUERY_ALLOWLIST`: Query-Allowlist in `warn`/`enforce`-Modus.
- `CODEXDB_REQUIRE_MIGRATION_SIGNATURE`: Erfordert Migrationssignatur für produktionistische Schreibaktionen.
- `CODEXDB_ALLOW_DRYRUN_WITHOUT_SIGNATURE`: Erlaubt Signatur-Ausnahme nur für Dry-Run-Flows.
- `CODEXDB_REQUIRE_MIGRATION_SIGNATURE_NOT_EXPIRED`: Erfordert gültige Signaturfristen.
- `CODEXDB_MIGRATION_SIGNATURE_TTL_SEC`: Laufzeitfenster für Signaturgültigkeit (Sekunden).
- `CODEXDB_MIGRATION_SIGNER_KEY_ID`: Schlüsselbezeichner für die Signaturerzeugung.
- `CODEXDB_MIGRATION_SIGNING_TOOLS`: Override der zu erzwungenen Signatur-Tools.
- `CODEXDB_MIGRATION_SIGNING_KEY`: Signaturschlüssel für HMAC-SHA256-Migrationsartfakte.
- `CODEXDB_REPLAY_ENABLED`: Aktiviert Replay-Logik im Memory.
- `CODEXDB_REPLAY_INCLUDE_PAYLOAD`: Steuerung der Payload-Ausgabe in Audit-/Replay-Zeilen.
- `CODEXDB_REPLAY_MAX_ENTRIES`: Maximaler Replay-Speichereintrag in `runtime/state`.
- `CODEXDB_SECRET_JSON` / `CODEXDB_SECRET_FILE` / `CODEXDB_SECRETS_JSON` / `CODEXDB_SECRETS_FILE`: Secret-Store Eingänge.

### AI-USP Datenfelder (Live)

- Decision-Graph (`policyDecision`):
  - `graph_id`, `policy_snapshot_id`, `action_nodes[]`, `risk_explainer`, `rollback_plan`, `telemetry_refs`
- Intent-Contract (`compile_intent`):
  - `intent_type`, `scope`, `risk_tier`, `expected_side_effects`, `required_approvals`, `repro_inputs`
- Migration Artefakt (`propose_migration`, `create_index`, `optimize_query`, `create_partitioning`, `rollback_migration`):
  - `migrationArtifact.artifact_hash`, `migrationArtifact.hash_algo`, `migrationArtifact.signature`,
    `migrationArtifact.signer_id`, `migrationArtifact.expires_at`, `migrationArtifact.repro_hash_inputs`
- Replay-Pfad (`replay_execution`):
  - `replay_id`, `decisionMatch`, `replay_reproducibility`, `replay_diff`, `incident_causality`
- Incident-Pfad (`incident_analysis` / `incident_causal_graph`):
  - `incident_causality.nodes`, `incident_causality.edges`, `mttdMinutes`, `mttrMinutesEstimate`
- Risiko-Output (`classify_risk`):
  - `risk_assessment.safetyFlags`, `risk_assessment.astParsed`, `estimatedComplexity`, `policyDecision`
- Deterministische KI-USPs:
  - `ai_anomaly_triage`: `anomalyScore`, `rootCauseHypotheses`, `nextBestActions`,
    `explainability.correlationInputs`
  - `ai_query_rewrite_lab`: `rewriteCandidates`, `expectedImpact`, `safety.blockedExecution`
  - `ai_migration_risk_radar`: `blastRadius`, `policyPreflight`, `rollbackRehearsal`
  - `ai_data_contract_guardian`: `contractFindings`, `contractStatus`, `governanceControls`
- Enterprise-USP-Erweiterungen:
  - `rls_masking_router`: `routePlan`, `projectedColumns`, `controls`, `safeSql`
  - `explainable_refactoring_dossier`: `before`, `after`, `explanation.reasons`, `rollbackPlan`
  - `performance_forecast`: `forecast.predictedP95Ms`, `budgetRisk`, `recommendations`
  - `semantic_memory_index`: `index`, `matches`, `mode: local_token_vector`
  - `telemetry_connector_ingest`: `normalizedSignals`, `correlationRefs`, `routingTargets`
  - `autonomous_verification_loop`: `gates`, `verificationStatus`, `releaseDecision`
  - `sql_firewall_learning`: `learnedFingerprints`, `driftFindings`, `proposedPolicyRules`
  - `workload_twin`: `simulation.baseline`, `simulation.projected`, `scenarioFindings`
- Production Completion Layer:
  - `production_rollout_orchestrator`: `gates`, `rolloutDecision`, `nextActions`
  - `pgvector_connector_check`: `status`, `requiredEnv`, `capabilities`
  - `prometheus_connector_ingest`: `normalizedMetrics`, `request`, `routingTargets`
  - `grafana_annotation_export`: `annotation`, `request`, `status`
  - `neo4j_graph_export`: `connection`, `export.cypher`, `status`
  - `onboard_database`: `steps`, `summary`, `evidence`
  - `run_health_assessment`: `summary`, `sections`
  - `prepare_production_rollout`: `rolloutPlan`, `verification`, `operatorChecklist`
  - `investigate_incident`: `triage`, `causalGraph`, `playbook`
  - `optimize_workload`: `rewriteLab`, `forecast`, `indexEvolution`, `twin`
  - `release_readiness_report`: `sections`, `openBlockers`, `ready`
- SQL Performance Advisor Layer:
  - `sql_problem_detector`: `findings`, `severity`, `recommendation`, `sqlFingerprint`
  - `plan_deep_diagnostics`: `findings`, `evidence`, `nextChecks`
  - `plan_diff_intelligence`: `planChanges`, `likelyCauses`, `confidence`
  - `recommendation_ranker`: `rankedRecommendations`, `score`, `rationale`
  - `index_roi_simulator`: `rankedCandidates`, `roiScore`, `recommendation`
  - `plan_regression_watch`: `findings`, `rollbackCandidate`, `nextActions`
  - `parameter_sensitivity_guard`: `parameterSensitive`, `evidence`, `mitigations`
  - `maintenance_window_advisor`: `runbook`, `safetyGates`
  - `slo_impact_guard`: `status`, `errorBudgetBurnRate`, `executiveSummary`
  - `query_fingerprint_clusterer`: `clusters`, `impactScore`, `recommendation`
  - `wait_event_root_cause`: `primaryCause`, `findings`, `actions`
  - `data_skew_detector`: `skewDetected`, `hotValues`, `recommendations`
  - `cache_efficiency_advisor`: `status`, `findings`, `actions`
  - `capacity_headroom_forecast`: `daysToStorageSaturation`, `resourceRisks`, `actions`
  - `evidence_pack_generator`: `caseFile`, `evidenceGrade`, `missingEvidence`
  - `auto_tuning_experiment_designer`: `experiment`, `successCriteria`, `abortCriteria`
  - `migration_performance_predictor`: `risks`, `riskLevel`, `nextChecks`
  - `workload_replay_risk_simulator`: `riskScore`, `sideEffects`, `recommendation`
  - `index_portfolio_optimizer`: `redundantIndexes`, `dropCandidates`, `actionOrder`
  - `incident_timeline_builder`: `timeline`, `narrative`, `likelyCause`
  - `advisor_confidence_grader`: `grade`, `missingEvidence`, `requiredNextEvidence`
  - `change_ticket_exporter`: `ticket`, `approvalChecklist`, `exportFormats`
  - `cost_to_performance_advisor`: `costDelta`, `latencyImprovementPct`, `efficiency`
  - `schema_evolution_guard`: `releaseRisk`, `findings`, `mitigations`
  - `autonomous_dba_copilot`: `loopSteps`, `decisionPackage`, `nextAction`
  - `performance_pr_reviewer`: `mergeDecision`, `findings`, `requiredChecks`
  - `cross_tool_devops_analyzer`: `normalizedArtifacts`, `pipelineAdvice`
  - `ai_guarded_sql_generator`: `sql`, `guardrails`, `risk`
  - `synthetic_workload_lab`: `syntheticDataPlan`, `workloadScript`
  - `vendor_neutral_devops_brain`: `strategy.controlPlane`, `toolAdapters`, `gates`
  - `compliance_query_assistant`: `safeSql`, `maskedColumns`, `controls`
  - `migration_twin_simulator`: `queryRisks`, `overallRisk`, `nextActions`
  - `policy_gated_self_healing`: `executionMode`, `runbook`
  - `advisor_memory_recommender`: `memoryMatches`, `confidenceHint`
  - `sql_code_review_assistant`: `reviewComments`, `decision`
  - `schema_compare_intelligence`: `diffSummary`, `risks`, `intent`
  - `query_contract_tester`: `contractStatus`, `violations`
  - `rollback_rehearsal_engine`: `rehearsalStatus`, `steps`
  - `release_train_risk_board`: `releaseBoard`, `decision`
  - `observability_signal_router`: `routes`, `routingMode`
  - `fleet_health_scorecard`: `scorecard`, `status`
  - `index_hypothesis_generator`: `hypotheses`, `validationPlan`
  - `developer_sql_coach`: `lesson`, `actionItems`
  - `environment_drift_detector`: `driftStatus`, `driftFindings`
  - `query_plan_narrator`: `story`, `actions`
  - `slo_policy_compiler`: `policy`, `guardrails`
  - `index_retirement_planner`: `retirementCandidates`, `safetySteps`
  - `hotfix_risk_assessor`: `risks`, `decision`
  - `tenant_noisy_neighbor_detector`: `noisyTenants`, `actions`
  - `partition_strategy_advisor`: `strategy.type`, `partitionKey`, `cadence`
  - `statistics_health_doctor`: `findings`, `actions`
  - `connection_pool_advisor`: `status`, `utilization`, `actions`
  - `backup_restore_readiness_guard`: `status`, `findings`, `actions`
  - `vendor_feature_mapper`: `coverageMap`, `pluginDifferentiators`
  - `advisor_feedback_loop`: `outcome`, `learning.confidenceDelta`
  - `benchmark_ab_runner`: `delta`, `winner`, `verdict`
  - `workload_impact_analyzer`: `topImpactQueries`, `hotspots`
  - `consultant_brain`: `answer.summary`, `answer.recommendation`, `answer.nextTest`
  - `sql_performance_advisor`: `diagnosis`, `rankedRecommendations`,
    `workloadImpact`, `consultantAnswer`, `evidenceChain`

## Nächste Iteration

- Echte Produktions-ENV setzen: `CODEXDB_REQUIRE_LIVE_CONNECTION`,
  `CODEXDB_MIGRATION_SIGNING_KEY`, Datenbank-Connection-String und optionale
  pgvector/Neo4j/Prometheus/Grafana-Ziele.
- Gegen eine Staging-Datenbank mit echten `EXPLAIN ANALYZE`- beziehungsweise
  SQL-Server-Actual-Plan-Daten validieren.
