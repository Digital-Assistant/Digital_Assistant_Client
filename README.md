# Digital Assistant Client (UDAN)

Browser extension UI for the Universal Digital Assistant Network. The core logic comes from the published SDK, `@udan/digital-assistant-sdk` (source: https://github.com/Digital-Assistant/Digital-Assistant-SDK), so no local SDK checkout is needed.

## Integrating a site and required settings

The SDK needs `realm`, `clientId` and `clientSecret` for the customer. There are no defaults: without them the SDK sends no request and logs which keys are missing. Host page setup (script tags, `UDAAuthDataConfig`, `UDAPluginSDK`, the `UDASdkReady` rule) is in the SDK's [`USAGE.md`](https://github.com/Digital-Assistant/Digital-Assistant-SDK/blob/main/USAGE.md), with a runnable [`sample/index.html`](https://github.com/Digital-Assistant/Digital-Assistant-SDK/blob/main/sample/index.html).

## Build

```
npm install
npm run build        # default build -> build/
npm run build:dev    # development
npm run build:prod   # production -> dist/ (local build folder, not committed)
npm run build:qa     # QA -> dist/
```

`npm start` runs webpack in watch mode.

## Environment settings

The build reads public settings from `environments/<build>.env`: `local.env` for `npm run build`, `development.env`, `production.env` for `npm run build:prod`, `qa.env`. Copy `environments/env.example` (the schema, tracked) to that name and fill in the values; the copies are gitignored. Only the keys in `env.example` are inlined (webpack `DefinePlugin`, rules in `scripts/build-env.js`); an environment variable with the key's name overrides the file.

| Keys | What |
|---|---|
| `baseProdURL`, `baseTestURL` | Backend REST base, including `/api` |
| `tokenProdUrl`, `tokenTestUrl` | Token service |
| `llmProdUrl`, `llmTestUrl` | LLM search |
| `keycloakProdUrl`, `keycloakTestUrl` | Keycloak base URL |
| `keycloakRealm`, `keycloakClientId` | Keycloak realm and public client id |
| `googleAnalyticsMeasurementId`, `enableGoogleAnalytics` | Google Analytics |

Each URL has a PROD and a TEST value, so one build serves both; the environment is chosen at runtime (next section). The values are exposed as `src/config/buildConfig.ts` and handed to the SDK at start-up. The two Google Analytics keys are carried there but nothing reads them yet.

**No secrets.** Everything in these files ends up in the extension, which anyone can unzip. `scripts/ci/check-env-keys.sh` fails the release build if a secret key (`keycloakClientSecret`, `profanityKey`, `googleTranslateApiKey`, `googleAnalyticsSecretKey`, `clientSecret`) has a value or is referenced in `src/`.

Older env files: rename `keyCloakUrl` to `keycloakProdUrl` / `keycloakTestUrl`, split `tokenUrl` and `llmUrl` into the `Prod`/`Test` pairs, and delete the secret keys. `baseURL`, `profanity*` and `googleTranslate*` are no longer read.

## TEST or PROD at runtime

One zip serves both backends. The extension decides when it starts, first match wins:

| Order | Source | Notes |
|---|---|---|
| 1 | The host page: `window.UDAPluginSDK({ environment: 'TEST' })` | Only for pages that talk to the extension; call it after `UDASdkReady` (below) |
| 2 | The options page override (`chrome.storage.local`, key `udanEnvironment`) | Extension options: Automatic, TEST or PROD; a change applies within seconds, no reload of the extension |
| 3 | Install type: an **unpacked** install (`chrome.management.getSelf().installType === 'development'`) is TEST, any other install is PROD | Needs no extra permission; background service worker only |
| 4 | Default: PROD | Same as the SDK |

The URLs for the chosen environment come, per key, from the page (`apiBaseUrl`, `tokenUrl`, `llmUrl`, `keycloakUrl`), then from the build settings above, then from the SDK's own defaults. A key the page set is never overwritten. After you switch the environment, reload the page: the panel does not yet re-run login or search by itself.

- **TEST badge.** When the extension runs against TEST, the panel header and the login screen show a `TEST` badge and the toolbar icon shows `TEST`. No badge means PROD.
- **`UDASdkReady`.** After the extension has applied the environment it fires a `window` event `UDASdkReady` with `detail: { environment: 'TEST' | 'PROD', source: 'page' | 'override' | 'install-type' | 'default' }` and sets `window.UDASdkIsReady = true` (for pages that attach late). A host page must call `UDAAuthDataConfig` and `UDAPluginSDK` only after it: earlier calls reach a copy of the SDK that is replaced later and are lost. Guide: SDK `USAGE.md`.
- **Manifest.** The runtime choice added `action` (toolbar badge) and `options_ui`; no new permission.
- **Rule of thumb for testers.** Unpacked build from `test-current` = TEST. A build installed from the Chrome Web Store (later) = PROD. Whether the store default should be PROD is the owner's decision (R1 in the CI/CD track); the rule above is what the code does today.

## Installing in Chrome (unpacked)

1. Get a zip. Testers: the newest TEST build is on the [`test-current`](../../releases/tag/test-current) prerelease (every build also has its own `test-v<version>` prerelease). Developers: the `client-zip` artifact of a CI run, or `scripts/ci/package-extension.sh` locally (`out/udan-extension-<version>.zip`). Unzip it into a new folder. A plain `npm run build:prod` also works: use `dist/`.
2. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and pick the folder.
3. The card shows the version, for example `1.1.0 (abc1234)` (the `version_name`); **Details** shows the full `1.1.0.<run>`.

Unpacked extensions do not update themselves: remove the old one and load the new folder.

### Developers: build and load your own copy

```
npm install
cp environments/env.example environments/production.env   # fill in public values; see "Environment settings"
npm run build:prod                                        # -> dist/
```

Then load `dist/` unpacked as above, or run `scripts/ci/package-extension.sh` to get the same zip CI makes. A plain `npm run build` writes to `build/` and `npm start` rebuilds on change; reload the extension on `chrome://extensions` after each rebuild. There is no unit-test suite in this repo (the old Jest tests tested code that now lives in the SDK, which has its own); the check is the CI build, the type check and the sanity check below. `build:prod` and `build:qa` drop `console.*` calls (terser `drop_console`); `build` and `build:dev` keep them.


## Sign-in and where the config lives

- **Login path.** The real login is the Chrome identity flow in the background worker (`LoginWithBrowser`, uses `chrome.identity`). The panel's Sign-in button sends the page event `RequestUDASessionData`; the worker answers with the session, or starts `LoginWithBrowser` when no signed-in identity exists. There is deliberately **no Keycloak `check-sso` on page load** (removed on purpose; the original extension never had it): opening a page makes zero Keycloak requests. Do not add one back.
- **Config reaches the worker only through the build.** The worker (`Background.ts`) reads `src/config/buildConfig.ts`, which comes from the env settings above. A host page calling `UDAPluginSDK({...})` only changes the page world, not the worker, so realm and URLs cannot be set from a site. The host-page copy of the SDK (`src/Headers.js`) carries its own SDK build.
- **Backend CORS.** The extension calls the backend from a `chrome-extension://` origin, and customer sites from their own origins. The backend must allow those origins (with credentials) and the request headers `Content-Type`, `Authorization`, `X-Requested-With`, `x-sdk-client` and `udan-realm`; otherwise the browser reports a CORS failure and the sanity check prints "TEST backend CORS". See the Server README, "CORS".

## Testing a change locally

The CI sanity check is unauthenticated. To exercise the whole flow against a local backend (no secrets in the repo, no committed flags):

1. Start the backend (Server `README`, "Run locally") and note its `/api` URL and the realm/client id the SDK must use.
2. Build the SDK you want to test (`npm pack` in the SDK repo, see its `RELEASE_PROCESS.md`) and install the tarball without touching `package.json`: `npm install --no-save <sdk>.tgz`. A later `npm ci` reinstalls the pinned npm version, so install the tarball again after it. Check with `npm ls @udan/digital-assistant-sdk`.
3. `npm run build:dev` with a local env file, then load `build/` unpacked (`chrome://extensions`).
4. For automation use Playwright Chromium with the extension loaded in a persistent profile (`scripts/ci/smoke-extension.mjs` is the pattern) and stub `chrome.identity.getProfileUserInfo` in the service worker, so the Google sign-in needs no real account.
5. The SDK needs `realm`, `clientId` and `clientSecret`; supply the secret only in your own untracked local build and never share or upload that build (everything in it is readable by whoever unzips it).

Behaviour checklist (all 14 pass on `dev` with the current SDK against a local backend; run it by hand or script it):

| # | Check | Pass when |
|---|---|---|
| 1 | Extension loads | The service worker starts |
| 2 | Panel mounts | `#udan-react-root` exists on the page |
| 3 | Early call | A host-page `UDAPluginSDK` call made before the extension is ready is kept (call after `UDASdkReady`, see above) |
| 4 | No Keycloak on load | Zero Keycloak requests while the page loads |
| 5 | Realm header | `UDAN-Realm` is on every backend and token-service call |
| 6 | No config, no calls | Without realm/clientId/clientSecret the SDK sends nothing |
| 7 | Login | `getsessionkey` 200, `checkauthid` 200, token service `POST /user/token` 201, `checkusersession` 200 |
| 8 | Search | `GET /api/search/all` 200; a text filter finds a saved recording |
| 9 | Record | REC, Start, countdown, two host-page clicks; both steps are listed |
| 10 | Save | `clickednode` 200 for each step, then `recordsequencedata` 200 |
| 11 | List | The saved recording appears in the list |
| 12 | Playback | Steps navigate, `userclick` 204, ends on the recording view |
| 13 | Vote | `GET /api/votes/...` 200 and `POST /api/votes/addVote` 200 |
| 14 | No failures | No failed backend call during the whole run |


## CI and releases

Branch from `dev` and open a PR into `dev`; the PR title must be a [Conventional Commit](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`) because it becomes the squash commit and drives the changelog.

**Build once.** Every CI run builds the extension once and packs it into one zip, the extension's equivalent of an image digest. Testers and later the store get exactly that zip, never a rebuild. Scripts and details: `scripts/ci/README.md`.

- Zip: `udan-extension-<X.Y.Z.N>.zip`, plus `SHA256SUMS` and `build-info.json` (commit, branch, run, SDK version and integrity, names of the env keys that were set). Same commit and run number give the same bytes.
- Version: CI stamps the built manifest with `version = X.Y.Z.<run number>` and `version_name = "X.Y.Z (<short commit>)"`. X.Y.Z comes from `package.json` (Release Please owns it); the run number makes each build unique and higher than the last. The source manifests only hold the base version, for local builds.
- Retention: artifact `client-zip`, 90 days for pushes to `dev`, 14 days for PRs. The run summary shows the version, SHA256 and SDK version.
- Build settings in CI come from GitHub Actions **variables** (`BASE_PROD_URL`, `TOKEN_TEST_URL`, ...: `scripts/ci/generate-env.sh --print-names`), never from secrets. They are set once at the organization level and shared with the SDK repo, which uses the same names.

```mermaid
flowchart LR
    PR["PR into dev<br/>Conventional Commit title"] --> CI{"CI Gate<br/>build and pack, typecheck, gitleaks,<br/>workflow lint, npm audit report-only"}
    CI -- no --> PR
    CI -- "yes: squash merge" --> DEV["dev"]
    CI -. "PR runs: artifact client-zip, kept 14 days" .-> PZIP[("client-zip (PR)")]
    DEV --> BUILD["CI on dev: one build<br/>udan-extension-X.Y.Z.run.zip<br/>SHA256SUMS, build-info.json"]
    BUILD --> ZIP[("artifact client-zip<br/>kept 90 days")]
    ZIP -- "Deploy to TEST: manual, dev only<br/>same zip, no rebuild" --> PRE["Prereleases<br/>test-vX.Y.Z.run and test-current"]
    PRE --> SAN{"Sanity check TEST<br/>Chromium loads the same zip"}
    SAN --> TESTERS["Testers: load unpacked,<br/>badge says TEST"]
    SAN -- "red" --> RB["Rollback: Deploy to TEST<br/>with the previous version"]
    RB --> PRE
    ZIP -. "later: C08 store, C09 SDK CDN" .-> PROD["GitHub release / store"]
    DEV --> REL["PR dev into master, merge commit"]
    REL --> RP["Release Please PR<br/>package.json, CHANGELOG"]
    RP --> TAG["Tag vX.Y.Z and GitHub release"]
    TAG --> BM["Back-merge PR to dev<br/>new X.Y.Z for the next dev builds"]
```
Release Please no longer touches the manifests: CI owns the extension version. Attaching the zip to production releases and the store upload come in later steps; until then the store upload stays manual. `dist/` is no longer committed: it is only the local `build:prod` folder.

**Deploy to TEST.** Testers get builds from GitHub prereleases, never from a rebuild. Run the workflow `Deploy to TEST` on `dev` (Actions tab, or `gh workflow run deploy-test.yml --ref dev`). With no input it takes the newest `dev` build; `-f version=X.Y.Z.N` (from a CI run summary) takes that one, which is also the rollback. It verifies `SHA256SUMS`, the version and that the commit is on `dev`, then publishes prerelease `test-v<version>` and moves `test-current` to it. Neither is ever marked latest. The notes say whether the build talks to the TEST backend and list known issues (`scripts/ci/test-known-issues.md`). The workflow refuses any other branch. A build is deployable while its artifact lives (90 days). After publishing, job `Sanity check TEST` loads that same zip into Chromium (Playwright) and checks that the extension starts, the panel mounts and the TEST backend answers; it is read-only and skips the backend checks for builds that call no backend. A failure turns the run red but does not unpublish; redeploy the previous version to roll back. Details and the laptop command: `scripts/ci/README.md`.

**Roll back TEST.** Run `Deploy to TEST` on `dev` with `version` set to the previous build (for example `1.1.0.11`; the version is in the earlier prerelease's name and in each CI run summary). `test-current` moves back to that build, the sanity job runs again, and testers reinstall from `test-current`. It works while that build's CI artifact is still kept (90 days). In the release notes of a rollback the "changes since" link compares newer to older and reads as empty; ignore it.

**Bumping the SDK.** The Client pins `@udan/digital-assistant-sdk` to an exact version (`package.json` and lockfile). To try a new SDK: PR with the new pin into `dev`, wait for the build, run `Deploy to TEST`, test. Only after that passes does the SDK maintainer move npm `latest` (SDK `RELEASE_PROCESS.md`, "Promotion and rollback"). The SDK version of every build is in `build-info.json` and in the release notes.

**Sanity check.** The `Sanity check TEST` job runs `scripts/ci/smoke-extension.sh` (details in `scripts/ci/README.md`); you can run it on a laptop with the same zip.

`webpack` is pinned to 5.105.4: 5.112.0 fails on the SDK bundle.
