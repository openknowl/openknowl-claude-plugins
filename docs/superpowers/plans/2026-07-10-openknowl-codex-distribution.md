# OpenKnowl Codex Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package `openknowl-data` for simple Codex/ChatGPT app installation without granting end users private GitHub access, while keeping database credentials and server-side access controls out of the plugin bundle.

**Architecture:** Keep the existing private source repository and AWS API Gateway + Lambda proxy. Publish a sanitized Codex distribution package through a custom marketplace; users install it in the app and enter the shared invitation token during onboarding. The first implementation keeps the current CLI/skill request path, while treating the proxy—not the client bundle—as the authorization boundary.

**Tech Stack:** Codex plugin manifest, JSON marketplace metadata, Markdown skills, existing TypeScript CLI bundle, PNG plugin asset, Python validation helpers, npm build.

---

## Task 1: Verify the app-only custom marketplace path before changing the package

**Files:**
- No repository files modified.

- [x] **Step 1: Confirm the supported client surfaces.**

Open Codex desktop and ChatGPT desktop/web plugin settings for the personal account and record whether a custom marketplace can be added without CLI access or a Team/Business workspace.

- [x] **Step 2: Test the two-step user flow.**

Use a disposable marketplace entry and verify that a non-developer can add the marketplace, install a plugin, start a new task, and load its bundled skill.

- [x] **Step 3: Record the result.**

If the app supports the flow, continue with Tasks 2–6. If it does not, stop before implementation and report that the remaining choices are a one-time admin/CLI setup or official marketplace submission with identity verification.

## Task 2: Add the supplied OpenKnowl logo to the Codex distribution package

**Files:**
- Create: `plugins/openknowl-data/assets/logo.png`
- Modify: `plugins/openknowl-data/.codex-plugin/plugin.json`
- Modify: `openknowl-data/.codex-plugin/plugin.json`

- [x] **Step 1: Copy the supplied 250×250 RGBA PNG into the package.**

```bash
mkdir -p plugins/openknowl-data/assets
cp /var/folders/q7/ts8g_cb52qjd107ft8q07cp80000gn/T/codex-clipboard-gzPojr.png plugins/openknowl-data/assets/logo.png
```

- [x] **Step 2: Add install-surface logo metadata to both Codex manifests.**

Add these fields inside each manifest's existing `interface` object:

```json
"logo": "./assets/logo.png",
"composerIcon": "./assets/logo.png"
```

- [x] **Step 3: Confirm the distribution package contains only shippable files.**

The package may contain `.codex-plugin/`, `assets/`, `dist/`, and `skills/`; it must not contain `openknowl-credentials.json`, `.creds`, `node_modules`, or TypeScript source.

## Task 3: Make onboarding accept the administrator invitation token without shipping it

**Files:**
- Modify: `openknowl-data/skills/onboarding/SKILL.md`
- Modify: `plugins/openknowl-data/skills/onboarding/SKILL.md`

- [x] **Step 1: Preserve the existing missing-credentials diagnostic.**

Keep the diagnostic states and the runtime file name `openknowl-credentials.json`; do not add a token or proxy URL to the skill text.

- [x] **Step 2: Replace manual administrator-file wording with token-entry guidance.**

Explain that the user receives one invitation token from the administrator and enters it in the current project setup. The instructions must never print or echo the token.

- [x] **Step 3: Keep the proxy URL separate from the token.**

The skill may reference the configured `PROXY_URL` but must not embed credentials or a shared token. If the current app cannot write the local credentials file through its supported UI, retain the existing file-based fallback and state that it is an administrator-assisted setup.

- [x] **Step 4: Synchronize the Codex copy with the source skill.**

After editing the source onboarding skill, copy only the intended skill file and referenced assets into `plugins/openknowl-data/skills/`.

## Task 4: Keep the client package non-authoritative for security

**Files:**
- Review: `openknowl-data/cli/src/query.ts`
- Review: `openknowl-data/cli/src/env.ts`
- Review: `openknowl-data/dist/cli.js`
- Review: `plugins/openknowl-data/dist/cli.js`

- [x] **Step 1: Verify no credential literals are present.**

```bash
rg -n --hidden -g '!node_modules' -g '!*.lock' 'PROXY_TOKEN|openknowl-credentials|X-Api-Token' plugins/openknowl-data
```

Expected: only runtime variable names, file-name references, and header construction; no token value.

- [x] **Step 2: Keep the client-side SELECT guard explicitly non-authoritative.**

Do not treat the regular expression in `query.ts` as authorization. The external AWS proxy owner must verify that missing/invalid tokens return `401`/`403` and that non-read-only requests are rejected server-side.

- [x] **Step 3: Record the external proxy prerequisite.**

The proxy source is not in this repository, so repository verification cannot prove server-side enforcement. Record the required AWS-side check in the handoff rather than claiming it is implemented here.

## Task 5: Version and metadata review for the Codex-only package change

**Files:**
- Modify: `openknowl-data/.codex-plugin/plugin.json`
- Modify: `plugins/openknowl-data/.codex-plugin/plugin.json`

- [x] **Step 1: Bump the Codex plugin version once for the shipped logo/onboarding package change.**

Use the next patch version after the current `1.0.24` and keep the version and description text synchronized in both Codex manifests. Do not change Claude-only versions unless the shared onboarding skill changes behavior that Claude also ships.

- [x] **Step 2: Validate manifest paths.**

Confirm `skills` still points to `./skills/` and the logo paths start with `./assets/`.

## Task 6: Validate and review the deliverable

**Files:**
- No new source files beyond Tasks 2–3.

- [x] **Step 1: Parse all shipped JSON.**

```bash
node -e 'for (const f of [".agents/plugins/marketplace.json","openknowl-data/.codex-plugin/plugin.json","plugins/openknowl-data/.codex-plugin/plugin.json"]) JSON.parse(require("fs").readFileSync(f,"utf8")); console.log("JSON OK")'
```

- [x] **Step 2: Validate plugin structure and skill frontmatter.**

```bash
python3 /Users/blanc/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/openknowl-data
```

Confirm every Codex `SKILL.md` has `name` and `description` frontmatter.

- [x] **Step 3: Check package exclusion rules.**

```bash
if find plugins/openknowl-data -name '.creds' -o -name 'node_modules' -o -name 'openknowl-credentials.json' | grep -q .; then exit 1; else echo 'package exclusions OK'; fi
```

- [x] **Step 4: Render/inspect the supplied logo.**

Confirm `plugins/openknowl-data/assets/logo.png` is a 250×250 PNG and visually matches the supplied blue circular logo.

- [x] **Step 5: Review the diff.**

```bash
git diff --check
git diff -- .claude-plugin openknowl-data plugins .agents
```

Confirm existing Claude/Cowork paths remain present and no credentials or unrelated files are included.

- [ ] **Step 6: Commit the implementation as one focused change.**

```bash
git add plugins/openknowl-data openknowl-data/.codex-plugin/plugin.json openknowl-data/skills/onboarding/SKILL.md
git commit -m "feat: prepare OpenKnowl Codex app distribution"
```
