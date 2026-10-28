# AGENTS.md - Digital_Assistant_Client

Browser extension UI (Chrome, Manifest V3) for the Universal Digital Assistant Network. The core logic is the published npm package `@udan/digital-assistant-sdk` (pinned to an exact version); this repo holds the UI, the content scripts and the background worker. **This repo is public.** Workspace rules (branches, Docker scripts, agent-agnostic files) are in the workspace `AGENTS.md`; this file covers only this repo. `CLAUDE.md` is a one-line import of this file.

## Public-repo rule
- Never commit or print private values: hostnames of the real backends, AWS account ids, Parameter Store paths, secrets, tokens. Describe them by role ("the TEST backend").
- Backend URLs reach the build only as Actions **variables** (organization level, shared with the SDK repo) or from a gitignored `environments/<build>.env`. Never as secrets, never in tracked files.
- Everything inlined into the extension can be read by anyone who unzips it. Secret keys (`keycloakClientSecret`, `profanityKey`, `googleTranslateApiKey`, `googleAnalyticsSecretKey`, `clientSecret`) must have no value in any env file; `scripts/ci/check-env-keys.sh` fails the build otherwise. Never ship, release or upload a zip built with a secret.

## Commands (Node 22)
- `npm ci` (or `npm install`), then `npm run build:prod` -> `dist/` (not committed); `npm run build` -> `build/`; `npm start` watches; `npx tsc --noEmit` is the type check.
- There is no unit-test suite. CI checks: build and pack, type check, gitleaks, workflow lint, `npm audit` (report only).
- `scripts/ci/*`: the workflows only call these scripts, run them locally the same way. Index and details: `scripts/ci/README.md`.
  - `package-extension.sh` builds once and writes `out/udan-extension-<X.Y.Z.N>.zip`, `SHA256SUMS`, `build-info.json`.
  - `generate-env.sh`, `check-env-keys.sh`, `lint-workflows.sh`, `latest-client-build.sh`, `publish-test-build.sh`, `smoke-extension.sh`.
- `webpack` is pinned at 5.105.4 (5.112.0 fails on the SDK bundle). Do not bump it casually; `buffer` and `process` are direct dependencies on purpose (webpack `ProvidePlugin`).

## Environment settings
- Schema = `environments/env.example` (12 public keys, each URL as a `Prod`/`Test` pair). Add a new key to `env.example` only (`scripts/build-env.js` and `generate-env.sh` read the schema; the UPPER_SNAKE Actions variable must also exist) and say so in the PR. Values come from `environments/<build>.env`, or an environment variable with the key's own name.
- Runtime choice of TEST or PROD (page key, options override, install type, default PROD) lives in `src/config/runtimeEnvironment.ts`; read the README section "TEST or PROD at runtime" before changing it. A host page must call `UDAPluginSDK` after the `UDASdkReady` event.
- Manifest changes (permissions, `action`, `options_ui`) need the owner's OK.

## Branches, releases, rollback
- Branch from `dev`, PR into `dev`, Conventional Commit PR title (`feat:`, `fix:`...). No commit, push or PR unless the owner asks. Never touch `master`.
- CI builds one zip per `dev` push (artifact `client-zip`, 90 days). `Deploy to TEST` (manual, `dev` only) publishes that same zip as prereleases `test-v<version>` and `test-current` and never rebuilds; rollback = run it with an older `version`. Release Please owns `package.json` and `CHANGELOG`, CI owns the extension version in the built manifest (`X.Y.Z.<run>`).
- The SDK pin changes only through a PR; the SDK is promoted to npm `latest` after a Client TEST pass (SDK `RELEASE_PROCESS.md`).
- Chrome Web Store upload and the SDK CDN feed are not built yet (track phases C08, C09).
