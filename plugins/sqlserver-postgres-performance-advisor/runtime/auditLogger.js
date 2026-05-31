const fs = require("node:fs");
const path = require("node:path");
const { getPolicy } = require("./config");

function isSensitiveValue(value) {
  if (value === undefined || value === null) {
    return false;
  }
  return /password|secret|token|key|credential|dsn/i.test(String(value));
}

function sanitizeObject(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item));
  }
  if (value && typeof value === "object") {
    const clone = {};
    for (const [key, v] of Object.entries(value)) {
      if (key && isSensitiveValue(key)) {
        clone[key] = "***redacted***";
      } else {
        clone[key] = sanitizeObject(v);
      }
    }
    return clone;
  }
  return value;
}

function resolveReplayFile(logFile) {
  return path.join(path.dirname(logFile), "replay.jsonl");
}

function readLastReplayFilePath(logFile) {
  const replayFile = resolveReplayFile(logFile);
  if (!fs.existsSync(replayFile)) {
    return "";
  }
  const lines = fs.readFileSync(replayFile, "utf8").trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) {
    return "";
  }
  const last = lines[lines.length - 1];
  try {
    const parsed = JSON.parse(last);
    return parsed.replayId || "";
  } catch {
    return "";
  }
}

function buildReplayEvent(logFile, event) {
  const replayId = `replay-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  const previousReplayId = readLastReplayFilePath(logFile);
  return {
    ...event,
    replayId,
    previousReplayId: previousReplayId || null,
  };
}

function ensureStateDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function appendAuditEvent(logFile, event) {
  ensureStateDir(logFile);
  const includePayload = getPolicy().replay?.includePayload;
  const record = {
    ...event,
    ts: new Date().toISOString(),
  };
  const safeRecord = {
    ...record,
    payload: sanitizeObject(record.payload || {}),
  };
  fs.appendFileSync(logFile, `${JSON.stringify(safeRecord)}\n`, "utf8");
  const replayRecord = includePayload ? safeRecord : { ...safeRecord, payload: "[redacted]" };
  const replay = buildReplayEvent(logFile, replayRecord);
  const replayFile = resolveReplayFile(logFile);
  fs.appendFileSync(replayFile, `${JSON.stringify(replay)}\n`, "utf8");
  return { record, replay };
}

function buildEvent({
  tool,
  actor = "codex-agent",
  environment = "lab",
  riskLevel = "LOW",
  decision = "ALLOW",
  payload = {},
  requiresApproval = false,
  status,
  blockedReason,
}) {
  return {
    actor,
    environment,
    tool,
    riskLevel,
    decision,
    status,
    requiresApproval,
    blockedReason,
    payload,
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  };
}

function readReplayLog(logFile, replayId) {
  const replayFile = resolveReplayFile(logFile);
  if (!fs.existsSync(replayFile)) {
    return [];
  }
  const lines = fs.readFileSync(replayFile, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((entry) => !replayId || entry.replayId === replayId);
}

module.exports = {
  appendAuditEvent,
  buildEvent,
  readReplayLog,
};
