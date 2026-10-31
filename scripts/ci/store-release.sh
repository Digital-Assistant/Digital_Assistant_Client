#!/usr/bin/env bash
# Uploads a CI-built store zip to a Chrome Web Store item and submits it for review with
# STAGED_PUBLISH (the owner presses Publish in the dashboard). Never builds. Default is a dry run.
#
#   scripts/ci/store-release.sh --tier test|prod --version X.Y.Z.N --dir DIR [--dry-run]
#                               [--replace-pending] [--status-file F] [--test-status-file F]
#                               [--test-record-file F]
#   scripts/ci/store-release.sh --status --tier test|prod [--dry-run --status-file F [--test-status-file F]]
#
# DIR holds the client-zip artifact of a dev CI run: udan-extension-<v>.zip, -store-test.zip,
# -store-prod.zip, SHA256SUMS, build-info.json (scripts/ci/package-extension.sh --store).
# Called by .github/workflows/release-store.yml; run it locally the same way with --dry-run.
#
# Guards, all before any store write (a failed guard exits 1 and nothing is sent):
#   build   SHA256SUMS verifies; build-info.json version = --version, full commit, branch dev;
#           scripts/ci/check-store-zip.sh passes for the pair (no manifest "key", stamp matches the
#           name, "UDA TEST" name, no secret key name or value, version = manifest, only the allowed
#           files differ) with the keys this tier needs set; the tier stamp inside the chosen zip
#           equals --tier; the commit is on dev (GitHub compare); TEST and PROD zips have the same
#           bundle hash (every file except the allowed differences).
#   store   (read with fetchStatus) item not taken down; no upload in progress; --version greater
#           than every published and submitted version of the item; at most ONE pending submission
#           (PENDING_REVIEW or STAGED): a new one is refused unless --replace-pending, which calls
#           cancelSubmission first (loses the review queue position); the id derived from the item's
#           publicKey equals the item id.
#   prod    (tier prod only) promotion of exactly what TEST got: the newest successful real
#           "Store release test <version>" run of this workflow left a store-release-record with the
#           same version, commit, config_hash and bundle hash, and the TEST zip in this artifact has
#           the sha256 that run uploaded; and the TEST item's fetchStatus shows this version
#           PUBLISHED or STAGED. The smoke pass is attested by the reviewer's approval of the
#           `production` environment (owner Decision 2026-10-31); nothing else is stored.
# Real run (only in GitHub Actions, only without --dry-run): GitHub OIDC -> AWS role -> service
# account key from Secrets Manager (piped straight into store-helper.mjs, never in a variable or
# file) -> signed assertion -> access token (masked); fetchStatus, [cancelSubmission], :upload,
# poll fetchStatus until lastAsyncUploadState SUCCEEDED, re-check the publicKey id, :publish with
# publishType STAGED_PUBLISH and blockOnWarnings true, poll the submitted revision state.
#
# Dry run: every build guard, plus the prod promotion check against GitHub (a missing TEST
# release is a warning there, a mismatching one an error). No credential is read and no store API
# is called. The store guards run only when saved fetchStatus JSON is given (--status-file for the
# target item, --test-status-file for the TEST item; for tests and for checking a saved status).
# --test-record-file uses a saved store-release-record instead of looking one up on GitHub.
#
# --status (read-only; mutually exclusive with a release; needs no --version, --dir or build): answers
# "what is pending on this item right now, and would a new submission be accepted?" without trying an
# upload. Alone it is the live read: GitHub OIDC -> AWS role -> key from Secrets Manager -> access
# token (same path as the real run, GitHub Actions only), then ONLY `GET :fetchStatus` for the item
# of --tier (and, for tier prod, also the TEST item, as the promotion guard does; informational).
# It never calls :upload, :publish or cancelSubmission, nor any other write: api() asserts in code
# that, in status mode, the only call is GET :fetchStatus, and aborts (exit 70) otherwise. Prints a
# table with the item label (TEST or PROD, never an id), the submitted revision state, the submitted
# and published versions, and whether a new submission would now be ACCEPTED or REFUSED under the
# one-pending-submission rule (PENDING_REVIEW or STAGED = pending). With --dry-run it reads no
# credential and calls no store API: it evaluates saved fetchStatus JSON (--status-file for the
# item of the tier, --test-status-file for the TEST item of tier prod), for tests and for a saved
# status. Version rules (the new version must be greater) need a build, so they stay with the real
# run; the table prints the highest version the item already has.
#
# Exit codes
#   0  release or dry run passed; with --status: the item has no pending submission, so a new one
#      would be accepted
#   1  refused: a guard failed, the store said no, or (--status) the item is taken down, an upload
#      is in progress, the publicKey does not match the item id, or fetchStatus could not be read
#   2  usage error, or a required tool is missing
#   3  --status only: the item has a pending submission (PENDING_REVIEW or STAGED): a new submission
#      is refused unless replace_pending=true (cancels it, loses the review queue position)
#   70 internal assertion: status mode was about to make a call other than GET :fetchStatus
#
# Public repo, public logs: prints booleans, versions, states, hashes and the public PROD item id.
# Never prints a token, a key, a response body of an auth call, or the TEST item id (unlisted).
# Writes DIR/store-release-record.json (no ids, no secrets) for the workflow to keep.
#
# Env:
#   GITHUB_REPOSITORY, GH_TOKEN (gh: actions read, contents read); CI_BRANCH (default dev);
#   GITHUB_REF (if set, must be refs/heads/<CI_BRANCH>);
#   CWS_PUBLISHER_ID, CWS_TEST_ITEM_ID, CWS_PROD_ITEM_ID   (variables, not secrets; real run needs them);
#   real run only: STORE_AWS_ROLE_ARN, AWS_REGION, STORE_KEY_SECRET_ID, and the job's OIDC request
#   variables (permission id-token: write);
#   STORE_POLL_SECONDS (default 10), STORE_POLL_TRIES (default 30).
# Needs: jq, unzip, sha256sum, node, gh; real run also curl and the aws CLI.
set -euo pipefail

