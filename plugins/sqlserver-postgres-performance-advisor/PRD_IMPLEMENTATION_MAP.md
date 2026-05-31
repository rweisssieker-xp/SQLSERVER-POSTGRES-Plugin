# PRD-Umsetzungsmatrix

| PRD-Block | Umsetzung im Plugin |
|---|---|
| 5.1 Safe Autonomous Execution Layer | `runtime/riskEngine.js`, `runtime/policyEngine.js`, `runtime/auditLogger.js`, `runtime/orchestrator.js` |
| 5.1 Safe Autonomous Execution Layer (Policy Enforcement) | `runtime/orchestrator.js` (policy-gated dispatch), `runtime/riskEngine.js`, `runtime/policyEngine.js` |
| Risiko-Klassifikation (LOW/MEDIUM/HIGH/CRITICAL) | `runtime/riskEngine.js` + `tools: classify_risk`, `estimate_cost` |
| 5.2 Explain Plan Intelligence | `skills/explain-query/SKILL.md`, `runtime/orchestrator.js` |
| 5.3 Multi-Agent Orchestration (initiales Skelett) | `skills`-Set als Agent-Tooling-Katalog + `README.md` |
| 5.4 Semantic Schema Intelligence | `skills/describe-relationships/SKILL.md`, `runtime/config.js` |
| 5.5 Autonomous Migration Engine | `skills/propose-migration`, `skills/rollback-migration`, `skills/create-partitioning`, `runtime/orchestrator.js`, `runtime/db/sqlServerAdapter.js`, `runtime/db/postgresAdapter.js` |
| Replay-Execution Loop | `runtime/orchestrator.js`, `runtime/memoryLayer.js`, `runtime/auditLogger.js`, `skills/replay-execution` |
| AI-Gate: Intent-First Contractierung | `runtime/orchestrator.js` (`compile_intent`), `runtime/riskEngine.js`, `runtime/policyEngine.js`, `skills/compile-intent` |
| Decision-Graph + Reproducible Replay | `runtime/orchestrator.js` (Decision-Graph, `replay_diff`, `incident_causality`), `runtime/memoryLayer.js`, `runtime/auditLogger.js` |
| 5.6 AI-native Incident Analysis | `skills/lock-analysis`, `skills/replication-status`, `skills/query-stats`, `runtime/observabilityEngine.js`, `runtime/orchestrator.js` |
| Incident-Causal Intelligence | `runtime/observabilityEngine.js`, `runtime/orchestrator.js` (`incident_analysis`, `self_healing_playbook`) |
| Cross-Engine SQL Intelligence | `runtime/orchestrator.js` (`cross_engine_translate`), `skills/cross-engine-translate` |
| Policy-Governance Intelligence | `runtime/orchestrator.js` (`suggest_policy_updates`), `skills/policy-suggestion-agent` |
| Self-Healing DBA Playbooks | `runtime/orchestrator.js` (`self_healing_playbook`), `skills/self-healing-playbook` |
| Persistent RAG / Retrieval Layer | `runtime/orchestrator.js` (`retrieve_context`), `runtime/memoryLayer.js`, `skills/retrieve-context` |
| AI Query Time Machine | `runtime/orchestrator.js` (`query_time_machine`), `runtime/memoryLayer.js`, `skills/query-time-machine` |
| AI Deadlock Simulator | `runtime/orchestrator.js` (`deadlock_simulator`), `skills/deadlock-simulator` |
| Autonomous Index Evolution | `runtime/orchestrator.js` (`evolve_indexes`), `skills/evolve-indexes` |
| Semantic Business Layer | `runtime/orchestrator.js` (`describe_business_layer`), `runtime/semanticGraph.js`, `skills/describe-business-layer` |
| Cost Intelligence Layer | `runtime/orchestrator.js` (`cost_intelligence`, `estimate_cost`), `skills/cost-intelligence` |
| OpenTelemetry-nahe Incident Correlation | `runtime/orchestrator.js` (`telemetry_correlation`), `runtime/observabilityEngine.js`, `skills/telemetry-correlation` |
| Dynamische Multi-Agent Coordination | `runtime/orchestrator.js` (`agent_coordination`), `runtime/agentOrchestrator.js`, `skills/agent-coordination` |
| 6. Live DB-Fähigkeiten | `runtime/db/connector.js`, `runtime/db/sqlServerAdapter.js`, `runtime/db/postgresAdapter.js` |
| 5.1 Production Governance (erweitert) | `runtime/config.js`, `runtime/policyEngine.js`, `runtime/orchestrator.js` |
| 7. Tooling-Architektur (Read/Write/Governance) | `runtime/tool-manifest.json` + vollständige Tool-Router-Mappings in `runtime/orchestrator.js` |
| Persistent Memory Layer | `runtime/memoryLayer.js`, `runtime/orchestrator.js` |
| Semantic Graph Engine | `runtime/semanticGraph.js`, `skills/describe-relationships/SKILL.md`, `runtime/orchestrator.js` |
| Security/Compliance Layer | `runtime/policyEngine.js`, `runtime/auditLogger.js`, `skills/validate-compliance`, `skills/enforce-policy`, `skills/classify-risk` |
| 9. Enterprise Security Features | Richtlinien-Defaults in `runtime/config.js`, Audit in `runtime/auditLogger.js`, incident_analysis skill in `skills/incident-analysis` |
| Phase 1/2 Umsetzungsfokus | PRD-feste Fähigkeiten mit Mock-Operationalisierung in `runtime/` und Skill-Layer |

