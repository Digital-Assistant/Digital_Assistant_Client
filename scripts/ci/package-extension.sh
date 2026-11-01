#!/usr/bin/env bash
# Builds the extension once and packs it into one identifiable zip.
#
#   1. scripts/ci/check-env-keys.sh, then a clean `npm run build:prod` (dist/ is wiped first);
#   2. stamps the BUILT dist/manifest.json (never public/manifest.json):
#        version      = X.Y.Z.<run number>   (X.Y.Z from package.json)
#        version_name = "X.Y.Z (<sha7>) run <run number>.<attempt> cfg <config hash>"
#      version_name is the build identity: it changes whenever the zip content can change
#      (new commit, new run, a re-run attempt, or a changed build configuration);
#   3. writes dist/build-info.json (commit, branch, run, attempt, config_hash, SDK version +
#      integrity, Node, names of the env keys that had a value; never values; version_name
#      is derivable from these fields);
#   4. writes out/udan-extension-<version>.zip deterministically (sorted entries, fixed
#      timestamps = commit time, fixed modes, zip -X -D), a copy of build-info.json and
#      out/SHA256SUMS over both.
# Same commit + same run number + attempt + env = same zip bytes.
#
# With --store it also cuts the two Chrome Web Store zips from the SAME dist/ (no second build,
# one config_hash): out/udan-extension-<version>-store-test.zip and ...-store-prod.zip. Both
# drop the manifest "key" (the store item id is fixed by the store, the key pins the dev/TEST id)
# and carry a tier stamp tier.json ({"tier":"TEST"} or {"tier":"PROD"}, read by the extension at
# runtime). They differ ONLY in: manifest.json "name" (TEST: "UDA TEST"), tier.json, the "tier"
# field of build-info.json and the TEST icon badge files (store/test-icons/*.png over logos/).
# Every other file is byte-identical, so what testers ran is what ships. Each zip gets its line
# in SHA256SUMS. Verify with scripts/ci/check-store-zip.sh.
# Firefox is not in use: no Firefox zip (TODO). dist/manifest-firefox.json is copied but unused.
#
# Usage: scripts/ci/package-extension.sh [--run-number N] [--sha SHA] [--no-build] [--store]
#                                        [--dist-dir DIR] [--out-dir DIR]
#   --run-number N  4th version part (default: GITHUB_RUN_NUMBER, else 0)
# The attempt comes from GITHUB_RUN_ATTEMPT (default 1).
#   --sha SHA       commit recorded in version_name/build-info (default: GITHUB_SHA, else HEAD)
#   --no-build      package the existing dist/ (skips the env check and the build)
#   --store         also write the two store zips (see above)
#   --dist-dir DIR  built extension folder (default dist); --out-dir DIR  output folder (default out).
#                   Meant for tests on a fixture dist/; relative paths are from the repo root.
# In GitHub Actions it also appends a summary to GITHUB_STEP_SUMMARY and sets the outputs
# version, zip and sha256 in GITHUB_OUTPUT.
set -euo pipefail
cd "$(dirname "$0")/../.."

BUILD_ENV=production   # npm run build:prod = webpack --env build=production
SDK_PKG="@udan/digital-assistant-sdk"

run_number="${GITHUB_RUN_NUMBER:-0}"
sha="${GITHUB_SHA:-}"
do_build=true
store=false
dist_dir=dist
out_dir=out
while (( $# )); do
  case "$1" in
    --run-number) run_number="${2:?--run-number needs a value}"; shift 2 ;;
    --sha) sha="${2:?--sha needs a value}"; shift 2 ;;
    --no-build) do_build=false; shift ;;
    --store) store=true; shift ;;
    --dist-dir) dist_dir="${2:?--dist-dir needs a value}"; shift 2 ;;
    --out-dir) out_dir="${2:?--out-dir needs a value}"; shift 2 ;;
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
run_attempt="${GITHUB_RUN_ATTEMPT:-1}"
[[ "$run_attempt" =~ ^[1-9][0-9]*$ ]] || { echo "GITHUB_RUN_ATTEMPT '$run_attempt' is not a positive integer" >&2; exit 1; }

