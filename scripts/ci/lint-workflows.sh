#!/usr/bin/env bash
# Lints the GitHub workflows and the CI scripts:
#   - actionlint (pinned, checksum-checked) over .github/workflows/*.yml; it also lints
#     every `run:` block with ShellCheck when that tool is on PATH;
#   - zizmor (pinned, offline) over the same workflows;
#   - shellcheck over scripts/ci/*.sh;
#   - node --check over scripts/ci/*.mjs and scripts/e2e/*.mjs (syntax only).
# Needs: curl, sha256sum, python3 with venv (for zizmor), shellcheck (preinstalled on
# GitHub's ubuntu runners; locally: your package manager).
set -euo pipefail
cd "$(dirname "$0")/../.."

ACTIONLINT_VERSION="1.7.12"
ACTIONLINT_SHA256="8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8"
ZIZMOR_VERSION="1.31.1"

mapfile -t WORKFLOWS < <(find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) | LC_ALL=C sort)
mapfile -t SCRIPTS < <(find scripts/ci -maxdepth 1 -type f -name '*.sh' | LC_ALL=C sort)
(( ${#WORKFLOWS[@]} > 0 )) || { echo "no workflows found" >&2; exit 1; }

command -v shellcheck >/dev/null || { echo "shellcheck not found on PATH" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
curl -fsSL -o "$TMP/actionlint.tar.gz" \
  "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"
echo "${ACTIONLINT_SHA256}  $TMP/actionlint.tar.gz" | sha256sum -c -
tar -xzf "$TMP/actionlint.tar.gz" -C "$TMP" actionlint

echo "==> shellcheck $(shellcheck --version | sed -n 's/^version: //p') (${#SCRIPTS[@]} scripts)"
shellcheck "${SCRIPTS[@]}"

echo "==> node --check (scripts/ci/*.mjs, scripts/e2e/*.mjs)"
for f in scripts/ci/*.mjs scripts/e2e/*.mjs; do node --check "$f"; done

echo "==> actionlint ${ACTIONLINT_VERSION} (${#WORKFLOWS[@]} workflows)"
"$TMP/actionlint" "${WORKFLOWS[@]}"

echo "==> zizmor ${ZIZMOR_VERSION}"
python3 -m venv "$TMP/venv"
"$TMP/venv/bin/pip" install --quiet "zizmor==${ZIZMOR_VERSION}"
# Offline: no GitHub token is passed, so online-only audits are skipped.
"$TMP/venv/bin/zizmor" --offline "${WORKFLOWS[@]}"

echo "lint-workflows: OK"
