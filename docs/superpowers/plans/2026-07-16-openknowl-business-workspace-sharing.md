# OpenKnowl Business Workspace Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Share the existing `openknowl-data` Codex plugin with every member of the OpenKnowl Business workspace without exposing the private source repository or shipping credentials.

**Architecture:** Keep the private repository as the source of truth and use `plugins/openknowl-data/` as the sanitized install package. Install that package in the OpenKnowl Business workspace through the existing local marketplace, share it from the desktop app with the whole workspace, and keep authorization in each user's runtime credential setup plus the API Gateway/Lambda proxy.

**Tech Stack:** Codex plugin manifest, JSON marketplace metadata, Markdown skills, bundled Node CLI, ChatGPT desktop app workspace sharing, existing AWS API Gateway/Lambda proxy.

---

### Task 1: Freeze the distribution inputs and inspect existing worktree changes

**Files:**
- Read: `openknowl-data/skills/miniintern-operations/SKILL.md`
- Read: `openknowl-data/skills/search-data/SKILL.md`
- Read: `plugins/openknowl-data/skills/miniintern-operations/SKILL.md`
- Read: `plugins/openknowl-data/skills/search-data/SKILL.md`
- Read: `openknowl-data/.codex-plugin/plugin.json`
- Read: `plugins/openknowl-data/.codex-plugin/plugin.json`
- Read: `.agents/plugins/marketplace.json`

- [ ] **Step 1: Record the current branch and unrelated worktree state**

Run:

```bash
git status --short --branch
git diff -- openknowl-data/skills/miniintern-operations/SKILL.md openknowl-data/skills/search-data/SKILL.md
```

Expected: the pre-existing modifications and untracked files are listed; do not stage, revert, or rewrite them as part of this rollout.

- [ ] **Step 2: Compare source skills with the Codex distribution copy**

Run:

```bash
diff -u openknowl-data/skills/miniintern-operations/SKILL.md plugins/openknowl-data/skills/miniintern-operations/SKILL.md
diff -u openknowl-data/skills/search-data/SKILL.md plugins/openknowl-data/skills/search-data/SKILL.md
```

Expected: differences are either absent or explicitly reviewed before installation. If a current uncommitted source change is missing from the distribution copy, stop and ask whether it belongs in this rollout before syncing it.

- [ ] **Step 3: Confirm the package boundary**

Run:

```bash
find plugins/openknowl-data -type f | sort
```

Expected: only `.codex-plugin/`, `assets/`, `dist/`, and `skills/` runtime files are present; no CLI source, `.creds`, `node_modules`, or credential file is included.

### Task 2: Validate the installable Codex package

**Files:**
- Read: `plugins/openknowl-data/.codex-plugin/plugin.json`
- Read: `plugins/openknowl-data/skills/*/SKILL.md`
- Read: `plugins/openknowl-data/dist/cli.js`

- [ ] **Step 1: Parse all shipped JSON**

Run:

```bash
node -e 'for (const f of [".agents/plugins/marketplace.json","openknowl-data/.codex-plugin/plugin.json","plugins/openknowl-data/.codex-plugin/plugin.json"]) JSON.parse(require("fs").readFileSync(f,"utf8")); console.log("JSON OK")'
```

Expected: `JSON OK`.

- [ ] **Step 2: Run the Codex plugin validator**

Run:

```bash
python3 /Users/blanc/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/openknowl-data
```

Expected: validation succeeds and every bundled `SKILL.md` has `name` and `description` frontmatter.

- [ ] **Step 3: Check package exclusions and credential literals**

Run:

```bash
if find plugins/openknowl-data \( -name '.creds' -o -name 'node_modules' -o -name 'openknowl-credentials.json' \) -print -quit | grep -q .; then exit 1; else echo 'package exclusions OK'; fi
rg -n --hidden -g '!node_modules' -g '!*.lock' 'PROXY_TOKEN|openknowl-credentials|X-Api-Token' plugins/openknowl-data
```

Expected: `package exclusions OK`; any matches are runtime variable/file/header references only, never a literal token or database credential.

- [ ] **Step 4: Build only if the CLI source is part of the approved rollout**

If Task 1 confirms an approved change under `openknowl-data/cli/src/`, run:

```bash
cd openknowl-data/cli
npm install
npm run build
```

