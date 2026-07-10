# OpenKnowl Codex Distribution Design

## Goal

Allow invited users to install and use `openknowl-data` from both the Codex desktop app and ChatGPT plugin surfaces without granting them access to the private GitHub source repository.

## Confirmed requirements

- GitHub remains private and is used for source control.
- Users are invited users, not an unrestricted public audience.
- All invited users share the same read-only data scope.
- Authentication uses one administrator-issued invitation token.
- Token rotation or revocation is not required in the first version.
- Users ask questions in natural language.
- Installation should be simple; a one-time two-step marketplace setup is acceptable.
- Official public marketplace submission is excluded if it requires developer/business identity verification.
- Existing AWS API Gateway + Lambda proxy remains the data boundary.

## Existing system

- `openknowl-data/cli/src/env.ts` loads `PROXY_URL` and `PROXY_TOKEN` from a runtime `openknowl-credentials.json` file.
- `openknowl-data/cli/src/query.ts` sends SQL to the proxy with `X-Api-Token` and performs a client-side `SELECT` check.
- The proxy implementation and database credentials are outside this repository and are managed in AWS API Gateway + Lambda.
- `plugins/openknowl-data/` is the Codex distribution package and currently contains the bundled CLI and skills.

## Proposed architecture

### Source and distribution

Keep the full implementation and build source in the private GitHub repository. Publish a separate sanitized distribution package/marketplace that contains only the installable Codex plugin surface. End users do not receive GitHub repository access.

The distribution package may contain the current skill and CLI during the first phase, but must not contain database credentials, a shared proxy token, or private source files. The package is not a security boundary; users can inspect it.

### Runtime data path

```text
Codex or ChatGPT plugin
  -> bundled CLI/skill request
  -> existing API Gateway endpoint
  -> Lambda token validation and read-only query enforcement
  -> database
```

The proxy must reject missing, invalid, and unauthorized tokens with `401`/`403`. Database credentials remain Lambda-side only. The client-side `SELECT` check is retained as a usability guard, not treated as authorization.

### Authentication

The first version uses one administrator-issued invitation token entered during onboarding and stored locally for the user's project/session. The token is never bundled into the plugin or marketplace package.

Because the token is shared and non-revocable in the first version, the distribution and onboarding instructions must treat it as sensitive. A later version can add per-user tokens and revocation without changing the plugin installation model.

### Query safety

Natural-language questions remain supported through the existing skill workflow. The proxy, not the client bundle, is the security boundary and must enforce read-only access, query limits, and safe response shaping. Moving schema/query interpretation fully server-side is optional follow-up work, not part of the first implementation.

## Installation flow

1. Administrator sends the marketplace/setup link and invitation token.
2. User adds the custom marketplace in the app.
3. User installs `openknowl-data`.
4. User starts onboarding and enters the invitation token.
5. User asks natural-language data questions in a new task/session.

Before implementation, verify that personal-plan Codex and ChatGPT clients support adding the custom marketplace without CLI or Team workspace access. If the app cannot do this, the design must choose between a one-time CLI/admin setup and an officially published marketplace.

## Security requirements

- Never commit `openknowl-credentials.json` or any token.
- Never put a shared token in `plugin.json`, `SKILL.md`, `dist/cli.js`, or marketplace metadata.
- Enforce authentication and authorization in Lambda/API Gateway.
- Use a read-only database principal.
- Reject non-`SELECT` operations server-side; do not rely on client regex checks.
- Apply query timeouts, row limits, and rate limits.
- Avoid returning credentials, internal identifiers, or unnecessary personal data.
- Document that installed plugin files are inspectable by users.

## Out of scope for the first version

- Official public marketplace submission and OpenAI review.
- Per-user identity, token rotation, and token revocation.
- A new standalone MCP platform or database service.
- Full server-side natural-language query planning.

## Success criteria

- No end user needs private GitHub repository access.
- An invited user can install the plugin through the supported app flow with at most one marketplace setup and token entry.
- A user without the token cannot receive database results.
- Database credentials and server implementation never ship in the plugin package.
- Existing Claude/Cowork plugin paths remain unchanged.
