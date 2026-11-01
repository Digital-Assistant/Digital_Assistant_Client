#!/usr/bin/env bash
# Checks a Chrome Web Store zip made by `package-extension.sh --store`, and optionally the pair.
#
# Usage: scripts/ci/check-store-zip.sh [--require-keys k1,k2] <zip> [<other zip>]
#   One zip:  checks that zip on its own.
#   Two zips: checks each, then the pair (one -store-test and one -store-prod of the same
#             version): every file byte-identical except the allowed list.
#   --require-keys  comma-separated env key names that must be set in the build (e.g.
#             keycloakPublicClientId,keycloakRealm). Without it, baked keys are only reported.
#
# Per zip, in a fresh empty directory (nothing from the zip is ever executed):
#   - name is udan-extension-<X.Y.Z.N>-store-(test|prod).zip, archive is intact, no path escapes;
#   - manifest.json has NO "key"; manifest version = version in the name = build-info.json version;
#   - tier.json is exactly {"tier":"TEST"} or {"tier":"PROD"} and matches the zip name;
#   - manifest name: "UDA TEST" for the TEST zip, not "UDA TEST" (and = build-info name) for PROD;
#   - build-info.json "tier" matches; none of the five secret key names is in build-info
#     env_keys_set; none of them is assigned a non-empty string literal anywhere in the zip
#     (key:"x", key="x"); and the four names this repo never uses do not appear at all.
#     "clientSecret" alone may appear as text: the published SDK has a config property of that
#     name that stays empty in a store build;
#   - SHA256SUMS next to the zip (if present) lists this zip with the right hash.
# Pair: same version and commit; same file list; the only differing files are manifest.json
# (name only), tier.json, build-info.json (tier only) and the TEST icon badges (logos/nist-logo-*.png).
#
# Public repo, public logs: prints pass/FAIL lines, booleans, file names and sha256 hashes only,
# never a value from the zip. Exit 0 when every check passes, 1 otherwise.
# SC2016: the single-quoted strings are jq programs; "$v" there is a jq variable, not a shell one.
# shellcheck disable=SC2016
set -euo pipefail

SECRET_KEYS=(keycloakClientSecret profanityKey googleTranslateApiKey googleAnalyticsSecretKey clientSecret)

require_keys=""
zips=()
while (( $# )); do
  case "$1" in
    --require-keys) require_keys="${2:?--require-keys needs a value}"; shift 2 ;;
    -*) echo "unknown argument: $1" >&2; exit 2 ;;
    *) zips+=("$1"); shift ;;
  esac
