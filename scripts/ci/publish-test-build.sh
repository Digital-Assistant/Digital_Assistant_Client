#!/usr/bin/env bash
# Publish an existing dev build to testers as GitHub prereleases. Never builds.
#   scripts/ci/publish-test-build.sh DIR
# DIR holds the client-zip artifact of a dev CI run: udan-extension-<version>.zip, SHA256SUMS,
# build-info.json. The script:
#   1. verifies SHA256SUMS, reads build-info.json, checks the zip name and the manifest inside
#      the zip, and refuses a commit that is not on dev;
#   2. creates or updates prerelease test-v<version> (tag on the build commit);
#   3. points prerelease test-current at the same commit and replaces its assets, so testers
#      have one fixed page;
#   4. writes the release notes (install steps, backend state, known issues) to DIR/RELEASE_NOTES.md
#      and a summary to GITHUB_STEP_SUMMARY.
# Neither release is ever marked latest. Running it with an older build is the rollback.
# Needs: gh with GH_TOKEN (contents: write), jq, unzip, sha256sum, GITHUB_REPOSITORY.
# Optional env:
#   EXPECTED_VERSION  fail unless build-info.json has this version;
#   BASE_TEST_URL     public TEST API base; if the bundle contains it, the notes say the build
#                     talks to the TEST backend, otherwise "UI only" (never printed);
#   DRY_RUN=1         run every check and write the notes, change no release;
#   CI_BRANCH         branch the commit must be on (default dev).
set -euo pipefail

dir="${1:?usage: publish-test-build.sh DIR}"
: "${GITHUB_REPOSITORY:?set GITHUB_REPOSITORY=<owner>/<repo>}"
BRANCH="${CI_BRANCH:-dev}"
DRY_RUN="${DRY_RUN:-}"
CURRENT_TAG=test-current
KNOWN_ISSUES="$(cd "$(dirname "$0")" && pwd)/test-known-issues.md"
server="${GITHUB_SERVER_URL:-https://github.com}"
repo_url="${server}/${GITHUB_REPOSITORY}"

cd "$dir"