if [[ "$do_build" == true ]]; then
  [[ "$dist_dir" == dist ]] || { echo "--dist-dir needs --no-build (the build always writes dist/)" >&2; exit 2; }
  BUILD_ENV="$BUILD_ENV" scripts/ci/check-env-keys.sh
  rm -rf dist
  npm run build:prod
fi
[[ -f "${dist_dir}/manifest.json" ]] || { echo "${dist_dir}/manifest.json missing: build first" >&2; exit 1; }

# Fixed timestamp for every zip entry: the commit time (or SOURCE_DATE_EPOCH).
epoch="${SOURCE_DATE_EPOCH:-$(git log -1 --format=%ct "$sha" 2>/dev/null || echo 315532800)}"
[[ "$epoch" =~ ^[0-9]+$ ]] || { echo "bad SOURCE_DATE_EPOCH '$epoch'" >&2; exit 1; }
(( epoch >= 315532800 )) || epoch=315532800   # zip (DOS time) cannot store dates before 1980

branch="${GITHUB_HEAD_REF:-${GITHUB_REF_NAME:-$(git branch --show-current 2>/dev/null || true)}}"
env_keys_set="$(node scripts/build-env.js "$BUILD_ENV" --non-empty)"
# Fingerprint of the values the build inlines (the same env webpack just used), never the values.
config_hash="$(node scripts/build-env.js "$BUILD_ENV" --hash)"
# Free-form (Chrome does not parse it). Keep in step with publish-test-build.sh.
version_name="${base} (${sha7}) run ${run_number}.${run_attempt} cfg ${config_hash}"

VERSION="$version" VERSION_NAME="$version_name" COMMIT="$sha" BRANCH="${branch:-unknown}" \
RUN_ID="${GITHUB_RUN_ID:-local}" RUN_NUMBER="$run_number" RUN_ATTEMPT="$run_attempt" CONFIG_HASH="$config_hash" \
DIST_DIR="$dist_dir" REPOSITORY="${GITHUB_REPOSITORY:-}" EPOCH="$epoch" ENV_KEYS_SET="$env_keys_set" SDK_PKG="$SDK_PKG" \
node <<'EOF'
const fs = require("fs");
const e = process.env;

// Stamp the built manifest (version_name right after version).
const manifestPath = `${e.DIST_DIR}/manifest.json`;
const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const stamped = {};
for (const [k, v] of Object.entries(m)) {
  if (k === "version_name") continue;
  stamped[k] = k === "version" ? e.VERSION : v;
  if (k === "version") stamped.version_name = e.VERSION_NAME;
}
if (!("version" in stamped)) throw new Error(`${manifestPath} has no version`);
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
  run_attempt: Number(e.RUN_ATTEMPT),
  config_hash: e.CONFIG_HASH,
  // Commit time, not wall-clock time: rebuilding the same commit gives the same bytes.
  // The CI run (run_id) tells when it was built.
  source_date_utc: new Date(Number(e.EPOCH) * 1000).toISOString(),
  sdk: { name: e.SDK_PKG, version: sdk.version, integrity: sdk.integrity, resolved: sdk.resolved },
  node: process.version,
  env_keys_set: JSON.parse(e.ENV_KEYS_SET),
};
fs.writeFileSync(`${e.DIST_DIR}/build-info.json`, JSON.stringify(info, null, 2) + "\n");
EOF

# Deterministic zip: fixed modes and mtimes, sorted entries, no extra attributes, no dir entries.
mkdir -p "$out_dir"
dist_abs="$(cd "$dist_dir" && pwd)"
out_abs="$(cd "$out_dir" && pwd)"

# pack_dir <folder> <zip path>: same bytes for the same folder content.
pack_dir() {
  find "$1" -type d -exec chmod 755 {} +
  find "$1" -type f -exec chmod 644 {} +
  find "$1" -exec touch -h -d "@${epoch}" {} +
  (
    cd "$1"
    find . -type f -print | sed 's|^\./||' | LC_ALL=C sort | TZ=UTC zip -X -D -q -@ "$2"
  )
}