PROD_ITEM_ID_CONTRACT=jejdickefnhgkhdcjjcmoiiljlkanpln   # public store id (PLAN-STORE-PHASES contract)
STORE_API=https://chromewebstore.googleapis.com
TOKEN_URL=https://oauth2.googleapis.com/token
RELEASE_WORKFLOW=release-store.yml
RECORD_ARTIFACT=store-release-record
here="$(cd "$(dirname "$0")" && pwd)"
HELPER="${here}/store-helper.mjs"

usage() { sed -n '5,9p' "$0" | sed 's/^# \{0,1\}//' >&2; exit 2; }

tier="" version="" dir="" dry_run="" replace_pending="" status_file="" test_status_file="" test_record_file="" status_mode=""
while (( $# )); do
  case "$1" in
    --tier) tier="${2:-}"; shift 2 ;;
    --version) version="${2:-}"; shift 2 ;;
    --dir) dir="${2:-}"; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    --status) status_mode=1; shift ;;
    --replace-pending) replace_pending=1; shift ;;
    --status-file) status_file="${2:-}"; shift 2 ;;
    --test-status-file) test_status_file="${2:-}"; shift 2 ;;
    --test-record-file) test_record_file="${2:-}"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; usage ;;
  esac
done

BRANCH="${CI_BRANCH:-dev}"
POLL_SECONDS="${STORE_POLL_SECONDS:-10}"
POLL_TRIES="${STORE_POLL_TRIES:-30}"

refuse() { echo "REFUSED: $*" >&2; echo "::error::store-release refused: $*" >&2; exit 1; }
ok() { echo "  pass  $*"; }
note() { echo "  info  $*"; }
is_true() { [[ -n "$1" ]] && echo true || echo false; }
# Only GitHub hides ::add-mask:: values; outside Actions the line would print the value itself.
mask() { [[ "${GITHUB_ACTIONS:-}" == true && -n "$1" ]] && echo "::add-mask::$1"; return 0; }

[[ "$tier" == test || "$tier" == prod ]] || { echo "--tier must be test or prod" >&2; usage; }
if [[ -n "$status_mode" ]]; then
  # Read-only status: mutually exclusive with everything that belongs to a release.
  if [[ -n "$version" || -n "$dir" || -n "$replace_pending" || -n "$test_record_file" ]]; then
    echo "--status is read-only and cannot be combined with --version, --dir, --replace-pending or --test-record-file" >&2; usage
  fi
  if [[ -n "$dry_run" && -z "$status_file" ]]; then
    echo "--status --dry-run evaluates saved fetchStatus JSON: give --status-file" >&2; usage
  fi
