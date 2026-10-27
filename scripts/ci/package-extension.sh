#!/usr/bin/env bash
# Builds the extension once and packs it into one identifiable zip.
#
#   1. scripts/ci/check-env-keys.sh, then a clean `npm run build:prod` (dist/ is wiped first);
#   2. stamps the BUILT dist/manifest.json (never public/manifest.json):
#        version      = X.Y.Z.<run number>   (X.Y.Z from package.json)
#        version_name = "X.Y.Z (<sha7>)"
#   3. writes dist/build-info.json (commit, branch, run, SDK version + integrity, Node,
#      names of the env keys that had a value; never values);
#   4. writes out/udan-extension-<version>.zip deterministically (sorted entries, fixed
#      timestamps = commit time, fixed modes, zip -X -D), a copy of build-info.json and
#      out/SHA256SUMS over both.
# Same commit + same run number + same env = same zip bytes.
# Firefox is not in use: no Firefox zip (TODO). dist/manifest-firefox.json is copied but unused.
#
# Usage: scripts/ci/package-extension.sh [--run-number N] [--sha SHA] [--no-build]
#   --run-number N  4th version part (default: GITHUB_RUN_NUMBER, else 0)
#   --sha SHA       commit recorded in version_name/build-info (default: GITHUB_SHA, else HEAD)
#   --no-build      package the existing dist/ (skips the env check and the build)
# In GitHub Actions it also appends a summary to GITHUB_STEP_SUMMARY and sets the outputs
# version, zip and sha256 in GITHUB_OUTPUT.
set -euo pipefail
cd "$(dirname "$0")/../.."

BUILD_ENV=production   # npm run build:prod = webpack --env build=production
SDK_PKG="@udan/digital-assistant-sdk"

run_number="${GITHUB_RUN_NUMBER:-0}"
sha="${GITHUB_SHA:-}"
do_build=true
while (( $# )); do
  case "$1" in
    --run-number) run_number="${2:?--run-number needs a value}"; shift 2 ;;
    --sha) sha="${2:?--sha needs a value}"; shift 2 ;;
    --no-build) do_build=false; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done
[[ -n "$sha" ]] || sha="$(git rev-parse HEAD)"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo "--sha must be a full 40-hex commit id (got '$sha')" >&2; exit 2; }
sha7="${sha:0:7}"

