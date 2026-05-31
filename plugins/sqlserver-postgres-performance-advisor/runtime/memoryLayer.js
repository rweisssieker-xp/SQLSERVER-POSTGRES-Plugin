const fs = require("node:fs");
const path = require("node:path");

function sleepSync(ms) {
  const buffer = new SharedArrayBuffer(4);
  const view = new Int32Array(buffer);
  Atomics.wait(view, 0, 0, ms);
}

function withRetry(fn, fallback) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      sleepSync(10 * (attempt + 1));
    }
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw lastError;
}

function getStateFile(filePath) {
  const base = filePath || path.join(process.cwd(), ".codexdb", "runtime-state.json");
  const baseDir = path.extname(base) ? path.dirname(base) : base;
  return path.join(baseDir, "memory.json");
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadState(filePath) {
  return withRetry(() => {
    if (!fs.existsSync(filePath)) {
      return { incidents: [], policyDecisions: [], workloadSignals: [], executionReplays: [] };
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }, { incidents: [], policyDecisions: [], workloadSignals: [], executionReplays: [] });
}

function saveState(filePath, state) {
  ensureDir(filePath);
  withRetry(() => {
    const tempFile = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf8");
    fs.renameSync(tempFile, filePath);
    return true;
  });
}

function remember(context, category, entry) {
  const filePath = getStateFile(context.stateFile);
  const state = loadState(filePath);
  state[category] = Array.isArray(state[category]) ? state[category] : [];
  if (category === "executionReplays") {
    const policy = context.policy || {};
    const maxEntries = Number(policy.replay?.maxEntries || 1000);
    state[category] = state[category].slice(-Math.max(1, maxEntries - 1));
  }
  state[category].push({
    ...entry,
    id: `mem-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ts: new Date().toISOString(),
  });
  saveState(filePath, state);
  return { status: "recorded", category, id: state[category].at(-1).id };
}

function recall(context, category, limit = 5) {
  const filePath = getStateFile(context.stateFile);
  const state = loadState(filePath);
  const values = Array.isArray(state[category]) ? state[category] : [];
  return values.slice(-Number(limit)).reverse();
}

module.exports = {
  remember,
  recall,
};
