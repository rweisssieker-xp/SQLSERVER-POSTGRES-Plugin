const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function listSubmissionFiles() {
  const output = childProcess.execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: repoRoot, encoding: "utf8" },
  );
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => fs.existsSync(path.join(repoRoot, file)));
}

test("repository root contains required Codex plugin manifest", () => {
  const manifestPath = path.join(repoRoot, ".codex-plugin", "plugin.json");
  assert.equal(fs.existsSync(manifestPath), true, ".codex-plugin/plugin.json must exist at repository root");

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.name, "sqlserver-postgres-performance-advisor");
  assert.equal(manifest.skills, "./plugins/sqlserver-postgres-performance-advisor/skills/");
});

test("submission artifact stays within scanner file-count limit", () => {
  const files = listSubmissionFiles();
  assert.ok(files.length <= 128, `submission has ${files.length} files, limit is 128`);
});
