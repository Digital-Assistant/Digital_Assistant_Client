#!/usr/bin/env bash
# Find the dev CI run that holds a given extension build, or the newest one.
#   scripts/ci/latest-client-build.sh [VERSION]
# Prints "<run id> <version>" on stdout; messages go to stderr.
#
# CI (ci.yml) uploads artifact `client-zip` on every push to dev that builds (docs-only pushes
# build nothing), kept 90 days. The version is X.Y.Z.<run number>, with X.Y.Z from package.json
# at the run's commit (scripts/ci/package-extension.sh), so the run number finds the run.
#   no VERSION  the newest successful push run on dev whose client-zip has not expired;
#   VERSION     the run whose run number is the last part, checked against package.json.
# Used by the manual Deploy to TEST workflow (deploy-test.yml). No download, no rebuild.
# Needs: gh with GH_TOKEN (actions: read, contents: read), jq, GITHUB_REPOSITORY (<owner>/<repo>).
# Optional env: CI_WORKFLOW (default ci.yml), CI_BRANCH (default dev).
set -euo pipefail

WORKFLOW="${CI_WORKFLOW:-ci.yml}"
BRANCH="${CI_BRANCH:-dev}"
ARTIFACT=client-zip
: "${GITHUB_REPOSITORY:?set GITHUB_REPOSITORY=<owner>/<repo>}"
want="${1:-}"

if [[ -n "$want" && ! "$want" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Version must look like X.Y.Z.N (for example 1.1.0.11), got '$want'" >&2
  exit 1
fi

runs_url="repos/${GITHUB_REPOSITORY}/actions/workflows/${WORKFLOW}/runs?branch=${BRANCH}&event=push&status=success&per_page=100"

# "expired" when the run has a client-zip that has expired, "ok" when it has a live one,
# empty when it has none.
artifact_state() {
  gh api "repos/${GITHUB_REPOSITORY}/actions/runs/$1/artifacts" \
    --jq "[.artifacts[] | select(.name == \"${ARTIFACT}\")] | if length == 0 then \"\" elif any(.expired | not) then \"ok\" else \"expired\" end"
}

# X.Y.Z.<run number>, the way package-extension.sh stamps it.
run_version() {
  local sha="$1" number="$2" base
  base="$(gh api -H "Accept: application/vnd.github.raw+json" \
    "repos/${GITHUB_REPOSITORY}/contents/package.json?ref=${sha}" | jq -r '.version')"
  [[ "$base" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "package.json at ${sha} has version '${base}', not X.Y.Z" >&2; return 1; }
  echo "${base}.${number}"
}

if [[ -z "$want" ]]; then
  # Newest first. A run without the artifact (docs-only push) is skipped.
  while read -r id sha number; do
    case "$(artifact_state "$id")" in
      ok)
        version="$(run_version "$sha" "$number")"
        echo "Newest ${BRANCH} build is ${version} from CI run ${id}" >&2
        echo "${id} ${version}"
        exit 0
        ;;
      expired)
        echo "No ${BRANCH} build with a live ${ARTIFACT} artifact: the newest one (run ${id}) has expired (90 days). Push to ${BRANCH} to build again." >&2
        exit 1
        ;;
    esac
  done < <(gh api "$runs_url" --jq '.workflow_runs[] | "\(.id) \(.head_sha) \(.run_number)"')
  echo "No successful ${WORKFLOW} push run on ${BRANCH} has a ${ARTIFACT} artifact" >&2
  exit 1
fi

number="${want##*.}"
read -r id sha < <(gh api --paginate "$runs_url" \
  --jq ".workflow_runs[] | select(.run_number == ${number}) | \"\(.id) \(.head_sha)\"" | head -1) || true
if [[ -z "${id:-}" ]]; then
  echo "Version ${want}: no successful ${WORKFLOW} push run on ${BRANCH} with run number ${number}" >&2
  exit 1
fi
version="$(run_version "$sha" "$number")"
if [[ "$version" != "$want" ]]; then
  echo "Version ${want} not found: CI run ${id} (run number ${number}) built ${version}" >&2
  exit 1
fi
case "$(artifact_state "$id")" in
  ok) ;;
  expired) echo "Version ${want} (CI run ${id}): the ${ARTIFACT} artifact has expired (90 days)" >&2; exit 1 ;;
  *) echo "Version ${want} (CI run ${id}): the run has no ${ARTIFACT} artifact" >&2; exit 1 ;;
esac
echo "Build ${want} is from CI run ${id}" >&2
echo "${id} ${want}"
