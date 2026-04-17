"use strict";

// src/query.ts
var import_child_process = require("child_process");

// src/env.ts
var import_fs = require("fs");
var import_path = require("path");
var CREDS_FILE = "openknowl-credentials.json";
function tryLoad(path) {
  try {
    if (!(0, import_fs.existsSync)(path)) return null;
    return JSON.parse((0, import_fs.readFileSync)(path, "utf8"));
  } catch {
    return null;
  }
}
function searchUpward(start) {
  let dir = start;
  while (true) {
    const found = tryLoad((0, import_path.join)(dir, CREDS_FILE));
    if (found) return found;
    const parent = (0, import_path.dirname)(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
function searchCoworkMounts() {
  try {
    for (const session of (0, import_fs.readdirSync)("/sessions")) {
      const mntDir = (0, import_path.join)("/sessions", session, "mnt");
      if (!(0, import_fs.existsSync)(mntDir)) continue;
      for (const project of (0, import_fs.readdirSync)(mntDir)) {
        const found = tryLoad((0, import_path.join)(mntDir, project, CREDS_FILE));
        if (found) return found;
      }
    }
  } catch {
  }
  return null;
}
function loadCreds() {
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (projectDir) {
    const found = tryLoad((0, import_path.join)(projectDir, CREDS_FILE));
    if (found) return found;
  }
  return searchUpward(process.cwd()) ?? searchCoworkMounts() ?? {};
}
var creds = loadCreds();
var PROXY_URL = creds.PROXY_URL ?? "";
var PROXY_TOKEN = creds.PROXY_TOKEN ?? "";

// src/query.ts
if (!PROXY_URL) {
  console.error("\uC624\uB958: openknowl-credentials.json \uD30C\uC77C\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  console.error("/openknowl-data:onboarding \uC2A4\uD0AC\uC744 \uC2E4\uD589\uD558\uC5EC \uC124\uC815 \uBC29\uBC95\uC744 \uD655\uC778\uD558\uC138\uC694.");
  process.exit(1);
}
var sql = process.argv[2];
if (!sql) {
  console.error('\uC0AC\uC6A9\uBC95: node dist/cli.js "SELECT ..."');
  process.exit(1);
}
if (!/^\s*SELECT\b/i.test(sql.trim())) {
  console.error("SELECT \uCFFC\uB9AC\uB9CC \uD5C8\uC6A9\uB429\uB2C8\uB2E4.");
  process.exit(1);
}
async function run() {
  const body = JSON.stringify({ sql });
  const result = (0, import_child_process.execSync)(
    `curl -s -X POST "${PROXY_URL}" -H "Content-Type: application/json" -H "X-Api-Token: ${PROXY_TOKEN}" -d @-`,
    { input: body, encoding: "utf-8", timeout: 3e4 }
  );
  const data = JSON.parse(result);
  if (data.error) throw new Error(data.error);
  console.log(JSON.stringify(data.rows, null, 2));
}
run().catch((err) => {
  console.error("\uC624\uB958:", err.message);
  process.exit(1);
});