Then synchronize only the resulting `dist/cli.js` into `plugins/openknowl-data/dist/cli.js` and rerun Task 2. If no CLI source change is approved, keep the existing bundled artifact unchanged.

### Task 3: Install the plugin in the OpenKnowl Business workspace

**Files:**
- No repository files modified.

- [ ] **Step 1: Switch the active desktop workspace**

In the ChatGPT desktop app, open the profile/workspace selector and select `OpenKnowl` instead of `Personal`. Confirm the app header and Plugins page show the OpenKnowl workspace.

- [ ] **Step 2: Add or refresh the repository marketplace**

From the Codex CLI, ensure the existing marketplace is available:

```bash
codex plugin marketplace list
```

Expected: `openknowl-plugins` resolves to `/Users/blanc/Documents/OpenKnowl/openknowl-claude-plugins`.

If it is missing, add the local repository marketplace:

```bash
codex plugin marketplace add /Users/blanc/Documents/OpenKnowl/openknowl-claude-plugins
```

- [ ] **Step 3: Install `openknowl-data` from the marketplace**

In Codex CLI, run `codex`, open `/plugins`, select the `openknowl-plugins` marketplace, choose `openknowl-data`, and install it. In the desktop app, refresh the Plugins page if needed and confirm the plugin appears under the active OpenKnowl workspace.

- [ ] **Step 4: Start a new task after installation**

Create a new Codex task in the OpenKnowl workspace. Do not rely on an already-open task, because bundled skills load for new sessions after installation.

### Task 4: Share the installed plugin with all workspace members

**Files:**
- No repository files modified.

- [ ] **Step 1: Open the plugin sharing controls**

In the desktop app, open `Plugins → Created by you`, select `openknowl-data`, and choose `Share`.

- [ ] **Step 2: Set the workspace-wide audience**

Choose the OpenKnowl workspace's all-members audience, or the workspace group that contains every intended team member. Send the generated invitation/link only through the team's approved channel.

- [ ] **Step 3: Verify the workspace policy**

If `Share` is unavailable or blocked, ask an OpenKnowl workspace administrator to check whether managed requirements disable plugin sharing. Do not bypass the policy by publishing the plugin publicly.

- [ ] **Step 4: Confirm the shared listing**

Open the Plugins directory while signed into the OpenKnowl workspace and confirm `openknowl-data` appears under the workspace-provided or shared section, not only under Personal.

### Task 5: Onboard a representative team member and verify the data boundary

**Files:**
- No repository files modified.

- [ ] **Step 1: Install from the shared workspace listing**

Have a representative non-owner team member, signed into OpenKnowl Business, install `openknowl-data` from `Shared with you` or the workspace section and start a new task.

- [ ] **Step 2: Configure runtime credentials without exposing them**

Deliver the administrator-issued invitation token through an approved secure channel. The team member enters it through the onboarding flow or local `openknowl-credentials.json` setup; never paste it into the repository, skill text, marketplace metadata, chat transcript, or a shared document.

- [ ] **Step 3: Run a read-only smoke test**

Ask the member to run one known safe natural-language query, such as `현재 모집중인 미니인턴 몇 개야?`, and verify a result is returned.

- [ ] **Step 4: Verify unauthorized behavior**

In a disposable test account without the token, run the same query and verify the proxy returns an authentication failure and no database result. This check must be performed at the API Gateway/Lambda boundary; the client-side `SELECT` guard is not sufficient.

### Task 6: Handoff and maintenance verification

**Files:**
- Read: `docs/superpowers/specs/2026-07-16-openknowl-business-workspace-sharing-design.md`

- [ ] **Step 1: Review the final repository diff**

Run:

```bash
git diff --check
git diff -- .claude-plugin openknowl-data plugins .agents
git status --short
```

Expected: no accidental Claude path removal, no credential files, and no unrelated changes staged by this rollout.

- [ ] **Step 2: Record the operational handoff**

Report separately: package validation result, workspace sharing result, representative-user smoke-test result, API unauthorized-result, plugin version shared, and any remaining admin or proxy-owner action.

- [ ] **Step 3: Define the update rule**

For future shared skill, CLI, or onboarding changes, bump both Claude and Codex versions when the behavior is shared; rebuild and synchronize `dist/cli.js` when CLI source changes; rerun Tasks 1–6 before resharing the updated plugin.