done
(( ${#zips[@]} == 1 || ${#zips[@]} == 2 )) || { echo "usage: $0 [--require-keys k1,k2] <zip> [<other zip>]" >&2; exit 2; }
for t in jq unzip sha256sum; do command -v "$t" >/dev/null || { echo "$t is required" >&2; exit 2; }; done

schema_file="$(dirname "$0")/../../environments/env.example"
fail=0
tmp_root="$(mktemp -d)"
trap 'rm -rf "$tmp_root"' EXIT

ok()  { echo "  pass  $1"; }
bad() { echo "  FAIL  $1"; fail=1; }
check() { # check "<label>" <command...>
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then ok "$label"; else bad "$label"; fi
}

declare -A DIR=() TIER=() VERSION=()   # keyed by zip path
opened=0

check_one() {
  local zip="$1" base tier version dir
  base="$(basename "$zip")"
  echo "== ${base}"
  if [[ ! -f "$zip" ]]; then bad "zip exists"; return; fi
  echo "  sha256 $(sha256sum "$zip" | cut -d' ' -f1)"

  if [[ "$base" =~ ^udan-extension-([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)-store-(test|prod)\.zip$ ]]; then
    version="${BASH_REMATCH[1]}"; tier="${BASH_REMATCH[2]^^}"; ok "name is udan-extension-<version>-store-<tier>.zip (tier ${tier})"
  else
    bad "name is udan-extension-<version>-store-(test|prod).zip"; return
  fi
  VERSION[$zip]="$version"; TIER[$zip]="$tier"

  if ! unzip -tq "$zip" >/dev/null 2>&1; then bad "archive is intact"; return; fi
  ok "archive is intact"
  # No absolute paths, no "..", no directory-only surprises.
  if unzip -Z1 "$zip" | grep -qE '^/|(^|/)\.\.(/|$)'; then bad "no path escapes in the archive"; return; fi
  ok "no path escapes in the archive"

  opened=$((opened + 1))
  dir="${tmp_root}/${opened}"
  mkdir "$dir"
  unzip -q "$zip" -d "$dir"
  DIR[$zip]="$dir"

  for f in manifest.json tier.json build-info.json; do
    [[ -f "$dir/$f" ]] || { bad "$f is in the zip"; return; }
  done
  ok "manifest.json, tier.json and build-info.json are in the zip"
  jq -e . "$dir/manifest.json" "$dir/build-info.json" "$dir/tier.json" >/dev/null 2>&1 || { bad "the three JSON files parse"; return; }

  check "manifest.json has no \"key\"" jq -e 'has("key") | not' "$dir/manifest.json"
  check "manifest version equals the version in the name" jq -e --arg v "$version" '.version == $v' "$dir/manifest.json"
  check "build-info.json version equals the version in the name" jq -e --arg v "$version" '.version == $v' "$dir/build-info.json"
  # tier.json: one key, the tier, matching the name; the file holds nothing else.
  check "tier.json is exactly {\"tier\":\"${tier}\"} (one key, matches the zip name)" \
    jq -e --arg t "$tier" 'keys == ["tier"] and .tier == $t' "$dir/tier.json"
  check "build-info.json tier is ${tier}" jq -e --arg t "$tier" '.tier == $t' "$dir/build-info.json"
  if [[ "$tier" == TEST ]]; then
    check 'manifest name is "UDA TEST"' jq -e '.name == "UDA TEST"' "$dir/manifest.json"
  else
    check 'manifest name is not "UDA TEST" and equals build-info name' jq -e '.name != "UDA TEST" and .name == $b' --argjson b "$(jq '.name' "$dir/build-info.json")" "$dir/manifest.json"
  fi

  # Secret key names: absent from the baked-key list and from every text file.
  local s leaked_list=0 leaked_value=0 leaked_name=0
  for s in "${SECRET_KEYS[@]}"; do
    if jq -e --arg s "$s" '(.env_keys_set // []) | index($s) != null' "$dir/build-info.json" >/dev/null; then leaked_list=1; fi
    # name followed by : or = and a non-empty string literal (plain, quoted or minified)
    if grep -rIlE -e "(^|[^A-Za-z0-9_])${s}[\"'\`]?[[:space:]]*[:=][[:space:]]*[\"'\`][^\"'\`]" "$dir" >/dev/null 2>&1; then leaked_value=1; fi
    if [[ "$s" != clientSecret ]] && grep -rIlF -e "$s" "$dir" >/dev/null 2>&1; then leaked_name=1; fi
  done
  if (( leaked_list == 0 )); then ok "no secret key name in build-info env_keys_set"; else bad "no secret key name in build-info env_keys_set"; fi
  if (( leaked_value == 0 )); then ok "no secret key name is assigned a non-empty value in any file"; else bad "no secret key name is assigned a non-empty value in any file"; fi
  if (( leaked_name == 0 )); then ok "the four unused secret key names do not appear in any file"; else bad "the four unused secret key names do not appear in any file"; fi

  # Baked keys: booleans (set = the key had a non-empty value at build time; values are never read).
  local key state line=""
  if [[ -f "$schema_file" ]]; then
    while IFS= read -r key; do
      if jq -e --arg k "$key" '(.env_keys_set // []) | index($k) != null' "$dir/build-info.json" >/dev/null; then state=true; else state=false; fi
      line+="${key}=${state} "
    done < <(grep -oE '^[A-Za-z][A-Za-z0-9]*=' "$schema_file" | tr -d '=')
    echo "  baked keys (set?) ${line}"
  fi
  if [[ -n "$require_keys" ]]; then
    local k missing=""
    IFS=, read -r -a req <<<"$require_keys"
    for k in "${req[@]}"; do
      jq -e --arg k "$k" '(.env_keys_set // []) | index($k) != null' "$dir/build-info.json" >/dev/null || missing+="${k} "
    done
    if [[ -z "$missing" ]]; then ok "required keys are set (${require_keys})"; else bad "required keys are set (missing: ${missing% })"; fi
  fi

  # SHA256SUMS beside the zip.
  local sums
  sums="$(dirname "$zip")/SHA256SUMS"
  if [[ -f "$sums" ]]; then
    if (cd "$(dirname "$zip")" && grep -F "  ${base}" SHA256SUMS | sha256sum --check --strict --quiet - >/dev/null 2>&1) \
       && [[ "$(grep -cF "  ${base}" "$sums")" == 1 ]]; then
      ok "SHA256SUMS lists this zip with the right hash"
    else
      bad "SHA256SUMS lists this zip with the right hash"
    fi
  else
    echo "  skip  SHA256SUMS not next to the zip"
  fi
}

check_pair() {
  local za="$1" zb="$2" ta tb test_zip prod_zip
  ta="${TIER[$za]:-}"; tb="${TIER[$zb]:-}"
  echo "== pair"
  if [[ -z "${DIR[$za]:-}" || -z "${DIR[$zb]:-}" ]]; then bad "both zips could be opened"; return; fi
  if [[ "$ta" == TEST && "$tb" == PROD ]]; then test_zip="$za"; prod_zip="$zb"
  elif [[ "$ta" == PROD && "$tb" == TEST ]]; then test_zip="$zb"; prod_zip="$za"
  else bad "one TEST zip and one PROD zip"; return; fi
  ok "one TEST zip and one PROD zip"
  local dt="${DIR[$test_zip]}" dp="${DIR[$prod_zip]}"
  if [[ "${VERSION[$test_zip]}" == "${VERSION[$prod_zip]}" ]]; then ok "same version"; else bad "same version"; fi
  check "same commit and config_hash in build-info" jq -e -n --slurpfile a "$dt/build-info.json" --slurpfile b "$dp/build-info.json" \
    '$a[0].commit == $b[0].commit and $a[0].config_hash == $b[0].config_hash'

  local lt lp
  lt="$(cd "$dt" && find . -type f | LC_ALL=C sort)"
  lp="$(cd "$dp" && find . -type f | LC_ALL=C sort)"
  if [[ "$lt" == "$lp" ]]; then ok "same file list ($(wc -l <<<"$lt") files)"; else bad "same file list"; fi

  local f differing=() unexpected=0 same=0
  while IFS= read -r f; do
    f="${f#./}"
    [[ -f "$dp/$f" ]] || continue
    if cmp -s "$dt/$f" "$dp/$f"; then same=$((same + 1)); else differing+=("$f"); fi
  done <<<"$lt"
  for f in "${differing[@]}"; do
    case "$f" in
      manifest.json|tier.json|build-info.json) ;;
      logos/nist-logo-*.png) ;;
      *) unexpected=1; echo "        unexpected difference: ${f}" ;;
    esac
  done
  if (( unexpected == 0 )); then
    ok "only allowed files differ (${#differing[@]} differ, ${same} byte-identical): ${differing[*]:-none}"
  else
    bad "only allowed files differ"
  fi
  # Allowed files differ only in their allowed field.
  check "manifest.json differs only in name" jq -e -n --slurpfile a "$dt/manifest.json" --slurpfile b "$dp/manifest.json" \
    '($a[0] | del(.name)) == ($b[0] | del(.name))'
  check "build-info.json differs only in tier" jq -e -n --slurpfile a "$dt/build-info.json" --slurpfile b "$dp/build-info.json" \
    '($a[0] | del(.tier)) == ($b[0] | del(.tier))'
}

for z in "${zips[@]}"; do check_one "$z"; done
if (( ${#zips[@]} == 2 )); then check_pair "${zips[0]}" "${zips[1]}"; fi

echo
if (( fail == 0 )); then echo "check-store-zip: all checks passed"; else echo "check-store-zip: FAILED"; fi
exit "$fail"