# 1. Verify what CI produced.
[[ -f SHA256SUMS && -f build-info.json ]] || { echo "${dir} must hold SHA256SUMS and build-info.json" >&2; exit 1; }
sha256sum --check --strict --quiet SHA256SUMS || { echo "SHA256SUMS does not match the files" >&2; exit 1; }
mapfile -t zips < <(awk '{print $2}' SHA256SUMS | grep -E '^udan-extension-.*\.zip$' || true)
(( ${#zips[@]} == 1 )) || { echo "SHA256SUMS must list exactly one udan-extension-*.zip (found ${#zips[@]})" >&2; exit 1; }
zip_name="${zips[0]}"
grep -qE '  build-info\.json$' SHA256SUMS || { echo "SHA256SUMS does not cover build-info.json" >&2; exit 1; }

version="$(jq -r '.version' build-info.json)"
version_name="$(jq -r '.version_name' build-info.json)"
commit="$(jq -r '.commit' build-info.json)"
built_branch="$(jq -r '.branch' build-info.json)"
run_id="$(jq -r '.run_id' build-info.json)"
sdk="$(jq -r '"\(.sdk.name) \(.sdk.version)"' build-info.json)"

[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "build-info.json version '${version}' is not X.Y.Z.N" >&2; exit 1; }
[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || { echo "build-info.json commit '${commit}' is not a full commit id" >&2; exit 1; }
[[ "$zip_name" == "udan-extension-${version}.zip" ]] || { echo "zip ${zip_name} does not match version ${version}" >&2; exit 1; }
if [[ -n "${EXPECTED_VERSION:-}" && "$version" != "$EXPECTED_VERSION" ]]; then
  echo "Asked for ${EXPECTED_VERSION}, but the artifact holds ${version}" >&2
  exit 1
fi
[[ "$built_branch" == "$BRANCH" ]] || { echo "Built on '${built_branch}', not ${BRANCH}" >&2; exit 1; }

manifest="$(unzip -p "$zip_name" manifest.json)"
[[ "$(jq -r '.version' <<<"$manifest")" == "$version" ]] || { echo "manifest.json in the zip does not have version ${version}" >&2; exit 1; }
[[ "$(jq -r '.version_name' <<<"$manifest")" == "$version_name" ]] || { echo "manifest.json in the zip does not have version_name ${version_name}" >&2; exit 1; }

# The commit must be on the branch: compare reports the branch as ahead of (or equal to) it.
status="$(gh api "repos/${GITHUB_REPOSITORY}/compare/${BRANCH}...${commit}" --jq '.status' 2>/dev/null)" \
  || { echo "Commit ${commit} not found in ${GITHUB_REPOSITORY}" >&2; exit 1; }
[[ "$status" == "behind" || "$status" == "identical" ]] \
  || { echo "Commit ${commit} is not on ${BRANCH} (compare: ${status})" >&2; exit 1; }

zip_sha="$(awk -v f="$zip_name" '$2 == f {print $1}' SHA256SUMS)"
assets=("$zip_name" SHA256SUMS build-info.json)

# Backend state for the notes: the URLs reach the bundle only once the app uses them.
backend="UI only: this build does not reach a backend yet."
if [[ -n "${BASE_TEST_URL:-}" ]]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  unzip -q "$zip_name" -d "$tmp"
  if find "$tmp" -type f -name '*.js' -exec grep -qF -- "$BASE_TEST_URL" {} \; -print -quit | grep -q .; then
    backend="Talks to the TEST backend when loaded unpacked."
  fi
else
  echo "BASE_TEST_URL not set: the notes say UI only without checking the bundle" >&2
fi

tag="test-v${version}"
previous=""
if prev_sha="$(gh api "repos/${GITHUB_REPOSITORY}/git/ref/tags/${CURRENT_TAG}" --jq '.object.sha' 2>/dev/null)"; then
  [[ "$prev_sha" != "$commit" ]] && previous="$prev_sha"
fi

# 4. Release notes. No hostnames: the notes only say "TEST backend".
notes="RELEASE_NOTES.md"
{
  echo "TEST build for testers. Not a production release."
  echo
  echo "| | |"
  echo "|---|---|"
  echo "| Version | \`${version}\`, shown on the extension card as \`${version_name}\` |"
  echo "| Commit | [\`${commit:0:7}\`](${repo_url}/commit/${commit}) on \`${BRANCH}\` |"
  echo "| SDK | \`${sdk}\` |"
  echo "| SHA256 of the zip | \`${zip_sha}\` |"
  echo "| Built by | [CI run ${run_id}](${repo_url}/actions/runs/${run_id}) |"
  echo
  echo "**Backend:** ${backend}"
  echo
  echo "## Install in Chrome"
  echo "1. Open \`chrome://extensions\` and remove the old UDAN extension. Unpacked extensions do not update themselves: install each new build this way."
  echo "2. Download \`${zip_name}\` below and unzip it into a new, empty folder."
  echo "3. Turn on **Developer mode** (top right), click **Load unpacked** and pick that folder."
  echo "4. Check the card shows \`${version_name}\`. **Details** shows version \`${version}\`."
  echo
  echo "To check the download: \`sha256sum --check --ignore-missing SHA256SUMS\` in the download folder."
  echo
  echo "## Known issues"
  if [[ -s "$KNOWN_ISSUES" ]]; then cat "$KNOWN_ISSUES"; else echo "None known."; fi
  echo
  echo "## Report a problem"
  echo "Open an issue in this repository. Include the version from \`chrome://extensions\`, the page you were on and what you expected."
  if [[ -n "$previous" ]]; then
    echo
    echo "## Changes since the previous TEST build"
    echo "${repo_url}/compare/${previous:0:12}...${commit:0:12}"
  fi
} > "$notes"

summary() {
  [[ -n "${GITHUB_STEP_SUMMARY:-}" ]] || return 0
  {
    echo "### Deploy to TEST: \`${version}\`"
    echo "- Zip: \`${zip_name}\`, SHA256 \`${zip_sha}\`"
    echo "- Commit: \`${commit}\`, SDK \`${sdk}\`"
    echo "- Releases: [${tag}](${repo_url}/releases/tag/${tag}), [${CURRENT_TAG}](${repo_url}/releases/tag/${CURRENT_TAG})"
    echo "- Backend: ${backend}"
    [[ -z "$DRY_RUN" ]] || echo "- **Dry run: no release changed**"
  } >> "$GITHUB_STEP_SUMMARY"
}

if [[ -n "$DRY_RUN" ]]; then
  echo "Dry run: would publish ${zip_name} (${zip_sha}) from ${commit} as ${tag} and ${CURRENT_TAG}" >&2
  echo "Notes: ${dir}/${notes}" >&2
  summary
  exit 0
fi

R=(--repo "$GITHUB_REPOSITORY")
release_exists() { gh release view "$1" "${R[@]}" --json tagName >/dev/null 2>&1; }

# 2. Versioned prerelease: one per build, kept.
if release_exists "$tag"; then
  tag_sha="$(gh api "repos/${GITHUB_REPOSITORY}/git/ref/tags/${tag}" --jq '.object.sha')"
  [[ "$tag_sha" == "$commit" ]] || { echo "Tag ${tag} points at ${tag_sha}, not ${commit}; refusing" >&2; exit 1; }
  gh release upload "$tag" "${assets[@]}" --clobber "${R[@]}"
  gh release edit "$tag" --prerelease --latest=false --title "TEST build ${version}" --notes-file "$notes" "${R[@]}" >/dev/null
  echo "Updated ${tag}" >&2
else
  gh release create "$tag" "${assets[@]}" --target "$commit" --prerelease --latest=false \
    --title "TEST build ${version}" --notes-file "$notes" "${R[@]}" >/dev/null
  echo "Created ${tag}" >&2
fi

# 3. test-current: same commit, same files, fixed URL.
if release_exists "$CURRENT_TAG"; then
  gh api -X PATCH "repos/${GITHUB_REPOSITORY}/git/refs/tags/${CURRENT_TAG}" -f sha="$commit" -F force=true >/dev/null
  gh release upload "$CURRENT_TAG" "${assets[@]}" --clobber "${R[@]}"
  # Drop files of the build it pointed at before (other zip names).
  while read -r old; do
    keep=""
    for a in "${assets[@]}"; do [[ "$old" == "$a" ]] && keep=1; done
    [[ -n "$keep" ]] || gh release delete-asset "$CURRENT_TAG" "$old" --yes "${R[@]}"
  done < <(gh release view "$CURRENT_TAG" "${R[@]}" --json assets --jq '.assets[].name')
  gh release edit "$CURRENT_TAG" --prerelease --latest=false --title "TEST current: ${version}" --notes-file "$notes" "${R[@]}" >/dev/null
  echo "Moved ${CURRENT_TAG} to ${version}" >&2
else
  gh release create "$CURRENT_TAG" "${assets[@]}" --target "$commit" --prerelease --latest=false \
    --title "TEST current: ${version}" --notes-file "$notes" "${R[@]}" >/dev/null
  echo "Created ${CURRENT_TAG} at ${version}" >&2
fi

summary
echo "Published ${version}: ${repo_url}/releases/tag/${CURRENT_TAG}" >&2