else
  [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "--version must be X.Y.Z.N, got '${version}'" >&2; usage; }
  for p in ${version//./ }; do (( 10#$p <= 65535 )) || { echo "--version part ${p} is above 65535" >&2; usage; }; done
  [[ -d "$dir" ]] || { echo "--dir must be the directory with the client-zip artifact" >&2; usage; }
fi
if [[ -z "$dry_run" && ( -n "$status_file" || -n "$test_status_file" || -n "$test_record_file" ) ]]; then
  echo "--status-file, --test-status-file and --test-record-file are for --dry-run only" >&2; usage
fi
need_tools=(jq node)
[[ -n "$status_mode" ]] || need_tools+=(unzip sha256sum)
for t in "${need_tools[@]}"; do command -v "$t" >/dev/null || { echo "$t is required" >&2; exit 2; }; done

TIER="${tier^^}"
[[ -n "$status_mode" ]] || dir="$(cd "$dir" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
RESP="${tmp}/resp.json"

# 1 if version a > version b (X.Y.Z.N, numeric per part).
version_gt() {
  local IFS=. i
  local -a a b
  read -r -a a <<<"$1"; read -r -a b <<<"$2"
  for i in 0 1 2 3; do
    (( 10#${a[i]:-0} > 10#${b[i]:-0} )) && return 0
    (( 10#${a[i]:-0} < 10#${b[i]:-0} )) && return 1
  done
  return 1
}

# Hash of what the user runs: every file except the ones allowed to differ between the TEST and
# PROD zips; manifest.json and build-info.json enter without their allowed field (name, tier).
bundle_hash() {
  local zip="$1" d
  d="$(mktemp -d -p "$tmp")"
  unzip -q "$zip" -d "$d"
  (
    cd "$d"
    find . -type f ! -path ./manifest.json ! -path ./tier.json ! -path ./build-info.json \
      ! -path './logos/nist-logo-*.png' -print0 | LC_ALL=C sort -z | xargs -0 -r sha256sum
    echo "manifest $(jq -S -c 'del(.name)' manifest.json | sha256sum | cut -d' ' -f1)"
    echo "build-info $(jq -S -c 'del(.tier)' build-info.json | sha256sum | cut -d' ' -f1)"
  ) | sha256sum | cut -d' ' -f1
}

# Highest version (published or submitted) in a fetchStatus JSON, empty when none.
highest_version() { # <fetchStatus.json>
  local v max=""
  while read -r v; do
    [[ -z "$v" ]] && continue
    if [[ -z "$max" ]] || version_gt "$v" "$max"; then max="$v"; fi
  done < <(jq -r '[.publishedItemRevisionStatus, .submittedItemRevisionStatus] | .[]? | .distributionChannels[]? | .crxVersion // empty' "$1")
  printf '%s' "$max"
}

# Publisher and item ids (variables, not secrets); validates them and sets the target item.
publisher="" test_item="" prod_item="" item="" item_label=""
load_items() {
  local id_re='^[a-p]{32}$'
  publisher="${CWS_PUBLISHER_ID:-}"
  test_item="${CWS_TEST_ITEM_ID:-}"
  prod_item="${CWS_PROD_ITEM_ID:-}"
  if [[ -n "$prod_item" ]]; then
    [[ "$prod_item" == "$PROD_ITEM_ID_CONTRACT" ]] || refuse "CWS_PROD_ITEM_ID is not the PROD store item ${PROD_ITEM_ID_CONTRACT}"
  fi
  if [[ -n "$test_item" ]]; then
    [[ "$test_item" =~ $id_re ]] || refuse "CWS_TEST_ITEM_ID is not a 32-letter item id"
    [[ "$test_item" != "$PROD_ITEM_ID_CONTRACT" ]] || refuse "CWS_TEST_ITEM_ID is the PROD item"
    mask "$test_item"
  fi
  [[ -z "$publisher" ]] || [[ "$publisher" =~ ^[A-Za-z0-9-]{8,64}$ ]] || refuse "CWS_PUBLISHER_ID does not look like a publisher id"
  if [[ "$tier" == prod ]]; then item="$prod_item"; item_label="PROD ${PROD_ITEM_ID_CONTRACT}"; else item="$test_item"; item_label="TEST (id not printed)"; fi
  note "target item ${item_label}; set: publisher=$(is_true "$publisher") test_item=$(is_true "$test_item") prod_item=$(is_true "$prod_item")"
}

# GitHub OIDC -> AWS role -> service account key (piped, never stored) -> signed assertion -> access
# token in ACCESS_TOKEN (masked). Shared by the real run and --status; callers check the variables.
ACCESS_TOKEN=""
get_access_token() {
  local oidc creds assertion code err
  for t in curl aws; do command -v "$t" >/dev/null || refuse "$t is required"; done
  oidc="$(curl -fsS -H @<(printf 'Authorization: bearer %s\n' "$ACTIONS_ID_TOKEN_REQUEST_TOKEN") \
    "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=sts.amazonaws.com" 2>/dev/null | jq -r '.value // empty')" || true
  [[ -n "$oidc" ]] || refuse "could not get the GitHub OIDC token"
  mask "$oidc"
  creds="$(aws sts assume-role-with-web-identity --region "$AWS_REGION" --role-arn "$STORE_AWS_ROLE_ARN" \
    --role-session-name "cws-release-${GITHUB_RUN_ID:-0}" --web-identity-token "$oidc" --duration-seconds 900 \
    --output json 2>/dev/null)" || refuse "could not assume the store AWS role (check its trust for this environment)"
  AWS_ACCESS_KEY_ID="$(jq -r '.Credentials.AccessKeyId' <<<"$creds")"
  AWS_SECRET_ACCESS_KEY="$(jq -r '.Credentials.SecretAccessKey' <<<"$creds")"
  AWS_SESSION_TOKEN="$(jq -r '.Credentials.SessionToken' <<<"$creds")"
  mask "$AWS_SECRET_ACCESS_KEY"; mask "$AWS_SESSION_TOKEN"
  export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
  ok "AWS role assumed"
  # The key goes from the AWS CLI straight into the helper's stdin: never a variable, file or argument.
  assertion="$(aws secretsmanager get-secret-value --region "$AWS_REGION" --secret-id "$STORE_KEY_SECRET_ID" \
    --query SecretString --output text 2>/dev/null | node "$HELPER" assertion)" || refuse "could not read the service account key or sign with it"
  mask "$assertion"
  code="$(curl -sS -o "$RESP" -w '%{http_code}' --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
    --data-urlencode 'assertion@-' "$TOKEN_URL" <<<"$assertion" 2>/dev/null)" || code=000
  if [[ "$code" != 200 ]]; then
    # Only the OAuth error code (e.g. invalid_grant); never the body.
    err="$(jq -r '.error // "unknown"' "$RESP" 2>/dev/null || echo unknown)"; rm -f "$RESP"
    refuse "token exchange failed: HTTP ${code}, error ${err}"
  fi
  ACCESS_TOKEN="$(jq -r '.access_token // empty' "$RESP")"; rm -f "$RESP"
  [[ -n "$ACCESS_TOKEN" ]] || refuse "token exchange returned no access token"
  mask "$ACCESS_TOKEN"
  unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
  ok "store access token obtained (masked)"
}

api() { # api <METHOD> <path after /v2/publishers/<pub>/items/<item>> <item> [--upload FILE | --json BODY]; body in $RESP, code on stdout
  # Read-only guarantee of --status, enforced here (the only function that talks to the store API):
  # in status mode nothing but GET :fetchStatus gets through; anything else is a bug, never a request.
  if [[ -n "$status_mode" ]] && ! [[ "$1" == GET && "$2" == :fetchStatus && $# -eq 3 ]]; then
    echo "internal assertion: status mode may only GET :fetchStatus (asked for ${1:-?} ${2:-?}); nothing was sent" >&2
    echo "::error::store-release --status tried a non-read call; nothing was sent" >&2
    exit 70
  fi
  local method="$1" action="$2" it="$3" base="${STORE_API}/v2"; shift 3
  local -a extra=()
  case "${1:-}" in
    --upload) base="${STORE_API}/upload/v2"; extra=(-T "$2") ;;
    --json) extra=(-H 'Content-Type: application/json' --data "$2") ;;
  esac
  curl -sS -X "$method" -o "$RESP" -w '%{http_code}' -H @<(printf 'Authorization: Bearer %s\n' "$ACCESS_TOKEN") \
    "${extra[@]}" "${base}/publishers/${publisher}/items/${it}${action}" 2>/dev/null || echo 000
}
api_fail() { # api_fail <what> <code>
  local detail
  detail="$(jq -r '[.error.status // empty, .error.message // empty, (.error.details[]? | .. | .reason? // empty)] | map(tostring) | join("; ")' "$RESP" 2>/dev/null || true)"
  refuse "$1 failed: HTTP $2${detail:+ (${detail})}"
}
fetch_status() { # fetch_status <item> <out file>
  local c; c="$(api GET :fetchStatus "$1")"
  [[ "$c" == 200 ]] || api_fail fetchStatus "$c"
  cp "$RESP" "$2"
}

# ---------------------------------------------------------------- --status (read-only)
STATUS_EXIT_PENDING=3
# One table row for a fetchStatus JSON. Sets ROW_VERDICT to ACCEPTED, PENDING or REFUSED.
status_row() { # <label> <fetchStatus.json> <full id check: true|false>
  local label="$1" s="$2" must="$3" st sv pv down up derived why="" key
  jq -e 'type == "object"' "$s" >/dev/null 2>&1 || refuse "fetchStatus of ${label} is not a JSON object"
  st="$(jq -r '.submittedItemRevisionStatus.state // "none"' "$s")"
  sv="$(jq -r '[.submittedItemRevisionStatus.distributionChannels[]?.crxVersion // empty] | join(",") | if . == "" then "none" else . end' "$s")"
  pv="$(jq -r '[.publishedItemRevisionStatus.distributionChannels[]?.crxVersion // empty] | join(",") | if . == "" then "none" else . end' "$s")"
  down="$(jq -r '.takenDown // false' "$s")"
  up="$(jq -r '.lastAsyncUploadState // "none"' "$s")"
  ROW_VERDICT=ACCEPTED
  if [[ "$down" == true ]]; then ROW_VERDICT=REFUSED; why="the item is taken down"
  elif [[ "$up" == IN_PROGRESS ]]; then ROW_VERDICT=REFUSED; why="an upload is still in progress"
  elif [[ "$st" == PENDING_REVIEW || "$st" == STAGED ]]; then
    ROW_VERDICT=PENDING; why="pending submission (${st}); replace_pending=true cancels it and loses the review queue position"
  fi
  key="$(jq -r '.publicKey // empty' "$s")"
  derived=""
  [[ -z "$key" ]] || derived="$(node "$HELPER" extension-id <<<"$key" 2>/dev/null || true)"
  ROW_ID_MATCH=n/a
  if [[ -n "$derived" ]]; then
    if [[ "$label" == PROD ]]; then [[ "$derived" == "$PROD_ITEM_ID_CONTRACT" ]] && ROW_ID_MATCH=true || ROW_ID_MATCH=false
    elif [[ -n "$test_item" ]]; then [[ "$derived" == "$test_item" ]] && ROW_ID_MATCH=true || ROW_ID_MATCH=false
    fi
  fi
  if [[ "$must" == true && "$ROW_ID_MATCH" == false ]]; then ROW_VERDICT=REFUSED; why="the id derived from the item's publicKey does not match the item id"; fi
  [[ "$must" != true || -n "$key" ]] || { ROW_VERDICT=REFUSED; why="fetchStatus has no publicKey for the item"; }
  printf '  %-5s %-15s %-16s %-16s %-9s %s\n' "$label" "$st" "$sv" "$pv" "$ROW_VERDICT" "${why:-a new submission would be accepted}"
  ROW_WHY="$why"; ROW_HIGHEST="$(highest_version "$s")"
}

run_status() {
  local label="$TIER" f="" tf="" rc=0
  echo "== store status (read-only: nothing is uploaded, submitted or cancelled)"
  load_items
  if [[ -n "$dry_run" ]]; then
    note "dry run: evaluating saved fetchStatus JSON; no credential read, no store call"
    f="$status_file"; tf="$test_status_file"
  else
    [[ "${GITHUB_ACTIONS:-}" == true ]] || refuse "a live status read happens only in GitHub Actions (use --status --dry-run --status-file locally)"
    local missing=() v needed=(CWS_PUBLISHER_ID STORE_AWS_ROLE_ARN AWS_REGION STORE_KEY_SECRET_ID ACTIONS_ID_TOKEN_REQUEST_URL ACTIONS_ID_TOKEN_REQUEST_TOKEN)
    [[ "$tier" == prod ]] && needed+=(CWS_PROD_ITEM_ID CWS_TEST_ITEM_ID) || needed+=(CWS_TEST_ITEM_ID)
    for v in "${needed[@]}"; do [[ -n "${!v:-}" ]] || missing+=("$v"); done
    (( ${#missing[@]} == 0 )) || refuse "not set: ${missing[*]} (variables of the environment or the repository; OIDC needs id-token: write)"
    echo "== credentials"
    get_access_token
    f="${tmp}/status.json"; fetch_status "$item" "$f"
    if [[ "$tier" == prod ]]; then tf="${tmp}/test-status.json"; fetch_status "$test_item" "$tf"; fi
  fi
  printf '  %-5s %-15s %-16s %-16s %-9s %s\n' item "submitted state" "submitted ver." "published ver." verdict "new submission"
  status_row "$label" "$f" true
  local verdict="$ROW_VERDICT" why="$ROW_WHY" highest="$ROW_HIGHEST"
  if [[ "$tier" == prod && -n "$tf" ]]; then
    status_row TEST "$tf" false
    note "TEST row is informational (promotion needs the TEST item to show the release version PUBLISHED or STAGED); id matches item: ${ROW_ID_MATCH}"
  fi
  note "highest version the ${TIER} item already has (published or submitted): ${highest:-none}; a new version must be greater"
  case "$verdict" in
    ACCEPTED) echo "Status: a new submission to the ${TIER} item would be ACCEPTED (no pending submission)." ;;
    PENDING) echo "Status: a new submission to the ${TIER} item would be REFUSED: ${why}."; rc=$STATUS_EXIT_PENDING ;;
    *) echo "REFUSED: ${why}" >&2; echo "::error::store-release --status: ${why}" >&2; rc=1 ;;
  esac
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    {
      echo "### Store status ${TIER}$( [[ -n "$dry_run" ]] && echo ' (saved status, no store call)' )"
      echo "- New submission: **${verdict}**${why:+ (${why})}"
      echo "- Highest version already on the item: \`${highest:-none}\`"
      echo "- Read-only: only \`fetchStatus\` was called; no upload, no submission, no cancel."
    } >>"$GITHUB_STEP_SUMMARY"
  fi
  exit "$rc"
}
[[ -z "$status_mode" ]] || run_status

echo "Store release: tier ${TIER}, version ${version}, $( [[ -n "$dry_run" ]] && echo 'DRY RUN (no credential, no store call)' || echo 'REAL RUN' )"

# ---------------------------------------------------------------- build guards
echo "== build"
if [[ -n "${GITHUB_REF:-}" ]]; then
  [[ "$GITHUB_REF" == "refs/heads/${BRANCH}" ]] || refuse "runs only on ${BRANCH}, not ${GITHUB_REF}"
  ok "workflow runs on ${BRANCH}"
fi
[[ -f "$dir/SHA256SUMS" && -f "$dir/build-info.json" ]] || refuse "${dir} must hold SHA256SUMS and build-info.json"
(cd "$dir" && sha256sum --check --strict --quiet SHA256SUMS) || refuse "SHA256SUMS does not match the files"
ok "SHA256SUMS verifies"
zip_test="udan-extension-${version}-store-test.zip"
zip_prod="udan-extension-${version}-store-prod.zip"
zip_name="udan-extension-${version}-store-${tier}.zip"
for z in "$zip_test" "$zip_prod"; do
  [[ -f "$dir/$z" ]] || refuse "${z} is not in the artifact"
  grep -qE "  ${z//./\\.}\$" "$dir/SHA256SUMS" || refuse "SHA256SUMS does not list ${z}"
done
ok "both store zips are in the artifact and in SHA256SUMS"

bi="$dir/build-info.json"
[[ "$(jq -r '.version' "$bi")" == "$version" ]] || refuse "build-info.json version is not ${version}"
commit="$(jq -r '.commit' "$bi")"
[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || refuse "build-info.json commit is not a full commit id"
[[ "$(jq -r '.branch' "$bi")" == "$BRANCH" ]] || refuse "the build was made on '$(jq -r '.branch' "$bi")', not ${BRANCH}"
config_hash="$(jq -r '.config_hash // empty' "$bi")"
[[ -n "$config_hash" ]] || refuse "build-info.json has no config_hash (build older than build identities)"
ok "build-info.json: version ${version}, commit ${commit:0:12}, branch ${BRANCH}, config_hash ${config_hash}"

if [[ "$tier" == prod ]]; then
  required_keys=baseProdURL,keycloakProdUrl,keycloakRealm,keycloakPublicClientId
else
  required_keys=baseTestURL,keycloakTestUrl,keycloakRealm,keycloakPublicClientId
fi
echo "-- check-store-zip.sh (pair, required keys ${required_keys})"
"$here/check-store-zip.sh" --require-keys "$required_keys" "$dir/$zip_test" "$dir/$zip_prod" \
  || refuse "check-store-zip.sh failed on the pair"
[[ "$(unzip -p "$dir/$zip_name" tier.json | jq -r '.tier')" == "$TIER" ]] || refuse "the tier stamp in ${zip_name} is not ${TIER}"
ok "tier stamp in ${zip_name} is ${TIER}"
unzip -p "$dir/$zip_name" manifest.json | jq -e 'has("key") | not' >/dev/null || refuse "${zip_name} has a manifest key"
ok "${zip_name} has no manifest key"
[[ "$(unzip -p "$dir/$zip_name" manifest.json | jq -r '.version')" == "$version" ]] || refuse "manifest version in ${zip_name} is not ${version}"

: "${GITHUB_REPOSITORY:?set GITHUB_REPOSITORY=<owner>/<repo>}"
compare="$(gh api "repos/${GITHUB_REPOSITORY}/compare/${BRANCH}...${commit}" 2>/dev/null | jq -r '.status' 2>/dev/null || true)"
[[ "$compare" == behind || "$compare" == identical ]] || refuse "commit ${commit:0:12} is not on ${BRANCH} (compare: ${compare:-not found})"
ok "commit ${commit:0:12} is on ${BRANCH}"

hash_test="$(bundle_hash "$dir/$zip_test")"
hash_prod="$(bundle_hash "$dir/$zip_prod")"
[[ "$hash_test" == "$hash_prod" ]] || refuse "the TEST and PROD zips do not carry the same bundle"
bundle="$hash_test"
zip_sha="$(sha256sum "$dir/$zip_name" | cut -d' ' -f1)"
test_zip_sha="$(sha256sum "$dir/$zip_test" | cut -d' ' -f1)"
ok "TEST and PROD zips carry the same bundle (bundle hash ${bundle})"
note "zip ${zip_name}, sha256 ${zip_sha}, $(stat -c %s "$dir/$zip_name") bytes"
note "permissions: $(unzip -p "$dir/$zip_name" manifest.json | jq -c '{permissions: (.permissions // []), host_permissions: (.host_permissions // []), content_script_matches: ([.content_scripts[]?.matches[]?] | unique)}')"

# ---------------------------------------------------------------- items
echo "== items"
load_items

# ---------------------------------------------------------------- store-state guards (pure, on fetchStatus JSON)
pending_state() { jq -r '.submittedItemRevisionStatus.state // empty' "$1"; }

check_store_state() { # check_store_state <fetchStatus.json> <item id or empty>
  local s="$1" want_id="$2" st max derived
  jq -e 'type == "object"' "$s" >/dev/null 2>&1 || refuse "fetchStatus is not a JSON object"
  [[ "$(jq -r '.takenDown // false' "$s")" != true ]] || refuse "the item is taken down"
  ok "item not taken down (warned: $(jq -r '.warned // false' "$s"))"
  [[ "$(jq -r '.lastAsyncUploadState // empty' "$s")" != IN_PROGRESS ]] || refuse "an upload to the item is still in progress"
  ok "no upload in progress"
  max="$(highest_version "$s")"
  if [[ -n "$max" ]]; then
    version_gt "$version" "$max" || refuse "version ${version} is not greater than ${max}, which the item already has (published or submitted)"
    ok "version ${version} is greater than the item's highest published/submitted version ${max}"
  else
    ok "the item has no published or submitted version yet"
  fi
  st="$(pending_state "$s")"
  if [[ "$st" == PENDING_REVIEW || "$st" == STAGED ]]; then
    [[ -n "$replace_pending" ]] || refuse "the item already has a pending submission (${st}); at most one per item. Wait for it, or rerun with replace_pending=true (cancels it and loses the queue position)"
    note "pending submission (${st}) will be cancelled first (replace_pending=true)"
  else
    ok "no pending submission (submitted state: ${st:-none})"
  fi
  derived="$(jq -r '.publicKey // empty' "$s")"
  [[ -n "$derived" ]] || refuse "fetchStatus has no publicKey for the item"
  derived="$(node "$HELPER" extension-id <<<"$derived")" || refuse "the item's publicKey is not a valid key"
  if [[ -n "$want_id" ]]; then
    [[ "$derived" == "$want_id" ]] || refuse "the id derived from the item's publicKey does not match the item id"
    ok "the id derived from the item's publicKey matches the item"
  elif [[ "$tier" == prod ]]; then
    [[ "$derived" == "$PROD_ITEM_ID_CONTRACT" ]] || refuse "the id derived from the publicKey is not the PROD item"
    ok "the id derived from the publicKey is the PROD item"
  else
    note "publicKey id check skipped: CWS_TEST_ITEM_ID not set (dry run)"
  fi
}

check_test_item_has_version() { # <TEST item fetchStatus.json>
  local s="$1"
  if jq -e --arg v "$version" '
      ((.publishedItemRevisionStatus.state // "") == "PUBLISHED" and ([.publishedItemRevisionStatus.distributionChannels[]?.crxVersion] | index($v)) != null)
      or ((.submittedItemRevisionStatus.state // "") == "STAGED" and ([.submittedItemRevisionStatus.distributionChannels[]?.crxVersion] | index($v)) != null)' "$s" >/dev/null 2>&1; then
    ok "the TEST item shows ${version} as PUBLISHED or STAGED"
  else
    refuse "the TEST item does not show ${version} as PUBLISHED or STAGED (published: $(jq -r '.publishedItemRevisionStatus.state // "none"' "$s"), submitted: $(jq -r '.submittedItemRevisionStatus.state // "none"' "$s"))"
  fi
}

# Compares a store-release-record of a TEST run with this artifact.
check_test_record() { # <record.json>
  local r="$1"
  jq -e --arg v "$version" --arg c "$commit" --arg h "$config_hash" --arg b "$bundle" --arg z "$test_zip_sha" '
      .tier == "TEST" and .dry_run == false and .version == $v and .commit == $c and .config_hash == $h
      and .bundle_hash == $b and .zip_sha256 == $z and .upload_state == "SUCCEEDED"
      and ((.submitted_state // "") | IN("PENDING_REVIEW", "STAGED", "PUBLISHED"))' "$r" >/dev/null 2>&1 \
    || refuse "the TEST release record for ${version} does not match this build (version, commit, config_hash, bundle hash, TEST zip sha256, upload SUCCEEDED, submitted)"
  if [[ -n "$test_item" ]]; then
    [[ "$(jq -r '.item_id_sha256 // empty' "$r")" == "$(printf '%s' "$test_item" | sha256sum | cut -d' ' -f1)" ]] \
      || refuse "the TEST release record was for another item"
  fi
  ok "the TEST release run for ${version} uploaded this exact bundle (TEST zip sha256 ${test_zip_sha})"
}

# Finds the newest successful real TEST release run of this version and downloads its record.
# 0 found (record at $1), 1 none.
find_test_record() { # <output file>
  local out="$1" runs id d
  runs="$(gh api "repos/${GITHUB_REPOSITORY}/actions/workflows/${RELEASE_WORKFLOW}/runs?branch=${BRANCH}&event=workflow_dispatch&status=success&per_page=100" 2>/dev/null)" \
    || refuse "could not list ${RELEASE_WORKFLOW} runs"
  id="$(jq -r --arg t "Store release test ${version}" '[.workflow_runs[]? | select(.display_title == $t)] | sort_by(.run_number) | last | .id // empty' <<<"$runs")"
  [[ -n "$id" ]] || return 1
  d="$(mktemp -d -p "$tmp")"
  gh run download "$id" --repo "$GITHUB_REPOSITORY" --name "$RECORD_ARTIFACT" --dir "$d" >/dev/null 2>&1 \
    || refuse "TEST release run ${id} has no ${RECORD_ARTIFACT} artifact (expired after 90 days, or the run did not finish)"
  [[ -f "$d/store-release-record.json" ]] || refuse "TEST release run ${id}: artifact without store-release-record.json"
  cp "$d/store-release-record.json" "$out"
  note "TEST release run ${id}"
  return 0
}

if [[ "$tier" == prod ]]; then
  echo "== promotion (same bundle as TEST)"
  rec="${tmp}/test-record.json"
  if [[ -n "$test_record_file" ]]; then
    cp "$test_record_file" "$rec"; check_test_record "$rec"
  elif find_test_record "$rec"; then
    check_test_record "$rec"
  elif [[ -n "$dry_run" ]]; then
    echo "::warning::no successful real TEST release run for ${version} yet: the real PROD run will refuse"
    note "TEST release run for ${version} found: false (the real run refuses)"
  else
    refuse "no successful real TEST release run (\"Store release test ${version}\") exists: release the same version to TEST first"
  fi
  if [[ -n "$test_status_file" ]]; then check_test_item_has_version "$test_status_file"; fi
fi

record() { # record <upload state> <submitted state>
  jq -n --arg tier "$TIER" --argjson dry "$( [[ -n "$dry_run" ]] && echo true || echo false )" --arg v "$version" \
    --arg c "$commit" --arg h "$config_hash" --arg b "$bundle" --arg z "$zip_sha" --arg zn "$zip_name" \
    --arg u "$1" --arg s "$2" --arg run "${GITHUB_RUN_ID:-local}" \
    --arg iid "$( [[ -n "$item" ]] && printf '%s' "$item" | sha256sum | cut -d' ' -f1 )" \
    '{tier: $tier, dry_run: $dry, version: $v, commit: $c, config_hash: $h, bundle_hash: $b, zip: $zn,
      zip_sha256: $z, item_id_sha256: $iid, upload_state: $u, submitted_state: $s, run_id: $run}' \
    >"$dir/store-release-record.json"
}

summary() { # summary <lines...>
  [[ -n "${GITHUB_STEP_SUMMARY:-}" ]] || return 0
  {
    echo "### Store release ${TIER} \`${version}\`$( [[ -n "$dry_run" ]] && echo ' (dry run)' )"
    echo "- Item: ${item_label}"
    echo "- Zip: \`${zip_name}\`, SHA256 \`${zip_sha}\`"
    echo "- Bundle hash: \`${bundle}\`"
    echo "- Commit: \`${commit}\`"
    local l; for l in "$@"; do echo "- $l"; done
  } >>"$GITHUB_STEP_SUMMARY"
}

if [[ -n "$dry_run" ]]; then
  echo "== store (dry run: no call)"
  if [[ -n "$status_file" ]]; then
    check_store_state "$status_file" "$item"
  else
    note "store guards (version, one pending submission, publicKey id) run in the real run before any upload"
  fi
  if [[ "$tier" == prod && -z "$test_status_file" ]]; then
    note "TEST item check (version PUBLISHED or STAGED) runs in the real run"
  fi
  record "" ""
  echo "Dry run passed. Would call: fetchStatus$( [[ "$tier" == prod ]] && echo ' (both items)' ), $( [[ -n "$replace_pending" ]] && echo 'cancelSubmission if pending, ' ):upload ${zip_name}, poll fetchStatus until SUCCEEDED, :publish with publishType=STAGED_PUBLISH and blockOnWarnings=true."
  summary "**Dry run: no credential read, no store call.** Would upload and submit with STAGED_PUBLISH."
  exit 0
fi

# ---------------------------------------------------------------- real run
[[ "${GITHUB_ACTIONS:-}" == true ]] || refuse "a real run happens only in GitHub Actions (use --dry-run locally)"
missing=()
for v in CWS_PUBLISHER_ID CWS_TEST_ITEM_ID CWS_PROD_ITEM_ID STORE_AWS_ROLE_ARN AWS_REGION STORE_KEY_SECRET_ID ACTIONS_ID_TOKEN_REQUEST_URL ACTIONS_ID_TOKEN_REQUEST_TOKEN; do
  [[ -n "${!v:-}" ]] || missing+=("$v")
done
(( ${#missing[@]} == 0 )) || refuse "not set: ${missing[*]} (variables of the environment or the repository; OIDC needs id-token: write)"
echo "== credentials"
get_access_token

echo "== store state"
st_file="${tmp}/status.json"
fetch_status "$item" "$st_file"
check_store_state "$st_file" "$item"
if [[ "$tier" == prod ]]; then
  fetch_status "$test_item" "${tmp}/test-status.json"
  check_test_item_has_version "${tmp}/test-status.json"
fi
pend="$(pending_state "$st_file")"
if [[ ( "$pend" == PENDING_REVIEW || "$pend" == STAGED ) && -n "$replace_pending" ]]; then
  c="$(api POST :cancelSubmission "$item")"
  [[ "$c" == 200 ]] || api_fail cancelSubmission "$c"
  fetch_status "$item" "$st_file"
  pend="$(pending_state "$st_file")"
  [[ "$pend" != PENDING_REVIEW && "$pend" != STAGED ]] || refuse "the pending submission is still ${pend} after cancelSubmission"
  ok "pending submission cancelled (now: ${pend:-none})"
fi

echo "== upload"
c="$(api POST :upload "$item" --upload "$dir/$zip_name")"
[[ "$c" == 200 ]] || api_fail upload "$c"
up_state="$(jq -r '.uploadState // empty' "$RESP")"
up_version="$(jq -r '.crxVersion // empty' "$RESP")"
note "upload answered: ${up_state:-no state}"
if [[ "$up_state" != SUCCEEDED ]]; then
  [[ "$up_state" != FAILED ]] || api_fail upload "200, state FAILED"
  for (( i = 1; i <= POLL_TRIES; i++ )); do
    sleep "$POLL_SECONDS"
    fetch_status "$item" "$st_file"
    up_state="$(jq -r '.lastAsyncUploadState // empty' "$st_file")"
    note "poll ${i}: upload ${up_state:-no state}"
    [[ "$up_state" == SUCCEEDED || "$up_state" == FAILED || "$up_state" == NOT_FOUND ]] && break
  done
fi
[[ "$up_state" == SUCCEEDED ]] || refuse "the upload did not succeed (state: ${up_state:-unknown})"
[[ -z "$up_version" || "$up_version" == "$version" ]] || refuse "the store read version ${up_version} from the package, not ${version}"
ok "upload SUCCEEDED"
fetch_status "$item" "$st_file"
derived="$(node "$HELPER" extension-id <<<"$(jq -r '.publicKey // empty' "$st_file")")" || refuse "no valid publicKey after upload"
[[ "$derived" == "$item" ]] || refuse "after the upload, the id derived from the publicKey does not match the item"
ok "the id derived from the publicKey still matches the item"

echo "== submit (STAGED_PUBLISH)"
c="$(api POST :publish "$item" --json '{"publishType":"STAGED_PUBLISH","blockOnWarnings":true}')"
[[ "$c" == 200 ]] || api_fail publish "$c"
sub_state="$(jq -r '.state // empty' "$RESP")"
while read -r w; do [[ -n "$w" ]] && echo "::warning::store warning: ${w}"; done < <(jq -r '.warningInfo.warnings[]? | "\(.reason // ""): \(.description // "")"' "$RESP")
for (( i = 1; i <= 6; i++ )); do
  fetch_status "$item" "$st_file"
  s="$(jq -r --arg v "$version" 'if ([.submittedItemRevisionStatus.distributionChannels[]?.crxVersion] | index($v)) != null then .submittedItemRevisionStatus.state // empty else empty end' "$st_file")"
  [[ -n "$s" ]] && { sub_state="$s"; break; }
  sleep "$POLL_SECONDS"
done
[[ "$sub_state" == PENDING_REVIEW || "$sub_state" == STAGED || "$sub_state" == PUBLISHED ]] \
  || refuse "submitted, but the revision state is '${sub_state:-unknown}'"
ok "submitted: state ${sub_state}"
record SUCCEEDED "$sub_state"
published="$(jq -r '[.publishedItemRevisionStatus.distributionChannels[]? | "\(.crxVersion) at \(.deployPercentage)%"] | join(", ")' "$st_file")"
next="Google reviews it (days to weeks); when it is STAGED the owner presses Publish in the dashboard within 30 days."
[[ "$sub_state" == STAGED ]] && next="Approved and STAGED: the owner presses Publish in the dashboard within 30 days."
summary "Submitted revision state: \`${sub_state}\`" "Published now: ${published:-none}" "**${next}**"
echo "Done: ${version} submitted to the ${TIER} item, state ${sub_state}. ${next}"
