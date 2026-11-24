# Contributing

Thank you for helping. This page says how a change reaches `dev`. Build, test and install steps are in
[`README.md`](README.md). The rules for this repository are in [`AGENTS.md`](AGENTS.md). More pages are listed in
[`docs/README.md`](docs/README.md).

## Set up

1. Install Node 22.18 or later (CI uses Node 22). `npm test` needs 22.18+ to run the TypeScript tests.
2. Run `npm ci` (or `npm install`).
3. Build with `npm run build:prod` (output in `dist/`) or `npm run build` (output in `build/`).

The repo has no commit hooks. The checks below run in CI, so run them yourself before you open a pull request.

## Make a change

1. Branch from `dev`: `git fetch origin && git switch -c <branch> origin/dev`.
2. Make the change.
3. Run the checks:
   - `npx tsc --noEmit` (type check)
   - `npm test` (unit tests in `tests/`)
   - `npm run build:prod` (build)
4. Update the docs in the same change when it alters behaviour or a decision.

CI also runs more checks (for example gitleaks, a workflow lint, the store packaging and release tests, and a
report-only `npm audit`). The list and the scripts are in
[`scripts/ci/README.md`](scripts/ci/README.md).

## Commits and pull requests

- The pull request title is a Conventional Commit: `<type>(<scope>): <description>`.
  Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.
  The `Conventional Commit Title` check enforces it.
- Open the pull request into `dev`.
- Squash into `dev`. The pull request title becomes the commit.
- Release Please owns `package.json` and `CHANGELOG.md` (created by
  Release Please); do not edit them by hand for a release.
- Never touch `master`. It takes only the `dev` promotion.

## Rules for every change

- This repo is public. Never commit a secret, a real backend host or a value from a private env file.
- Secret keys must have no value in any env file. `scripts/ci/check-env-keys.sh` (run by `scripts/ci/package-extension.sh` in CI) fails the build otherwise.
  The key list is in [`AGENTS.md`](AGENTS.md), "Public-repo rule".
- Backend URLs reach the build only as Actions variables or from a gitignored `environments/<build>.env`.
- Manifest changes (permissions, `action`, `options_ui`, `key`) need the owner's approval.
- Do not edit the files in `docs/agentic-readiness-report/`. They are a point-in-time audit record.