base="$(node -p 'require("./package.json").version')"
[[ "$base" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "package.json version '$base' is not X.Y.Z" >&2; exit 1; }
version="${base}.${run_number}"
# Chrome: 1-4 dot-separated integers, each 0-65535, no leading zeros.
IFS=. read -r -a parts <<<"$version"
(( ${#parts[@]} == 4 )) || { echo "version $version must have 4 parts" >&2; exit 1; }
for p in "${parts[@]}"; do
  if ! [[ "$p" =~ ^(0|[1-9][0-9]{0,4})$ ]] || (( p > 65535 )); then
    echo "version $version: part '$p' is not an integer 0-65535 without leading zeros" >&2
    exit 1
  fi
done
version_name="${base} (${sha7})"

if [[ "$do_build" == true ]]; then
  BUILD_ENV="$BUILD_ENV" scripts/ci/check-env-keys.sh
  rm -rf dist
  npm run build:prod
fi
[[ -f dist/manifest.json ]] || { echo "dist/manifest.json missing: build first" >&2; exit 1; }

# Fixed timestamp for every zip entry: the commit time (or SOURCE_DATE_EPOCH).
epoch="${SOURCE_DATE_EPOCH:-$(git log -1 --format=%ct "$sha" 2>/dev/null || echo 315532800)}"
[[ "$epoch" =~ ^[0-9]+$ ]] || { echo "bad SOURCE_DATE_EPOCH '$epoch'" >&2; exit 1; }
(( epoch >= 315532800 )) || epoch=315532800   # zip (DOS time) cannot store dates before 1980

branch="${GITHUB_HEAD_REF:-${GITHUB_REF_NAME:-$(git branch --show-current 2>/dev/null || true)}}"
env_keys_set="$(node scripts/build-env.js "$BUILD_ENV" --non-empty)"

VERSION="$version" VERSION_NAME="$version_name" COMMIT="$sha" BRANCH="${branch:-unknown}" \
RUN_ID="${GITHUB_RUN_ID:-local}" RUN_NUMBER="$run_number" RUN_ATTEMPT="${GITHUB_RUN_ATTEMPT:-}" \
REPOSITORY="${GITHUB_REPOSITORY:-}" EPOCH="$epoch" ENV_KEYS_SET="$env_keys_set" SDK_PKG="$SDK_PKG" \
node <<'EOF'
const fs = require("fs");
const e = process.env;

// Stamp the built manifest (version_name right after version).
const manifestPath = "dist/manifest.json";
const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const stamped = {};
for (const [k, v] of Object.entries(m)) {
  if (k === "version_name") continue;
  stamped[k] = k === "version" ? e.VERSION : v;
  if (k === "version") stamped.version_name = e.VERSION_NAME;
}
if (!("version" in stamped)) throw new Error("dist/manifest.json has no version");
fs.writeFileSync(manifestPath, JSON.stringify(stamped, null, 2) + "\n");

const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const sdk = (lock.packages || {})[`node_modules/${e.SDK_PKG}`];
if (!sdk) throw new Error(`${e.SDK_PKG} not found in package-lock.json`);

const info = {
  name: m.name,
  version: e.VERSION,
  version_name: e.VERSION_NAME,
  commit: e.COMMIT,
  branch: e.BRANCH,
  repository: e.REPOSITORY || null,
  run_id: e.RUN_ID,
  run_number: Number(e.RUN_NUMBER),
  run_attempt: e.RUN_ATTEMPT ? Number(e.RUN_ATTEMPT) : null,
  // Commit time, not wall-clock time: rebuilding the same commit gives the same bytes.
  // The CI run (run_id) tells when it was built.
  source_date_utc: new Date(Number(e.EPOCH) * 1000).toISOString(),
  sdk: { name: e.SDK_PKG, version: sdk.version, integrity: sdk.integrity, resolved: sdk.resolved },
  node: process.version,
  env_keys_set: JSON.parse(e.ENV_KEYS_SET),
};
fs.writeFileSync("dist/build-info.json", JSON.stringify(info, null, 2) + "\n");
EOF

# Deterministic zip: fixed modes and mtimes, sorted entries, no extra attributes, no dir entries.
find dist -type d -exec chmod 755 {} +
find dist -type f -exec chmod 644 {} +
find dist -exec touch -h -d "@${epoch}" {} +

zip_name="udan-extension-${version}.zip"
mkdir -p out
rm -f out/udan-extension-*.zip out/SHA256SUMS out/build-info.json
(
  cd dist
  find . -type f -print | sed 's|^\./||' | LC_ALL=C sort | TZ=UTC zip -X -D -q -@ "../out/${zip_name}"
)
cp dist/build-info.json out/build-info.json
(cd out && sha256sum "$zip_name" build-info.json > SHA256SUMS)
zip_sha="$(cut -d' ' -f1 < <(grep " ${zip_name}\$" out/SHA256SUMS))"
sdk_version="$(node -p "require('./out/build-info.json').sdk.version")"

echo "Packed out/${zip_name}"
echo "  version      ${version}"
echo "  version_name ${version_name}"
echo "  sha256       ${zip_sha}"
echo "  sdk          ${SDK_PKG}@${sdk_version}"
echo "  env keys set ${env_keys_set}"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "### Extension zip"
    echo "| | |"
    echo "|---|---|"
    echo "| Version | \`${version}\` (\`${version_name}\`) |"
    echo "| Zip | \`${zip_name}\` |"
    echo "| SHA256 | \`${zip_sha}\` |"
    echo "| SDK | \`${SDK_PKG}@${sdk_version}\` |"
    echo "| Env keys set | \`${env_keys_set}\` |"
  } >>"$GITHUB_STEP_SUMMARY"
fi
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "version=${version}"
    echo "zip=out/${zip_name}"
    echo "sha256=${zip_sha}"
  } >>"$GITHUB_OUTPUT"
fi