## Datengestützte AI-USP-Zuordnung (v1)

| USP | Technische Datenquelle | Konkrete Datenelemente (Beweisfeld) | Erfüllungsstatus |
|---|---|---|---|
| Policy-First SQL Co-Pilot | `runtime/orchestrator.js`, `runtime/policyEngine.js`, `runtime/riskEngine.js` | `policyDecision.reason`, `policyDecision.action`, `decisionGraph.action_nodes`, `decisionGraph.policy_snapshot_id` | ✅ |
| Bidirektionaler Intent-Kompilierer | `runtime/orchestrator.js`, `skills/compile-intent` | `intent_contract.intent_type`, `intent_contract.risk_tier`, `intent_contract.required_approvals`, `intent_round_trip` | ✅ |
| Deterministischer Replay | `runtime/orchestrator.js`, `runtime/memoryLayer.js` | `replay_diff`, `replay_reproducibility`, `decisionGraph`-Vergleich, `policy_snapshot_id` | ✅ |
| Incident-Kausalgraph | `runtime/observabilityEngine.js`, `runtime/orchestrator.js` | `incident_causality.nodes`, `incident_causality.edges`, `mttdMinutes`, `mttrMinutesEstimate` | ✅ |
| Adaptive Safety Engine | `runtime/riskEngine.js`, `runtime/orchestrator.js` | `risk_assessment.astParsed`, `safetyFlags`, `policyDecision.blocked` | ✅ |
| Explainable Refactoring | `runtime/orchestrator.js` (Migrations/Optimierung), `runtime/observabilityEngine.js` | `decisionGraph`, `risk_explainer`, `expected_side_effects` | 🟡 (teilweise) |
| Signatur-basierte Migration | `runtime/orchestrator.js`, `runtime/config.js` | `migrationArtifact.artifact_hash`, `signature`, `migrationSigningExpiresAt`, `decisionMatch` | ✅ |
| RLS-/Masking-Routing | `runtime/policyEngine.js`, `runtime/policyEngine.js` | `policyDecision.risk_factors`, Rollen-/Schema-Bindung in Policy | 🟡 (erweiterungsfähig) |
| Kosten-/Performance-Vorhersage | `runtime/orchestrator.js`, `skills/estimate-cost` | `estimatedCost`, `estimatedImpact.replay`, `estimatedImpact.regressionDelta` | 🟡 (teilweise) |
| Cross-Engine Semantik-Transfer | `runtime/orchestrator.js`, `skills/cross-engine-translate` | `crossEngineTranslation` Felder: `source_dialect`, `target_dialect`, `conversion_steps` | ✅ |
| Policy-Suggestion Agent | `runtime/orchestrator.js`, `skills/policy-suggestion-agent` | `policy_suggestion_agent.output.recommended_rules`, `rationale` | ✅ |
| Self-Healing Playbook | `runtime/orchestrator.js`, `skills/self-healing-playbook` | `self_healing_playbook.playbooks`, `recommended_approvals` | ✅ |
| RAG-/Retrieval Context | `runtime/orchestrator.js`, `runtime/memoryLayer.js`, `skills/retrieve-context` | `retrieval.sources`, `contextPacks`, `grounding` | ✅ |
| Query Time Machine | `runtime/orchestrator.js`, `skills/query-time-machine` | `timeline`, `regressionPoint`, `reconstruction` | ✅ |
| Deadlock Simulator | `runtime/orchestrator.js`, `skills/deadlock-simulator` | `waitForGraph.nodes`, `waitForGraph.edges`, `deadlockRisk` | ✅ |
| Autonomous Index Evolution | `runtime/orchestrator.js`, `skills/evolve-indexes` | `recommendations`, `evolutionPlan.validation`, `evolutionPlan.rollback` | ✅ |
| Semantic Business Layer | `runtime/orchestrator.js`, `runtime/semanticGraph.js`, `skills/describe-business-layer` | `businessEntities`, `semanticSummary`, `governanceHints` | ✅ |
| Cost Intelligence | `runtime/orchestrator.js`, `skills/cost-intelligence` | `costDrivers`, `unitEconomics`, `budgetControls` | ✅ |
| Telemetry Correlation | `runtime/observabilityEngine.js`, `skills/telemetry-correlation` | `correlation.causalGraph`, `telemetryRefs`, `mttdMinutes` | ✅ |
| Agent Coordination | `runtime/agentOrchestrator.js`, `skills/agent-coordination` | `coordinationPlan.steps`, `selectedAgents`, `executionPlan` | ✅ |
| AI Anomaly Triage | `runtime/orchestrator.js`, `skills/ai-anomaly-triage` | `anomalyScore`, `rootCauseHypotheses`, `nextBestActions`, `explainability.correlationInputs` | ✅ |
| AI Query Rewrite Lab | `runtime/orchestrator.js`, `skills/ai-query-rewrite-lab` | `rewriteCandidates`, `expectedImpact`, `safety.blockedExecution`, `rulesApplied` | ✅ |
| AI Migration Risk Radar | `runtime/orchestrator.js`, `skills/ai-migration-risk-radar` | `blastRadius`, `policyPreflight`, `rollbackRehearsal`, `releaseRecommendation` | ✅ |
| AI Data Contract Guardian | `runtime/orchestrator.js`, `skills/ai-data-contract-guardian` | `contractFindings`, `contractStatus`, `governanceControls`, `evidence.actualColumns` | ✅ |
| RLS Masking Router | `runtime/orchestrator.js`, `skills/rls-masking-router` | `routePlan.projectedColumns`, `controls`, `safeSql`, `evidence.piiColumns` | ✅ |
| Explainable Refactoring Dossier | `runtime/orchestrator.js`, `skills/explainable-refactoring-dossier` | `before.risk`, `after.risk`, `explanation.reasons`, `rollbackPlan.steps` | ✅ |
| Performance Forecast | `runtime/orchestrator.js`, `skills/performance-forecast` | `forecast.predictedP95Ms`, `budgetRisk.level`, `recommendations` | ✅ |
| Semantic Memory Index | `runtime/orchestrator.js`, `skills/semantic-memory-index` | `index.documentCount`, `matches.score`, `mode` | ✅ |
| Telemetry Connector Ingest | `runtime/orchestrator.js`, `skills/telemetry-connector-ingest` | `normalizedSignals`, `correlationRefs`, `routingTargets` | ✅ |
| Autonomous Verification Loop | `runtime/orchestrator.js`, `skills/autonomous-verification-loop` | `gates`, `verificationStatus`, `releaseDecision`, `evidencePlan` | ✅ |
| SQL Firewall Learning | `runtime/orchestrator.js`, `skills/sql-firewall-learning` | `learnedFingerprints`, `driftFindings`, `proposedPolicyRules` | ✅ |
| Workload Twin | `runtime/orchestrator.js`, `skills/workload-twin` | `simulation.baseline`, `simulation.projected`, `scenarioFindings` | ✅ |
| Production Rollout Orchestrator | `runtime/orchestrator.js`, `skills/production-rollout-orchestrator` | `gates`, `rolloutDecision`, `reports`, `nextActions` | ✅ |
| pgvector Connector Check | `runtime/orchestrator.js`, `skills/pgvector-connector-check` | `status`, `requiredEnv`, `capabilities` | ✅ |
| Prometheus Connector Ingest | `runtime/orchestrator.js`, `skills/prometheus-connector-ingest` | `normalizedMetrics`, `routingTargets` | ✅ |
| Grafana Annotation Export | `runtime/orchestrator.js`, `skills/grafana-annotation-export` | `annotation`, `status`, `requiredEnv` | ✅ |
| Neo4j Graph Export | `runtime/orchestrator.js`, `skills/neo4j-graph-export` | `export.cypher`, `status`, `requiredEnv` | ✅ |
| Onboard Database Workflow | `runtime/orchestrator.js`, `skills/onboard-database` | `steps`, `summary`, `evidence` | ✅ |
| Health Assessment Workflow | `runtime/orchestrator.js`, `skills/run-health-assessment` | `summary`, `sections` | ✅ |
| Production Rollout Preparation | `runtime/orchestrator.js`, `skills/prepare-production-rollout` | `rolloutPlan`, `verification`, `operatorChecklist` | ✅ |
| Incident Investigation Workflow | `runtime/orchestrator.js`, `skills/investigate-incident` | `triage`, `causalGraph`, `playbook` | ✅ |
| Workload Optimization Workflow | `runtime/orchestrator.js`, `skills/optimize-workload` | `rewriteLab`, `forecast`, `indexEvolution`, `twin` | ✅ |
| Release Readiness Report | `runtime/orchestrator.js`, `skills/release-readiness-report`, `scripts/plugin-readiness-report.js` | `sections`, `openBlockers`, `ready` | ✅ |
| SQL Problem Detector | `runtime/orchestrator.js`, `skills/sql-problem-detector` | `findings`, `severity`, `recommendation`, `evidence.sqlFingerprint` | ✅ |
| Plan Diff Intelligence | `runtime/orchestrator.js`, `skills/plan-diff-intelligence` | `planChanges`, `likelyCauses`, `confidence`, `nextChecks` | ✅ |
| Recommendation Ranker | `runtime/orchestrator.js`, `skills/recommendation-ranker` | `rankedRecommendations`, `score`, `rationale` | ✅ |
| Advisor Feedback Loop | `runtime/orchestrator.js`, `skills/advisor-feedback-loop` | `outcome.improved`, `learning.confidenceDelta`, `futureRankingHint` | ✅ |
| Benchmark A/B Runner | `runtime/orchestrator.js`, `skills/benchmark-ab-runner` | `delta`, `winner`, `verdict` | ✅ |
| Workload Impact Analyzer | `runtime/orchestrator.js`, `skills/workload-impact-analyzer` | `topImpactQueries`, `impactScore`, `hotspots` | ✅ |
| Consultant Brain | `runtime/orchestrator.js`, `skills/consultant-brain` | `answer.summary`, `answer.recommendation`, `answer.confidence`, `answer.nextTest` | ✅ |
| SQL Performance Advisor | `runtime/orchestrator.js`, `skills/sql-performance-advisor` | `diagnosis`, `rankedRecommendations`, `workloadImpact`, `consultantAnswer`, `evidenceChain` | ✅ |
