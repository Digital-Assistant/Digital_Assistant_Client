# Contributing

Thank you for helping. This page says how a change reaches `dev`. Build, test and install steps are in
[`README.md`](README.md). The rules for this repository are in [`AGENTS.md`](AGENTS.md). More pages are listed in
[`docs/README.md`](docs/README.md).

## Set up

1. Install Node 22. CI uses Node 22.
2. Run `npm ci` (or `npm install`).
3. Build with `npm run build:prod` (output in `dist/`) or `npm run build` (output in `build/`).

The repo has no commit hooks. The checks below run in CI, so run them yourself before you open a pull request.

## Make a change

1. Branch from `dev`: `git switch -c <type>/<topic> origin/dev`.
2. Make the change.
3. Run the checks:
   - `npx tsc --noEmit` (type check)
   - `npm test` (unit tests in `tests/`)
   - `npm run build:prod` (build)
4. Update the docs in the same change when it alters behaviour or a decision.

CI also runs gitleaks, a workflow lint and the store packaging tests. The list and the scripts are in
[`scripts/ci/README.md`](scripts/ci/README.md).

## Commits and pull requests

- The pull request title is a Conventional Commit: `<type>(<scope>): <description>`.
  Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.
  The `Conventional Commit Title` check enforces it.
- Open the pull request into `dev`.
- Squash into `dev`. The pull request title becomes the commit.
- Release Please owns `package.json` and `CHANGELOG`; do not edit them by hand for a release.
- Never touch `master`. It takes only the `dev` promotion.

## Rules that block a merge

- This repo is public. Never commit a secret, a real backend host or a value from a private env file.
- Secret keys must have no value in any env file. `scripts/ci/check-env-keys.sh` fails the build otherwise.
  The key list is in [`AGENTS.md`](AGENTS.md), "Public-repo rule".
- Backend URLs reach the build only as Actions variables or from a gitignored `environments/<build>.env`.
- Manifest changes (permissions, `action`, `options_ui`, `key`) need the owner's approval.
- Do not edit the files in `docs/agentic-readiness-report/`. They are a frozen record.