zip_name="udan-extension-${version}.zip"
rm -f "${out_abs}"/udan-extension-*.zip "${out_abs}/SHA256SUMS" "${out_abs}/build-info.json"
pack_dir "$dist_abs" "${out_abs}/${zip_name}"
cp "${dist_abs}/build-info.json" "${out_abs}/build-info.json"
sums=("$zip_name" build-info.json)

# Store zips: the two tiers are cut from the same, already stamped dist/ (never a second build).
store_names=()
if [[ "$store" == true ]]; then
  icons_dir=store/test-icons
  stage_root="$(mktemp -d)"
  trap 'rm -rf "$stage_root"' EXIT
  for tier in test prod; do
    stage="${stage_root}/${tier}"
    cp -a "$dist_abs" "$stage"
    if [[ "$tier" == test ]]; then
      [[ -d "$icons_dir" ]] || { echo "${icons_dir} missing (TEST icon badge files)" >&2; exit 1; }
      for icon in "$icons_dir"/*.png; do
        [[ -f "$stage/logos/$(basename "$icon")" ]] || { echo "dist has no logos/$(basename "$icon") to badge" >&2; exit 1; }
        cp "$icon" "$stage/logos/$(basename "$icon")"
      done
    fi
    STAGE="$stage" TIER="${tier^^}" node <<'EOF'
const fs = require("fs");
const { STAGE, TIER } = process.env;
// manifest: no "key" (the store fixes the item id); the TEST item is named "UDA TEST".
const mPath = `${STAGE}/manifest.json`;
const m = JSON.parse(fs.readFileSync(mPath, "utf8"));
delete m.key;
if (TIER === "TEST") m.name = "UDA TEST";
fs.writeFileSync(mPath, JSON.stringify(m, null, 2) + "\n");
// tier stamp, exactly one key (the reader in src/config/tierStamp.ts is strict).
fs.writeFileSync(`${STAGE}/tier.json`, JSON.stringify({ tier: TIER }) + "\n");
// build-info.json: the one tier field is the only addition.
const bPath = `${STAGE}/build-info.json`;
const b = JSON.parse(fs.readFileSync(bPath, "utf8"));
b.tier = TIER;
fs.writeFileSync(bPath, JSON.stringify(b, null, 2) + "\n");
EOF
    store_zip="udan-extension-${version}-store-${tier}.zip"
    pack_dir "$stage" "${out_abs}/${store_zip}"
    sums+=("$store_zip")
    store_names+=("$store_zip")
  done
fi
(cd "$out_abs" && sha256sum "${sums[@]}" > SHA256SUMS)
zip_sha="$(cut -d' ' -f1 < <(grep " ${zip_name}\$" "${out_abs}/SHA256SUMS"))"
sdk_version="$(node -p "require('${out_abs}/build-info.json').sdk.version")"

echo "Packed ${out_dir}/${zip_name}"
echo "  version      ${version}"
echo "  version_name ${version_name}"
echo "  sha256       ${zip_sha}"
echo "  sdk          ${SDK_PKG}@${sdk_version}"
echo "  env keys set ${env_keys_set}"
for n in "${store_names[@]}"; do
  echo "  store zip    ${n} sha256 $(grep " ${n}\$" "${out_abs}/SHA256SUMS" | cut -d' ' -f1)"
done

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "### Extension zip"
    echo "| | |"
    echo "|---|---|"
    echo "| Version | \`${version}\` |"
    echo "| Build identity | \`${version_name}\` |"
    echo "| Zip | \`${zip_name}\` |"
    echo "| SHA256 | \`${zip_sha}\` |"
    echo "| SDK | \`${SDK_PKG}@${sdk_version}\` |"
    echo "| Env keys set | \`${env_keys_set}\` |"
    for n in "${store_names[@]}"; do
      echo "| Store zip | \`${n}\` sha256 \`$(grep " ${n}\$" "${out_abs}/SHA256SUMS" | cut -d' ' -f1)\` |"
    done
  } >>"$GITHUB_STEP_SUMMARY"
fi
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "version=${version}"
    echo "zip=${out_dir}/${zip_name}"
    echo "sha256=${zip_sha}"
  } >>"$GITHUB_OUTPUT"
fi
