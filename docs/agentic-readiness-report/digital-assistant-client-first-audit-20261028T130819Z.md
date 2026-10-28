# Agentic readiness audit: digital-assistant-client

> [!NOTE]
> This audit reports; it does not gate. A check that could not be settled is UNKNOWN: it earns no credit and is never shown as a pass.

## Provenance

| Field | Value |
|---|---|
| Target | `/home/kc/Projects/UDAN/Digital_Assistant_Client` |
| Commit | `6999a9a954a0` on `dev` — clean working tree |
| Status | final |
| Started | `2026-10-28T12:48:58+00:00` |
| Finalised | `2026-10-28T13:08:19+00:00` |
| Recipe | `brownfield-audit` 0.1.0, catalogue `0.2.2` |
| Engine | `python-agentic-audit` 0.1.0, ruleset `2026-10-19.2`, ruleset hash `970e6792f98eeeb5`, scanned `2026-10-28T12:49:10+00:00` |
| Framework revision | `b4bf27df7915` |
| Agent (self-reported) | `Claude Code` with `claude-sonnet-5-5` |
| Probes | none: no command of the target was run |
| Report schema | `0.1` |

## Readiness summary

- **Phase-1 score: 0.52**, over 57 scored checks
- **8 blockers remaining: 5 FAIL, 1 PARTIAL, 2 UNKNOWN**
- **Unattested:** 5 requirements that no check settles, listed below

5 of the 57 scored checks are UNKNOWN. An UNKNOWN check earns no credit, so the score understates what is true of the repository and does not certify it. No agent finding is waiting for a person's decision.

The score is the weighted share of the scored checks that the repository meets. The weights are BLOCKER 3, DEGRADER 2, COSMETIC 1; PASS earns full credit, PARTIAL half, and FAIL and UNKNOWN none. The framework sets no pass mark, and a score says nothing about whether agents will write correct code.

### Unattested requirements

A person's review or the owner's declaration verifies these requirements, so no check gives them a verdict, and they are outside the score. One leaves this list only when a person records an outcome or the owner declares it.

| Requirement | Method | Property | Why |
|---|---|---|---|
| `REQ-SH-004` | attested | `index-in-use` | Whether the codebase index is actually used during agent work. |
| `REQ-BF-004` | attested | `baseline-adequacy` | Whether the committed baseline or budget is adequate. |
| `REQ-SH-050` | attested | `suite-trustworthiness` | Whether the passing test suite actually catches regressions. |
| `REQ-SH-020` | attested | `doc-accuracy` | Whether the documentation matches the code it describes. |
| `REQ-SH-026` | attested | `gate-honoured` | Whether the gate is actually run and honoured before merge. |

## Checks by verdict and severity

The first table counts every check in the report. The second counts the scored checks only.

| Verdict | Checks | Credit | Meaning |
|---|---:|---:|---|
| PASS | 30 | 1 | The requirement is met. |
| PARTIAL | 9 | 0.5 | Part of the requirement is met. |
| FAIL | 27 | 0 | The requirement is not met. |
| UNKNOWN | 5 | 0 | The evidence could not be gathered. It is never read as a pass. |
| NOT_APPLICABLE | 0 | outside the score | The check does not apply to this repository. |
| **Total** | **71** |  |  |

| Severity | Weight | Meaning | Scored checks | Not met |
|---|---:|---|---:|---:|
| BLOCKER | 3 | Agent work is impossible, unsafe or unverifiable. Fix before onboarding agents. | 16 | 8 |
| DEGRADER | 2 | Agent work is possible but unreliable or wasteful. | 37 | 21 |
| COSMETIC | 1 | Hygiene. Fix when convenient. | 4 | 3 |

## Command surface

The framework's seven verbs, resolved verb by verb on the target's runners — CMD-01's structured payload; CMD-02, AGT-05 and CI-02 read the same surface.

0 verbs of 7 verbs resolve. Missing: `format`, `format:check`, `lint`, `typecheck`, `test`, `check`, `security`.

| Verb | Resolved | Runner | Command |
|---|:---:|---|---|
| `format` | **no** | — | — |
| `format:check` | **no** | — | — |
| `lint` | **no** | — | — |
| `typecheck` | **no** | — | — |
| `test` | **no** | — | — |
| `check` | **no** | — | — |
| `security` | **no** | — | — |

## Credential-shaped lines

0 credential-shaped lines across 0 files in tracked text files. The file-by-file detail is in the attention tables above; the report never records the value itself.

## Missing secret-shape ignore rules

The secret shapes SEC-01 and SEC-03 check for, and whether the repository's ignore rules cover each one. The suggested entry is paste-ready into `.gitignore` for a shape that is missing.

| Shape | Status | Suggested `.gitignore` entry |
|---|:---:|---|
| dotenv | **missing** | `.env` |
| dotenv variant | **missing** | `.env.*` |
| ssh private key | **missing** | `id_rsa*` |
| PEM | **missing** | `*.pem` |
| key | **missing** | `*.key` |
| PKCS#12 | **missing** | `*.p12` |
| PFX | **missing** | `*.pfx` |
| keystore | **missing** | `*.keystore` |
| certificate (.crt) | **missing** | `*.crt` |
| certificate (.cer) | **missing** | `*.cer` |
| AWS credentials | **missing** | `.aws/*` |

## Checks that need attention

Each row is a finding, or a check that has none. A check is listed when it is not met, was overridden, was judged by the agent, or raised a finding. Evidence is grouped by who captured it, and a quote or command output is under Evidence in full. The decision on a finding is one of these:

- **interactive**: Decided by the person, on this finding alone.
- **batch**: Decided by the person, as one of a group of findings that are not blockers.
- **policy**: Set by the confirmation policy, not by a person.

### Blocker checks

8 of the 16 scored BLOCKER checks are not met.

| Check | Verdict | What we found | Evidence | Fix | Decision |
|---|---|---|---|---|---|
| `CMD-01` Seven verbs resolvable on one runner<br>finding `F-001` | **FAIL** | An agent cannot run the standardized command surface literally because 7 of 7 framework verbs are not defined on any runner (format, format:check, lint, typecheck, test, check, security). | **tool** `package.json` | Define every verb (format, format:check, lint, typecheck, test, check, security) as a script/target so an agent never has to invent a command. | **Confirmed** (interactive)<br>Note: Owner decision (Stage 4) |
| `CMD-02` check composes the read-only verbs<br>finding `F-002` | **FAIL** | An agent cannot run one gate that composes the read-only verbs because no runner defines a check verb. | We did not find any evidence. | Define check as format-check, then typecheck, then test. | **Confirmed** (interactive)<br>Note: Owner decision (Stage 4) |
| `CI-02` Local↔CI parity | **UNKNOWN** | no local verb resolves on any runner, so CI cannot be compared to it | We did not find any evidence. | — | — |
| `CON-02` Test directories protected | **UNKNOWN** | no test directories detected, so there is nothing for a deny list to protect | We did not find any evidence. | — | — |
| `EXEC-01` Toolchain pinned / wrapper committed<br>finding `F-003` | **FAIL** | An agent cannot reproduce the node toolchain because the detected node project pins no toolchain version. | We did not find any evidence. | Commit the pin appropriate to node — .nvmrc, .node-version — so the agent's runtime is the repository's, not the host's. | **Confirmed** (interactive)<br>Note: Owner decision (Stage 4) |
| `EXEC-03` Non-interactive setup path<br>finding `F-004` | **PASS**<br>engine: FAIL | An agent cannot prepare the environment non-interactively because no devcontainer, compose file, Dockerfile, setup target/script, or documented install command exists.<br>**Overridden.** The engine's verdict was FAIL. Reason: README.md lines 9-18 document 'npm install' in a fenced block and AGENTS.md line 11 documents 'npm ci'; the engine only reads fences tagged bash/sh/shell/console and this block is untagged. | **agent** `README.md:9-18` (untagged fenced block starting 'npm install' then npm run build)<br>`AGENTS.md:10-11` ('npm ci (or npm install), then npm run build:prod') | Add a committed setup path (a devcontainer, compose file, or a documented install command in README.md) that runs with no prompts. | **Rejected** (interactive)<br>Note: Owner decision (Stage 4) |
| `EXEC-04` Env-var inventory complete<br>finding `F-005` | **FAIL** | An agent cannot know every variable the code needs before running it because 2 referenced key(s) are absent from any committed example file: EXPECTED_VERSION, UDAN_ENV_FILE. | We did not find any evidence. | Add the missing keys to .env.example (values redacted) so the environment can be provisioned without reading the source. | **Deferred** (interactive)<br>Note: Owner decision (Stage 4) |
| `TST-01` Test verb exists, suite non-empty<br>finding `F-007` | **FAIL** | An agent cannot run the test suite because no test verb resolves and no test file exists. | **tool** `.gitattributes` | Add a test verb and at least one test file so a change set can be verified. | **Confirmed** (interactive)<br>Note: Owner decision (Stage 4) |
| `SEC-01` .env untracked and ignored<br>finding `F-006` | **PARTIAL** | An agent cannot trust that a future .env stays out of history because no ignore rule covers dotenv, dotenv variant. | **tool** `.gitignore` (node_modules)<br>`.gitignore` (build)<br>`.gitignore` (dist)<br>`.gitignore` (out)<br>`.gitignore` (coverage)<br>`.gitignore` (environments/\*)<br>`.gitignore` (.DS_Store)<br>`.gitignore` (.vscode) | Add the .env shape (for example \`.env\` and \`.env.\*\`) to .gitignore so an environment file cannot be committed by accident. | **Confirmed** (interactive)<br>Note: Owner decision (Stage 4) |

### Degrader checks

21 of the 37 scored DEGRADER checks are not met.

| Check | Verdict | What we found | Evidence | Fix | Decision |
|---|---|---|---|---|---|
| `IDX-03` Index freshness | **PASS**<br>engine: UNKNOWN | Index of this checkout was built at 2026-10-28T09:22:07Z, after HEAD's commit time (2026-10-28T08:08:12Z) and the working tree is clean, so the graph reflects HEAD. detect_changes errored (see note), so this is an inferred, not tool-confirmed, no-drift result.<br>**Overridden.** The engine's verdict was UNKNOWN. Reason: Tier C was off, so the engine could not judge; the index tool's own status gives a freshness signal: indexed after HEAD's commit, on a clean tree. | **agent** `index_status project=home-kc-Projects-UDAN-Digital_Assistant_Client` through `codebase-memory-mcp` (status ready, 2117 nodes, indexed_at 2026-10-28T09:22:07Z, root_path equals the target)<br>`detect_changes project=home-kc-Projects-UDAN-Digital_Assistant_Client` through `codebase-memory-mcp` (error: 'git revision resolution failed: base_branch or HEAD is not a commit'; no freshness answer from this call) | — | — |
| `AGT-03` Documentation contract named<br>finding `F-008` | **FAIL** | An agent cannot know where permanent and scratch documentation live because AGENTS.md does not name docs/, docs/STYLE_GUIDE.md, artefacts/. | We did not find any evidence. | Name docs/ as the canonical home for permanent knowledge, docs/STYLE_GUIDE.md as the authoring rules, and artefacts/ as off-limits scratch. | **Confirmed** (batch) |
| `AGT-04` Definition of done stated<br>finding `F-009` | **FAIL** | An agent cannot keep code and its documentation in step because no definition-of-done sentence ties a documentation trigger to the same change set. | We did not find any evidence. | State that a change altering a public interface, observable behaviour, architecture, a check's semantics or an ADR updates the affected docs and the ADR index in the same change set. | **Confirmed** (batch) |
| `AGT-05` Seven verbs named<br>finding `F-010` | **FAIL** | An agent cannot use the project's own commands instead of inventing them because not named: format, format:check, test, security; not resolved: format, format:check, lint, typecheck, test, check, security. | We did not find any evidence. | List all seven verbs in AGENTS.md and define each on one runner so the instruction and the manifest agree. | **Confirmed** (batch) |
| `AGT-07` Do-not-do / deny rules present<br>finding `F-011` | **PARTIAL** | An agent cannot rely on an explicit do-not list because AGENTS.md does not prohibit edits to generated files. | **tool** `AGENTS.md:6` (tests)<br>`AGENTS.md:6` (secrets)<br>`AGENTS.md:26` (the default branch) | Add an explicit prohibition for each of: tests, generated files, the default branch and secrets. | **Confirmed** (batch) |
| `AGT-08` No competing instruction files, and the reach matrix is stated<br>finding `F-012` | **PARTIAL**<br>engine: FAIL | An agent cannot be sure that both files are read because CLAUDE.md shadows AGENTS.md for the harness that defines the pair, so only one of the two is ever loaded.<br>**Overridden.** The engine's verdict was FAIL. Reason: Rubric FAIL needs a vendor-only file carrying independent rules; CLAUDE.md is a one-line '@AGENTS.md' import with no rules of its own, so only the reach gap remains (PARTIAL). | **tool** `CLAUDE.md`<br>`AGENTS.md`<br>**agent** `CLAUDE.md:1` (whole file; pointer, no independent rules; quote in Evidence in full)<br>`AGENTS.md:1-3` (canonical file; line 3 states CLAUDE.md is a one-line import) | Reconcile the two files, or delete the shadowed one — a file nobody reads still gets edited. | **Rejected** (batch) |
| `AGT-08` No competing instruction files, and the reach matrix is stated<br>finding `F-013` | **PARTIAL**<br>engine: FAIL | An agent cannot know which instruction file is authoritative because 1 vendor-specific instruction files exist alongside the canonical one (CLAUDE.md). | **tool** `CLAUDE.md` | Keep AGENTS.md canonical; reduce each vendor file to a pointer at it, or delete it if the harness reads AGENTS.md natively. | **Rejected** (batch) |
| `AGT-08` No competing instruction files, and the reach matrix is stated<br>finding `F-027`, severity COSMETIC | **PARTIAL**<br>engine: FAIL | An agent cannot assume every harness on the team sees the project rules because 20 of 27 known harnesses reach an instruction file; Aider, Amazon Q Developer, Continue, Google Gemini CLI, Qwen Code, Replit Agent, Void reach nothing. | **tool** `CLAUDE.md`<br>`AGENTS.md`<br>`CLAUDE.md`<br>**agent** `CLAUDE.md:1` (whole file; pointer, no independent rules; quote in Evidence in full)<br>`AGENTS.md:1-3` (canonical file; line 3 states CLAUDE.md is a one-line import) | Either state the supported harnesses in AGENTS.md, or add the vendor pointer files for the harnesses in use. | **Confirmed** (batch) |
| `DOC-01` docs/ exists<br>finding `F-018` | **FAIL** | An agent cannot find the project's documentation because no docs/ directory exists in the repository. | We did not find any evidence. | Create docs/ as the canonical home for permanent knowledge, with docs/STYLE_GUIDE.md holding the authoring rules. | **Confirmed** (batch) |
| `DOC-02` docs/STYLE_GUIDE.md exists<br>finding `F-019` | **FAIL** | An agent cannot find the canonical authoring rules for documentation because docs/STYLE_GUIDE.md does not exist. | We did not find any evidence. | Create docs/STYLE_GUIDE.md and name it from the instruction file so writers have one set of authoring rules. | **Confirmed** (batch) |
| `TOOL-01` Formatter configured<br>finding `F-022` | **FAIL** | An agent cannot format a change set the same way every time because no formatter is configured and no format verb is defined. | **tool** `package.json` | Add a formatter config and a format write verb (prettier, black, ruff format, …). | **Confirmed** (batch) |
| `TOOL-02` Linter configured<br>finding `F-023` | **FAIL** | An agent cannot catch lint regressions before they land because no linter is configured and no lint verb is defined. | **tool** `package.json` | Add a linter config and a lint read-only verb (eslint, ruff, flake8, golangci-lint, …). | **Confirmed** (batch) |
| `TOOL-03` Type checker configured<br>finding `F-024` | **PARTIAL** | An agent cannot trust the type checker to catch a whole class of defects because a type-check configuration exists but is not strict (tsconfig.json:strict). | **tool** `tsconfig.json` (strict) | Turn on strict mode (tsconfig \`strict: true\`, mypy \`strict = true\`, pyright \`typeCheckingMode: "strict"\`) so the checker's findings are trustworthy. | **Confirmed** (batch) |
| `TOOL-04` Dependency / security scan verb<br>finding `F-025` | **FAIL** | An agent cannot know whether a dependency carries a known vulnerability because no resolvable verb runs a dependency-audit check. | **tool** `package.json` | Add a dependency-audit verb (npm audit, pip-audit, osv-scanner, cargo audit, govulncheck, snyk). | **Confirmed** (batch) |
| `TOOL-05` Local hook chain active<br>finding `F-026` | **FAIL** | An agent cannot rely on local hooks to run before a commit because no hook manager is configured. | **tool** `package.json` | Adopt a hook manager (pre-commit, lefthook, husky) and wire it so checks run before a commit rather than only in CI. | **Confirmed** (batch) |
| `BASE-01` Baseline artifact exists<br>finding `F-014` | **PARTIAL** | An agent cannot diff today's findings against an accepted baseline because quality tooling is configured but no baseline or suppression artifact is committed. | **tool** `.gitleaks.toml` | Commit a baseline or suppression artifact (for example \`baseline.json\`, an eslint/ruff baseline, or \`.gitleaksignore\`), or document the equivalent mechanism in \`AGENTS.md\`. | **Confirmed** (batch) |
| `BASE-02` Current violation counts measured<br>finding `F-015` | **PARTIAL** | An agent cannot state how many violations exist today because a counting surface exists but no numeric violation budget or count is committed. | **tool** `.gitleaks.toml` | Commit the count or configure a budget (\`--max-warnings N\`, \`max-issues\`, or a \`violation budget\`) so a regression has a baseline number to compare against. | **Confirmed** (batch) |
| `BASE-03` No-new-violations mechanism<br>finding `F-016` | **PARTIAL** | An agent cannot stop the violation count from growing because no baseline, budget or comparison step exists, so the count is not guarded. | — | Once a baseline exists, wire a comparison step (the audit's own \`--baseline REPORT.JSON\` is the reference pattern) so new findings fail the build. | **Confirmed** (batch) |
| `BASE-04` Coverage floor configured<br>finding `F-017` | **FAIL** | An agent cannot know when coverage drops below an agreed floor because no coverage threshold is configured in the test runner. | We did not find any evidence. | Configure a coverage floor for the test runner so a drop fails the gate. | **Confirmed** (batch) |
| `TST-02` Suite status known | **UNKNOWN** | no test verb resolves on any runner, so the suite cannot be run | We did not find any evidence. | — | — |
| `TST-03` Skip / xfail census | **UNKNOWN** | no test file is present, so there is no skip/xfail census to take | We did not find any evidence. | — | — |
| `TST-04` Fast path documented | **UNKNOWN** | no test file is present, so there is no suite for a fast path to act on (see TST-01) | We did not find any evidence. | — | — |
| `NAV-02` Obvious entry points<br>finding `F-020` | **PASS**<br>engine: FAIL | An agent cannot find where execution begins because the node project declares no entry point (main, bin, \_\_main\_\_, Application or func main).<br>**Overridden.** The engine's verdict was FAIL. Reason: Entry points exist but sit outside the engine's fixed node signal set (package.json main/bin/exports plus root index/server/main/app files). | **agent** `webpack.config.js:43-51` (entry map: UDASdk ./src/main.tsx, UDABackground ./src/Background.ts, Options, content scripts)<br>`public/manifest.json:28` (background.service_worker ./assets/UDABackground.js) | Declare the entry point in the manifest (package.json main/bin, pyproject scripts, a Gradle main class) or name the executable file so an agent can tell live code from dead code. | **Rejected** (batch) |
| `SEC-03` Ignore patterns cover secret shapes<br>finding `F-021` | **FAIL** | An agent cannot trust that secret shapes cannot be committed because ignore rules do not cover dotenv, dotenv variant, ssh private key, PEM, key, PKCS#12, PFX, keystore, certificate (.crt), certificate (.cer), AWS credentials. | **tool** `.gitignore` (node_modules)<br>`.gitignore` (build)<br>`.gitignore` (dist)<br>`.gitignore` (out)<br>`.gitignore` (coverage)<br>`.gitignore` (environments/\*)<br>`.gitignore` (.DS_Store)<br>`.gitignore` (.vscode) | Add the missing shapes to .gitignore — for example \`.env.\*\`, \`\*.pem\`, \`\*.key\`, \`\*.p12\`, \`\*.pfx\`, \`\*.keystore\`, \`id_rsa\*\`, \`\*.crt\`, \`\*.cer\`, \`.aws/\*\`. | **Confirmed** (batch) |
| `AGT-11` Instructions are specific and not inferable<br>agent, confidence high | **PASS** | AGENTS.md (38 lines, no overview section beyond one sentence) is almost entirely specific, non-inferable rules; sampled lines resolve against the repo. | **agent** `AGENTS.md:8` (specific: secret-key list; confirmed scripts/ci/check-env-keys.sh exists and README scripts/ci/README.md describes the same check)<br>`AGENTS.md:11-13` (specific: build commands; confirmed package.json scripts build:prod/build and tsc in ci.yml typecheck job; scripts/ci/ exists)<br>`AGENTS.md:16` (specific: webpack pinned 5.105.4; confirmed package.json devDependencies webpack 5.105.4 and dependabot.yml ignore rule)<br>`AGENTS.md:17` (specific: drop_console/isProd in webpack.config.js; confirmed webpack.config.js:27 isProd; .gitattributes has '\* text=auto eol=lf')<br>`AGENTS.md:20` (specific: env.example has 12 public keys; confirmed 12 non-comment lines in environments/env.example)<br>`AGENTS.md:21-22` (specific: names src/config/runtimeEnvironment.ts and buildConfig.ts (both exist) and README sections 'TEST or PROD at runtime' and 'Sign-in and where the config lives' (both exist))<br>`AGENTS.md:26-28` (specific: branch/merge model; confirmed pr-title.yml enforces the conventional-title pattern and release-please-config.json exists)<br>`AGENTS.md:37` (specific: Protect dev ruleset and CI Gate; confirmed ci.yml job ci-gate (name CI Gate). The ruleset itself is platform state, not verifiable in the repo)<br>**searches** `grep` for `generic rule line (inferable maxim)` in `AGENTS.md`: no hits | — | — |
| `CI-04` CI enforces the same gate as the local check<br>finding `F-040` · agent, confidence medium | **PARTIAL** | An agent cannot rely on a green CI Gate to mean dependencies are clean because the npm audit job runs with continue-on-error: true, so high-severity findings (11 at the time of the comment) never fail the pipeline. | **agent** `.github/workflows/ci.yml:126-143` (comment 'Report-only until the owner decides; remove continue-on-error to make it block'; step 'npm audit --omit=dev --audit-level=high' with continue-on-error: true) | Decide whether the audit gates: fix or accept the high findings, then drop continue-on-error (or record the report-only decision in AGENTS.md as a deliberate exception).<br>Effort S | **Confirmed** (batch) |

### Cosmetic checks

3 of the 4 scored COSMETIC checks are not met.

| Check | Verdict | What we found | Evidence | Fix | Decision |
|---|---|---|---|---|---|
| `DOC-04` ADR directory and index<br>finding `F-028` | **FAIL** | An agent cannot find the decisions of record because no ADR directory (docs/architecture/adrs/ or docs/adr/) exists. | We did not find any evidence. | Add docs/architecture/adrs/ with NNNN-short-title.md files and a README index that lists them. | **Confirmed** (batch) |
| `TOOL-06` Commit convention enforced<br>finding `F-038` | **FAIL** | An agent cannot rely on a consistent commit-message convention because no commitlint config, commit-msg hook, or equivalent exists. | **tool** `package.json` | Add a commitlint config or a commit-msg hook so commit messages follow one convention. | **Confirmed** (batch) |
| `TST-05` Coverage configuration present<br>finding `F-039` | **FAIL** | An agent cannot see how much of the code the suite actually covers because no coverage configuration or coverage-invoking command is present. | We did not find any evidence. | Configure coverage for the test runner (a \`coverage\` block, \`.coveragerc\`/\`.nycrc\`, \`--coverage\`/\`--cov\`, or \`go test -cover\`). | **Confirmed** (batch) |
| `NAV-03` Structural red flags<br>finding `F-037` | **PASS**<br>engine: PARTIAL | An agent cannot work in a codebase without obvious structural traps because 0 oversized file(s), 0 catch-all director(y/ies), 10 checked-in binary file(s) and 0 minified asset(s).<br>**Overridden.** The engine's verdict was PARTIAL. Reason: Icons required by the browser extension manifest are not a structural trap; owner rejected F-037. | **tool** `public/android-chrome-192x192.png`<br>`public/android-chrome-512x512.png`<br>`public/apple-touch-icon.png`<br>`public/favicon-16x16.png`<br>`public/favicon-32x32.png`<br>`public/favicon.ico`<br>`public/logos/nist-logo-128x128.png`<br>`public/logos/nist-logo-16x16.png`<br>and 2 more, in the JSON report<br>**agent** `public/manifest.json` | Split oversized files, break up catch-all directories, and keep binaries and minified assets out of the tree (generate them in the build). | **Rejected** (batch) |
| `NAV-05` Public-symbol documentation coverage | **PARTIAL**<br>not scored | 19/96 public symbols documented (20%); method: typescript: exported declarations | — | — | — |
| `HYG-02` CODEOWNERS present<br>finding `F-029` | **FAIL**<br>not scored | An agent cannot know who owns a path before changing it because no CODEOWNERS file exists at the root, under .github/, or under docs/. | We did not find any evidence. | Add .github/CODEOWNERS mapping paths to owners so review routing is machine-readable. | **Confirmed** (batch) |
| `HYG-03` Pull-request template present<br>finding `F-030` | **FAIL**<br>not scored | An agent cannot file a change with the information reviewers need because no .github/pull_request_template file exists. | We did not find any evidence. | Add .github/pull_request_template.md describing what a good change records. | **Confirmed** (batch) |
| `HYG-04` Issue templates present<br>finding `F-031` | **FAIL**<br>not scored | An agent cannot report a bug or request in a structured way because no .github/ISSUE_TEMPLATE entry exists. | We did not find any evidence. | Add at least one file under .github/ISSUE_TEMPLATE/ (a bug report and a feature request are a good start). | **Confirmed** (batch) |
| `HYG-05` CONTRIBUTING present<br>finding `F-032` | **FAIL**<br>not scored | An agent cannot contribute without reverse-engineering the process because no CONTRIBUTING document exists. | We did not find any evidence. | Add CONTRIBUTING.md covering setup, the gate, and the review flow. | **Confirmed** (batch) |
| `HYG-06` SECURITY present<br>finding `F-033` | **FAIL**<br>not scored | An agent cannot report a vulnerability responsibly because no SECURITY document exists at the root, under .github/, or under docs/. | We did not find any evidence. | Add SECURITY.md with a private disclosure channel and a response expectation. | **Confirmed** (batch) |
| `HYG-07` CHANGELOG present and recent<br>finding `F-034` | **FAIL**<br>not scored | An agent cannot see what changed between two versions because no CHANGELOG (or CHANGES/HISTORY) document exists. | We did not find any evidence. | Add CHANGELOG.md and record notable changes under a version heading. | **Confirmed** (batch) |
| `HYG-08` Release process documented<br>finding `F-035` | **FAIL**<br>not scored | An agent cannot know how a release is cut because no text or markdown document describing the release process exists. | We did not find any evidence. | Add docs/releasing.md (or RELEASE.md) describing how a version is cut and published. | **Confirmed** (batch) |
| `HYG-11` Branch protection declared as code<br>finding `F-036` | **FAIL**<br>not scored | An agent cannot reproduce the protected-branch rules as code because the github provider is detected but no branch-protection configuration exists. | We did not find any evidence. | Declare branch protection in code (a Terraform resource or .github/branch-protection) so it is reviewed like any other change. | **Confirmed** (batch) |

## Overrides of the engine's verdicts

Where this report's verdict differs from the engine's, the row of the check above shows both, and the agent's counter-evidence is in its Evidence column or under Evidence in full.

| Check | Engine's verdict | This report's verdict | Reason |
|---|---|---|---|
| `IDX-03` | UNKNOWN | PASS | Tier C was off, so the engine could not judge; the index tool's own status gives a freshness signal: indexed after HEAD's commit, on a clean tree. |
| `AGT-08` | FAIL | PARTIAL | Rubric FAIL needs a vendor-only file carrying independent rules; CLAUDE.md is a one-line '@AGENTS.md' import with no rules of its own, so only the reach gap remains (PARTIAL). |
| `EXEC-03` | FAIL | PASS | README.md lines 9-18 document 'npm install' in a fenced block and AGENTS.md line 11 documents 'npm ci'; the engine only reads fences tagged bash/sh/shell/console and this block is untagged. |
| `NAV-02` | FAIL | PASS | Entry points exist but sit outside the engine's fixed node signal set (package.json main/bin/exports plus root index/server/main/app files). |
| `NAV-03` | PARTIAL | PASS | Icons required by the browser extension manifest are not a structural trap; owner rejected F-037. |

## Evidence in full

Quotes and command output that the tables above point to, each under the check that cites it.

### AGT-08: No competing instruction files, and the reach matrix is stated

- `CLAUDE.md:1` — whole file; pointer, no independent rules · captured by agent
  ```text
  @AGENTS.md
  ```

## Coverage

**Examined:** nothing is recorded

No scope was skipped.

**Files:** 205 files inspected, 7 skipped; the scan was not cut short.

## Stack and components

| Stack | Detected |
|---|---|
| Ecosystems | `node` |
| Package managers | `npm` |
| CI providers | `github` |
| Test frameworks | — |
| Hook managers | — |

| Component | Path | Declared | Declared by | Manifest | AGENTS.md |
|---|---|---|---|---|---|
| (root) | `.` | yes | implicit | `package.json` | present |

## Run context

| Field | Value |
|---|---|
| Evaluation mode | no |
| Confirmation policy | `interactive` |
| Provider exposure acknowledged | yes: the model provider receives what the agent reads from the target |
| Code index | `mcp` `codebase-memory-mcp` — project home-kc-Projects-UDAN-\<repo>; may be absent |
| Excluded | `node_modules`, `build`, `dist`, `.git` |
| Known components | none |
| Stack profile | — |

## Appendix — all checks

All 71 checks, grouped by family. The command surface, the credential-shaped-lines total and the missing secret-shape ignore rules above are rendered from the engine's structured payloads; other payloads (env-key inventories, harness-reach matrices, and so on) are in the JSON report only, for now.

### IDX

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `IDX-01` | codebase-memory-mcp registered for this repository | BLOCKER | automated | yes | PASS | PASS | codebase-memory-mcp registered in: /home/kc/.config/opencode/opencode.jsonc (user) |
| `IDX-02` | An index exists for this checkout | BLOCKER | automated | yes | PASS | PASS | index store /home/kc/.cache/codebase-memory-mcp contains a project rooted at /home/kc/Projects/UDAN/Digital_Assistant_Client |
| `IDX-03` | Index freshness | DEGRADER | automated | yes | PASS | UNKNOWN | Index of this checkout was built at 2026-10-28T09:22:07Z, after HEAD's commit time (2026-10-28T08:08:12Z) and the working tree is clean, so the graph reflects HEAD. detect_changes errored (see note), so this is an inferred, not tool-confirmed, no-drift result. |

### AGT

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `AGT-01` | Instruction file present, canonical, and non-trivial | BLOCKER | automated | yes | PASS | PASS | — |
| `AGT-02` | Component coverage by instruction files | DEGRADER | automated | yes | PASS | PASS | single-root repository: no component-level instruction files required |
| `AGT-03` | Documentation contract named | DEGRADER | automated | yes | FAIL | FAIL | does not name docs/, docs/STYLE_GUIDE.md, artefacts/ |
| `AGT-04` | Definition of done stated | DEGRADER | automated | yes | FAIL | FAIL | no definition-of-done sentence ties a documentation trigger to the same change set |
| `AGT-05` | Seven verbs named | DEGRADER | automated | yes | FAIL | FAIL | not named: format, format:check, test, security; not resolved: format, format:check, lint, typecheck, test, check, security |
| `AGT-06` | Architectural boundaries declared | DEGRADER | automated | yes | PASS | PASS | 4 boundary rules reference real paths |
| `AGT-07` | Do-not-do / deny rules present | DEGRADER | automated | yes | PARTIAL | PARTIAL | not covered: generated files |
| `AGT-08` | No competing instruction files, and the reach matrix is stated | DEGRADER | automated | yes | PARTIAL | FAIL | CLAUDE.md is a pointer (single line '@AGENTS.md', 11 bytes), not a competing rule set; Claude Code expands the import, so AGENTS.md is loaded. Remaining gap: 7 of 27 known harnesses reach no instruction file. |
| `AGT-09` | Branch and release boundary declared | DEGRADER | automated | yes | PASS | PASS | the branch model and the release boundary are stated |
| `AGT-10` | Instruction indirection resolved | DEGRADER | automated | yes | PASS | PASS | — |
| `AGT-11` | Instructions are specific and not inferable | DEGRADER | agent | yes | PASS | — | AGENTS.md (38 lines, no overview section beyond one sentence) is almost entirely specific, non-inferable rules; sampled lines resolve against the repo. |

### DOC

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `DOC-01` | docs/ exists | DEGRADER | automated | yes | FAIL | FAIL | no docs/ directory |
| `DOC-02` | docs/STYLE_GUIDE.md exists | DEGRADER | automated | yes | FAIL | FAIL | docs/STYLE_GUIDE.md is not present |
| `DOC-03` | artefacts/ exists and is ignored | DEGRADER | automated | yes | PASS | PASS | no scratch directory in use |
| `DOC-04` | ADR directory and index | COSMETIC | automated | yes | FAIL | FAIL | no ADR directory |

### CMD

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `CMD-01` | Seven verbs resolvable on one runner | BLOCKER | automated | yes | FAIL | FAIL | format -> missing; format:check -> missing; lint -> missing; typecheck -> missing; test -> missing; check -> missing; security -> missing |
| `CMD-02` | check composes the read-only verbs | BLOCKER | automated | yes | FAIL | FAIL | the check verb is not defined on any runner |
| `CMD-03` | No divergent second definition | DEGRADER | automated | yes | PASS | PASS | no runner defines check, so there is nothing to diverge |
| `CMD-04` | Write verbs separated from read-only verbs | DEGRADER | automated | yes | PASS | PASS | no read-only verb invokes a write verb |

### TOOL

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `TOOL-01` | Formatter configured | DEGRADER | automated | yes | FAIL | FAIL | no formatter config and no format verb |
| `TOOL-02` | Linter configured | DEGRADER | automated | yes | FAIL | FAIL | no linter config and no lint verb |
| `TOOL-03` | Type checker configured | DEGRADER | automated | yes | PARTIAL | PARTIAL | type checker configured but not strict: tsconfig.json:strict |
| `TOOL-04` | Dependency / security scan verb | DEGRADER | automated | yes | FAIL | FAIL | no verb runs a dependency audit |
| `TOOL-05` | Local hook chain active | DEGRADER | automated | yes | FAIL | FAIL | no hook chain configured |
| `TOOL-06` | Commit convention enforced | COSMETIC | automated | yes | FAIL | FAIL | no commit-message rule |

### CI

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `CI-01` | Pipeline present, triggered on PRs | BLOCKER | automated | yes | PASS | PASS | PR-triggered: .github/workflows/ci.yml (github); .github/workflows/pr-title.yml (github) |
| `CI-02` | Local↔CI parity | BLOCKER | automated | yes | UNKNOWN | UNKNOWN | no local verb resolves on any runner, so CI cannot be compared to it |
| `CI-03` | CI-only steps flagged | DEGRADER | automated | yes | PASS | PASS | no CI-only steps |
| `CI-04` | CI enforces the same gate as the local check | DEGRADER | agent | yes | PARTIAL | — | build, typecheck, gitleaks and workflow-lint gate the job and feed the 'CI Gate' aggregate; the dependency audit is deliberately non-gating (continue-on-error) and the required-status-check wiring is stated only in AGENTS.md, not confirmable from the repo. |

### BASE

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `BASE-01` | Baseline artifact exists | DEGRADER | automated | yes | PARTIAL | PARTIAL | quality tooling is configured but no baseline artifact is committed: .gitleaks.toml |
| `BASE-02` | Current violation counts measured | DEGRADER | automated | yes | PARTIAL | PARTIAL | counting surface present but no committed count/budget: .gitleaks.toml; method: static configuration scan; the target's own tools are never run |
| `BASE-03` | No-new-violations mechanism | DEGRADER | automated | yes | PARTIAL | PARTIAL | no ratchet and no baseline yet, so there is nothing to compare against |
| `BASE-04` | Coverage floor configured | DEGRADER | automated | yes | FAIL | FAIL | no coverage threshold configured |

### CON

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `CON-01` | Allow/deny artifact present | BLOCKER | automated | yes | PASS | PASS | the prohibitions section of AGENTS.md names paths that exist: scripts/ci/check-env-keys.sh, package.json |
| `CON-02` | Test directories protected | BLOCKER | automated | yes | UNKNOWN | UNKNOWN | no test directories detected, so there is nothing for a deny list to protect |
| `CON-03` | artefacts/ excluded from index and agent reads | DEGRADER | automated | yes | PASS | PASS | no scratch or agent-state directory in use |
| `CON-04` | Draft allow/deny emitted | COSMETIC | automated | no | PASS | PASS | draft deny list written: do-not-do.draft.md |

### EXEC

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `EXEC-01` | Toolchain pinned / wrapper committed | BLOCKER | automated | yes | FAIL | FAIL | unpinned: node |
| `EXEC-02` | Lockfile committed and consistent | BLOCKER | automated | yes | PASS | PASS | tracked: package-lock.json |
| `EXEC-03` | Non-interactive setup path | BLOCKER | automated | yes | PASS | FAIL | A documented non-interactive install path exists (npm ci / npm install), missed by the engine because the fence has no language tag. |
| `EXEC-04` | Env-var inventory complete | BLOCKER | automated | yes | FAIL | FAIL | 2 referenced key(s) are absent from any committed example file: EXPECTED_VERSION, UDAN_ENV_FILE |
| `EXEC-05` | No generated artifacts committed in-tree | DEGRADER | automated | yes | PASS | PASS | no tracked generated or vendored paths |
| `EXEC-06` | Documented commands resolve | DEGRADER | automated | yes | PASS | PASS | no fenced shell commands documented |
| `EXEC-07` | No competing configs for one concern | DEGRADER | automated | yes | PASS | PASS | security: .gitleaks.toml; types: tsconfig.json |

### TST

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `TST-01` | Test verb exists, suite non-empty | BLOCKER | automated | yes | FAIL | FAIL | no test verb and no test file |
| `TST-02` | Suite status known | DEGRADER | automated | yes | UNKNOWN | UNKNOWN | no test verb resolves on any runner, so the suite cannot be run |
| `TST-03` | Skip / xfail census | DEGRADER | automated | yes | UNKNOWN | UNKNOWN | no test file is present, so there is no skip/xfail census to take |
| `TST-04` | Fast path documented | DEGRADER | automated | yes | UNKNOWN | UNKNOWN | no test file is present, so there is no suite for a fast path to act on (see TST-01) |
| `TST-05` | Coverage configuration present | COSMETIC | automated | yes | FAIL | FAIL | no coverage configuration |

### NAV

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `NAV-01` | Declared component boundaries | DEGRADER | automated | yes | PASS | PASS | single-root repository declares package.json |
| `NAV-02` | Obvious entry points | DEGRADER | automated | yes | PASS | FAIL | Execution begins at the seven webpack entries and the manifest's service worker; src/main.tsx (panel) and src/Background.ts (worker) are the principal ones. |
| `NAV-03` | Structural red flags | COSMETIC | automated | yes | PASS | PARTIAL | The 10 checked-in binaries are extension icons; no oversized files or catch-all directories. |
| `NAV-04` | Architecture orientation artifact | COSMETIC | automated | no | PASS | PASS | 11 diagram(s) |
| `NAV-05` | Public-symbol documentation coverage | COSMETIC | automated | no | PARTIAL | PARTIAL | 19/96 public symbols documented (20%); method: typescript: exported declarations |

### SEC

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `SEC-01` | .env untracked and ignored | BLOCKER | automated | yes | PARTIAL | PARTIAL | no tracked .env, but ignore rules miss dotenv, dotenv variant |
| `SEC-02` | No key-shaped strings in tracked files | BLOCKER | automated | yes | PASS | PASS | no credential-shaped strings in tracked text files |
| `SEC-03` | Ignore patterns cover secret shapes | DEGRADER | automated | yes | FAIL | FAIL | no secret shapes covered; missing: dotenv, dotenv variant, ssh private key, PEM, key, PKCS#12, PFX, keystore, certificate (.crt), certificate (.cer), AWS credentials |

### HYG

| Check | Title | Severity | Method | Scored | Verdict | Engine | Summary |
|---|---|---|---|---|---|---|---|
| `HYG-01` | README present and non-placeholder | COSMETIC | automated | no | PASS | PASS | README.md present and non-placeholder |
| `HYG-02` | CODEOWNERS present | COSMETIC | automated | no | FAIL | FAIL | no CODEOWNERS file |
| `HYG-03` | Pull-request template present | COSMETIC | automated | no | FAIL | FAIL | no pull-request template |
| `HYG-04` | Issue templates present | COSMETIC | automated | no | FAIL | FAIL | no issue templates |
| `HYG-05` | CONTRIBUTING present | COSMETIC | automated | no | FAIL | FAIL | no CONTRIBUTING document |
| `HYG-06` | SECURITY present | COSMETIC | automated | no | FAIL | FAIL | no SECURITY document |
| `HYG-07` | CHANGELOG present and recent | COSMETIC | automated | no | FAIL | FAIL | no CHANGELOG document |
| `HYG-08` | Release process documented | COSMETIC | automated | no | FAIL | FAIL | no release document |
| `HYG-09` | Dependency update automation configured | COSMETIC | automated | no | PASS | PASS | dependency automation configured at .github/dependabot.yml |
| `HYG-10` | License present | COSMETIC | automated | no | PASS | PASS | license present at LICENSE |
| `HYG-11` | Branch protection declared as code | COSMETIC | automated | no | FAIL | FAIL | github offers branch protection as code, none found |

---

Rendered from the JSON report by `render_report.py`. The JSON report is the record.
