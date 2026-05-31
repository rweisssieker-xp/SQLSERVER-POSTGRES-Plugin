const test = require("node:test");
const assert = require("node:assert/strict");
const { dispatch } = require("../runtime/orchestrator");

test("ai_strategy_synthesizer creates an AI database roadmap", async () => {
  const result = await dispatch("ai_strategy_synthesizer", {
    objective: "make database operations AI-native for enterprise teams",
    maturity: "pilot",
    priorities: ["latency", "governance", "cost"],
  });

  assert.equal(result.usp, "ai_strategy_synthesizer");
  assert.equal(result.source, "analysis");
  assert.ok(result.roadmap.length >= 3);
  assert.ok(result.guardrails.includes("closed_loop_dry_run"));
  assert.ok(result.recommendations.some((item) => item.includes("AI")));
});

test("cognitive_schema_mapper maps schema signals into business ontology", async () => {
  const result = await dispatch("cognitive_schema_mapper", {
    tables: ["orders", "payments", "customers"],
    domainTerms: ["checkout", "customer", "revenue"],
  });

  assert.equal(result.usp, "cognitive_schema_mapper");
  assert.ok(result.ontology.entities.some((entity) => entity.name === "orders"));
  assert.ok(Array.isArray(result.semanticGaps));
  assert.ok(result.evidence.includes("schema_terms"));
});

test("llm_prompt_risk_auditor flags ambiguous and unsafe AI SQL intent", async () => {
  const result = await dispatch("llm_prompt_risk_auditor", {
    prompt: "Fix production by dropping slow indexes and update all customers",
    environment: "production",
  });

  assert.equal(result.usp, "llm_prompt_risk_auditor");
  assert.ok(result.risks.includes("destructive_intent"));
  assert.ok(result.risks.includes("production_scope"));
  assert.notEqual(result.decision, "dry_run_ready");
});

test("ai_decision_simulator simulates agent decisions under policy constraints", async () => {
  const result = await dispatch("ai_decision_simulator", {
    proposedAction: "create index on orders(status)",
    evidence: { hasLivePlan: true, hasRollback: false },
    policy: { requireHumanApproval: true },
  });

  assert.equal(result.usp, "ai_decision_simulator");
  assert.ok(result.simulatedDecisions.length >= 3);
  assert.ok(result.simulatedDecisions.some((decision) => decision.id === "defer_for_approval"));
  assert.ok(["needs_more_evidence", "approval_required", "do_not_proceed"].includes(result.decision));
});

test("autonomous_learning_backlog converts feedback into prioritized learning tasks", async () => {
  const result = await dispatch("autonomous_learning_backlog", {
    outcomes: [{ tool: "sql_performance_advisor", result: "recommendation lacked rollback proof" }],
    incidents: ["checkout latency regression"],
  });

  assert.equal(result.usp, "autonomous_learning_backlog");
  assert.ok(result.learningBacklog.length >= 3);
  assert.ok(result.learningBacklog[0].priority >= result.learningBacklog.at(-1).priority);
  assert.equal(result.executionMode, "analysis_only");
});

test("knowledge_gap_detector finds missing context before AI action", async () => {
  const result = await dispatch("knowledge_gap_detector", {
    objective: "recommend production index",
    evidence: { hasSchema: true, hasLivePlan: false, hasTelemetry: false, hasPolicy: true },
  });

  assert.equal(result.usp, "knowledge_gap_detector");
  assert.ok(result.knowledgeGaps.includes("live_execution_plan"));
  assert.ok(result.knowledgeGaps.includes("telemetry_correlation"));
  assert.equal(result.decision, "needs_more_evidence");
});

test("ai_trust_scorecard scores explainability, safety, reproducibility, and governance", async () => {
  const result = await dispatch("ai_trust_scorecard", {
    evidence: { hasExplanation: true, hasPolicy: true, hasReplay: false, hasRollback: true },
  });

  assert.equal(result.usp, "ai_trust_scorecard");
  assert.ok(result.trustScore.total >= 0);
  assert.ok(result.trustScore.dimensions.explainability >= 0);
  assert.ok(result.confidence);
});

test("semantic_incident_predictor predicts likely incident classes", async () => {
  const result = await dispatch("semantic_incident_predictor", {
    signals: ["lock waits", "stale statistics", "tenant hot key"],
    workload: "checkout write path",
  });

  assert.equal(result.usp, "semantic_incident_predictor");
  assert.ok(result.predictions.length >= 3);
  assert.ok(result.predictions.some((prediction) => prediction.incidentClass === "lock_contention"));
  assert.equal(result.source, "analysis");
});

test("cross_agent_consensus_builder summarizes agreement and disagreement", async () => {
  const result = await dispatch("cross_agent_consensus_builder", {
    agentFindings: [
      { agent: "performance", recommendation: "rewrite query", confidence: 0.8 },
      { agent: "cost", recommendation: "rewrite query", confidence: 0.7 },
      { agent: "compliance", recommendation: "require approval", confidence: 0.9 },
    ],
  });

  assert.equal(result.usp, "cross_agent_consensus_builder");
  assert.ok(result.consensus.recommendation.includes("rewrite query"));
  assert.ok(result.disagreements.length >= 1);
  assert.ok(result.confidence);
});

test("ai_roi_narrative_generator produces executive ROI evidence", async () => {
  const result = await dispatch("ai_roi_narrative_generator", {
    teamHoursSavedMonthly: 80,
    avoidedIncidents: 2,
    costSavingsMonthly: 12000,
    sloImprovementPct: 18,
  });

  assert.equal(result.usp, "ai_roi_narrative_generator");
  assert.ok(result.executiveNarrative.includes("AI"));
  assert.ok(result.roiSignals.monthlyValueScore > 0);
  assert.ok(result.evidence.length >= 3);
});
