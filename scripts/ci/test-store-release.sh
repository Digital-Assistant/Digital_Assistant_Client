#!/usr/bin/env bash
# Tests scripts/ci/store-release.sh offline: a fixture build (package-extension.sh --store on a tiny
# dist/, no npm build) and stub `gh`, `curl` and `aws` on PATH. No network, no store call, no real
# credential: the "service account key" is a throw-away RSA key made here and deleted at the end.
# Covers the read-only --status mode (accepted, refused for PENDING_REVIEW and STAGED, no write call),
# the dry run of both tiers, a refusal for every guard, the real-run path (token exchange,
# fetchStatus, cancelSubmission, upload, polling, STAGED_PUBLISH) against the stubs, and that no
# secret-like value reaches the output.
#
# Usage: scripts/ci/test-store-release.sh      (needs bash, node, zip, unzip, jq, git, openssl)
set -euo pipefail
cd "$(dirname "$0")/../.."
root="$(pwd)"
# The script under test reads these; the test sets what it needs per case.
unset GITHUB_REF GITHUB_HEAD_REF GITHUB_ACTIONS GITHUB_STEP_SUMMARY GITHUB_RUN_ID \
  CWS_PUBLISHER_ID CWS_TEST_ITEM_ID CWS_PROD_ITEM_ID STORE_AWS_ROLE_ARN STORE_KEY_SECRET_ID AWS_REGION \
  ACTIONS_ID_TOKEN_REQUEST_URL ACTIONS_ID_TOKEN_REQUEST_TOKEN GH_TOKEN

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
pass=0; failed=0
expect() { # expect pass|fail "<label>" <command...>  (fail cases must also print REFUSED)
  local want="$1" label="$2"; shift 2
  local rc=0
  "$@" >"$work/last.log" 2>&1 || rc=$?
  if { [[ "$want" == pass ]] && (( rc == 0 )); } || { [[ "$want" == fail ]] && (( rc == 1 )) && grep -q 'REFUSED' "$work/last.log"; }; then
    pass=$((pass + 1)); echo "ok    ${label}"
  else
    failed=$((failed + 1)); echo "NOT OK ${label} (rc=${rc})"; sed 's/^/        /' "$work/last.log" | tail -20
  fi
}
expect_rc() { # expect_rc <code> "<label>" <command...>  (an exact exit code, e.g. 3 = pending in --status)
  local want="$1" label="$2"; shift 2
  local rc=0
  "$@" >"$work/last.log" 2>&1 || rc=$?
  if (( rc == want )); then pass=$((pass + 1)); echo "ok    ${label}"
  else failed=$((failed + 1)); echo "NOT OK ${label} (rc=${rc}, wanted ${want})"; sed 's/^/        /' "$work/last.log" | tail -20; fi
}
assert() { # assert "<label>" <command...>
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then pass=$((pass + 1)); echo "ok    ${label}"; else failed=$((failed + 1)); echo "NOT OK ${label}"; fi
}

# ------------------------------------------------------------------ fixture build
dist="$work/dist"
mkdir -p "$dist/logos" "$dist/assets"
cp public/logos/nist-logo-*.png "$dist/logos/"
cat >"$dist/manifest.json" <<'EOF'
{
  "manifest_version": 3,
  "name": "Fixture Assistant",
  "version": "1.0.0",
  "key": "FIXTURE-PUBLIC-KEY-NOT-REAL",
  "permissions": ["storage", "tabs"],
  "content_scripts": [{"matches": ["*://*/*"], "js": ["assets/bundle.js"]}]
}
EOF
echo 'console.log("fixture bundle");var cfg={realm:"",clientSecret:""};' >"$dist/assets/bundle.js"
{
  echo "baseProdURL=https://prod.example.invalid/api"
  echo "baseTestURL=https://test.example.invalid/api"
  echo "keycloakProdUrl=https://kc-prod.example.invalid"
  echo "keycloakTestUrl=https://kc-test.example.invalid"
  echo "keycloakRealm=fixture-realm"
  echo "keycloakPublicClientId=fixture-public-client"
} >"$work/fixture.env"
sha="$(git rev-parse HEAD)"
pack() { # pack <out dir> <run number> [branch]
  (cd "$root" && env -u GITHUB_HEAD_REF GITHUB_REF_NAME="${3:-dev}" UDAN_ENV_FILE="$work/fixture.env" \
    scripts/ci/package-extension.sh --no-build --store --run-number "$2" --sha "$sha" --dist-dir "$dist" --out-dir "$1") \
    >"$work/pack.log" 2>&1 || { cat "$work/pack.log"; echo "packaging the fixture failed"; exit 1; }
}
build="$work/build"
pack "$build" 41
version="$(node -p "require('./package.json').version").41"
zt="udan-extension-${version}-store-test.zip"
zp="udan-extension-${version}-store-prod.zip"
fresh() { # fresh <name> -> a copy of the artifact dir
  local d="$work/art-$1"; rm -rf "$d"; cp -r "$build" "$d"; echo "$d"
}

# ------------------------------------------------------------------ keys and ids (throw-away)
mkkey() { openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$1" 2>/dev/null; }
pubb64() { openssl pkey -in "$1" -pubout -outform DER 2>/dev/null | base64 -w0; }
mkkey "$work/test-item.pem"; mkkey "$work/other-item.pem"; mkkey "$work/sa.pem"
TEST_PUB="$(pubb64 "$work/test-item.pem")"
OTHER_PUB="$(pubb64 "$work/other-item.pem")"
TEST_ID="$(node scripts/ci/store-helper.mjs extension-id <<<"$TEST_PUB")"
PROD_ID=jejdickefnhgkhdcjjcmoiiljlkanpln
jq -n --rawfile k "$work/sa.pem" '{type: "service_account", client_email: "fixture@example.invalid", private_key_id: "fixture", private_key: $k}' >"$work/sa.json"
DEV_KEY="$(jq -r .key public/manifest.json)"

assert "helper: the repo's manifest key derives the pinned dev id" \
  bash -c "[[ \$(node scripts/ci/store-helper.mjs extension-id <<<'$DEV_KEY') == lcnkfnijlogkgifbfhkcnmndhabnloco ]]"
assert "helper: refuses a key that is not base64 DER" bash -c "! node scripts/ci/store-helper.mjs extension-id <<<'not a key'"
assert "helper: refuses a service account file without a private key" bash -c "! echo '{\"type\":\"service_account\"}' | node scripts/ci/store-helper.mjs assertion"
assert "helper: the assertion is a valid RS256 JWT for the chromewebstore scope" bash -c "
  a=\$(node scripts/ci/store-helper.mjs assertion < '$work/sa.json')
  IFS=. read -r h p s <<<\"\$a\"
  printf '%s.%s' \"\$h\" \"\$p\" > '$work/signed'
  printf '%s' \"\$s\" | tr '_-' '/+' | awk '{l=length(\$0)%4; if(l==2)\$0=\$0\"==\"; else if(l==3)\$0=\$0\"=\"; print}' | base64 -d > '$work/sig'
  openssl pkey -in '$work/sa.pem' -pubout -out '$work/sa.pub' 2>/dev/null
  openssl dgst -sha256 -verify '$work/sa.pub' -signature '$work/sig' '$work/signed' >/dev/null &&
  printf '%s' \"\$p\" | tr '_-' '/+' | awk '{l=length(\$0)%4; if(l==2)\$0=\$0\"==\"; else if(l==3)\$0=\$0\"=\"; print}' | base64 -d |
    jq -e '.scope == \"https://www.googleapis.com/auth/chromewebstore\" and .aud == \"https://oauth2.googleapis.com/token\" and .exp - .iat == 600'"

# ------------------------------------------------------------------ stub tools
bin="$work/bin"; state="$work/state"
mkdir -p "$bin" "$state"
cat >"$bin/gh" <<'EOF'
#!/usr/bin/env bash
# gh stub: compare, workflow runs, run download.
echo "gh $*" >>"$STUB_STATE/calls"
if [[ "$1" == api && "$2" == */compare/* ]]; then echo "{\"status\":\"${STUB_COMPARE:-behind}\"}"; exit 0; fi
if [[ "$1" == api && "$2" == */workflows/release-store.yml/runs* ]]; then
  if [[ -n "${STUB_RUNS:-}" ]]; then cat "$STUB_RUNS"; else echo '{"workflow_runs":[]}'; fi; exit 0
fi
if [[ "$1" == run && "$2" == download ]]; then
  [[ -n "${STUB_RECORD:-}" ]] || exit 1
  while (( $# )); do [[ "$1" == --dir ]] && { cp "$STUB_RECORD" "$2/store-release-record.json"; exit 0; }; shift; done
fi
echo "gh stub: unexpected call: $*" >&2; exit 1
EOF
cat >"$bin/aws" <<'EOF'
#!/usr/bin/env bash
# aws stub: STS gives fake credentials, Secrets Manager gives the throw-away service account key.
echo "aws $1 $2" >>"$STUB_STATE/calls"
case "$1 $2" in
  "sts assume-role-with-web-identity") echo '{"Credentials":{"AccessKeyId":"FAKEID","SecretAccessKey":"FAKESECRETKEY","SessionToken":"FAKESESSION"}}' ;;
  "secretsmanager get-secret-value")
    [[ "${AWS_SECRET_ACCESS_KEY:-}" == FAKESECRETKEY ]] || { echo "no credentials" >&2; exit 255; }
    cat "$STUB_SA_KEY" ;;
  *) echo "aws stub: unexpected $*" >&2; exit 1 ;;
esac
EOF
cat >"$bin/curl" <<'EOF'
#!/usr/bin/env bash
# curl stub for the Chrome Web Store API, the OAuth token endpoint and the GitHub OIDC endpoint.
# State lives in $STUB_STATE: uploaded, published, cancelled flags; calls is a log.
out="" url="" method=GET upload="" data=""
while (( $# )); do
  case "$1" in
    -o) out="$2"; shift 2 ;;
    -X) method="$2"; shift 2 ;;
    -T) upload="$2"; shift 2 ;;
    --data) data="$2"; shift 2 ;;
    --data-urlencode) data+="$2&"; shift 2 ;;
    -H|-w) shift 2 ;;
    http*) url="$1"; shift ;;
    *) shift ;;
  esac
done
s="$STUB_STATE"
echo "curl $method ${url%%\?*}" >>"$s/calls"
reply() { printf '%s' "$2" >"$out"; printf '%s' "$1"; }
case "$url" in
  *audience=sts.amazonaws.com*) echo '{"value":"FAKEOIDCTOKEN"}'; exit 0 ;;
  https://oauth2.googleapis.com/token)
    cat >"$s/assertion"
    echo "token ${data%%&*}" >>"$s/calls"
    if [[ "${STUB_TOKEN_FAIL:-}" ]]; then reply 400 '{"error":"invalid_grant","error_description":"Invalid JWT Signature."}'; exit 0; fi
    reply 200 '{"access_token":"FAKEACCESSTOKEN","expires_in":3600}'; exit 0 ;;
esac
item="${url##*/items/}"; item="${item%%:*}"; action="${url##*:}"
case "$action" in
  fetchStatus)
    base="$s/status-${item}.json"
    [[ -f "$base" ]] || { reply 404 '{"error":{"status":"NOT_FOUND","message":"no such item"}}'; exit 0; }
    st="$(cat "$base")"
    [[ -f "$s/cancelled-$item" ]] && st="$(jq 'del(.submittedItemRevisionStatus)' <<<"$st")"
    if [[ -f "$s/uploaded-$item" ]]; then
      n=$(( $(cat "$s/polls-$item" 2>/dev/null || echo 0) + 1 )); echo "$n" >"$s/polls-$item"
      up=SUCCEEDED; (( n < 2 )) && up=IN_PROGRESS; [[ -n "${STUB_UPLOAD_FAIL:-}" ]] && up=FAILED
      st="$(jq --arg u "$up" '.lastAsyncUploadState = $u' <<<"$st")"
    fi
    [[ -f "$s/published-$item" ]] && st="$(jq --arg v "$(cat "$s/published-$item")" '.submittedItemRevisionStatus = {state: "PENDING_REVIEW", distributionChannels: [{deployPercentage: 100, crxVersion: $v}]}' <<<"$st")"
    reply 200 "$st" ;;
  upload)
    [[ -f "$upload" ]] || { reply 400 '{"error":{"status":"INVALID_ARGUMENT"}}'; exit 0; }
    sha256sum "$upload" | cut -d' ' -f1 >"$s/uploaded-$item"
    unzip -p "$upload" manifest.json | jq -r .version >"$s/uploaded-version-$item"
    reply 200 '{"uploadState":"IN_PROGRESS"}' ;;
  publish)
    printf '%s' "$data" >"$s/publish-body-$item"
    cp "$s/uploaded-version-$item" "$s/published-$item"
    reply 200 '{"state":"PENDING_REVIEW"}' ;;
  cancelSubmission) touch "$s/cancelled-$item"; reply 200 '' ;;
  *) reply 404 '{"error":{"status":"NOT_FOUND"}}' ;;
esac
EOF
chmod +x "$bin"/*
export PATH="$bin:$PATH" STUB_STATE="$state" STUB_SA_KEY="$work/sa.json" GITHUB_REPOSITORY=fixture/client
sr="$root/scripts/ci/store-release.sh"
reset_state() { rm -rf "$state"; mkdir -p "$state"; unset STUB_COMPARE STUB_RUNS STUB_RECORD STUB_TOKEN_FAIL STUB_UPLOAD_FAIL; }

# fetchStatus fixtures
status() { # status <publicKey> [published version] [submitted state] [submitted version] [extra jq]
  jq -n --arg k "$1" --arg pv "${2:-}" --arg ss "${3:-}" --arg sv "${4:-}" '
    {name: "publishers/p/items/i", itemId: "i", publicKey: $k, takenDown: false, warned: false}
    + (if $pv != "" then {publishedItemRevisionStatus: {state: "PUBLISHED", distributionChannels: [{deployPercentage: 100, crxVersion: $pv}]}} else {} end)
    + (if $ss != "" then {submittedItemRevisionStatus: {state: $ss, distributionChannels: [{deployPercentage: 100, crxVersion: $sv}]}} else {} end)' \
    | jq "${5:-.}"
}
status "$TEST_PUB" 1.0.0.1 >"$work/st-ok.json"
status "$TEST_PUB" 1.0.0.1 PENDING_REVIEW 1.0.0.5 >"$work/st-pending.json"
status "$TEST_PUB" 1.0.0.1 STAGED 1.0.0.5 >"$work/st-staged.json"
status "$TEST_PUB" 1.0.0.1 REJECTED 1.0.0.5 >"$work/st-rejected.json"
status "$TEST_PUB" "$version" >"$work/st-same.json"
status "$TEST_PUB" 1.0.0.1 PENDING_REVIEW 99.0.0.0 >"$work/st-higher-pending.json"
status "$TEST_PUB" 1.0.0.1 "" "" '.takenDown = true' >"$work/st-takendown.json"
status "$TEST_PUB" 1.0.0.1 "" "" '.lastAsyncUploadState = "IN_PROGRESS"' >"$work/st-uploading.json"
status "$OTHER_PUB" 1.0.0.1 >"$work/st-otherkey.json"
status "$TEST_PUB" "$version" >"$work/st-test-published.json"
status "$TEST_PUB" 1.0.0.1 STAGED "$version" >"$work/st-test-staged.json"
status "$TEST_PUB" 1.0.0.1 PENDING_REVIEW "$version" >"$work/st-test-inreview.json"

# Dry-run record of the TEST zip, made the way the real TEST run makes it, then flipped to "real".
art="$(fresh rec)"
reset_state
CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$art" --dry-run >/dev/null
jq '.dry_run = false | .upload_state = "SUCCEEDED" | .submitted_state = "PENDING_REVIEW"' "$art/store-release-record.json" >"$work/rec-ok.json"
jq '.bundle_hash = "0000"' "$work/rec-ok.json" >"$work/rec-bundle.json"
jq '.zip_sha256 = "0000"' "$work/rec-ok.json" >"$work/rec-zip.json"
jq '.dry_run = true' "$work/rec-ok.json" >"$work/rec-dry.json"
jq '.commit = "'"$(printf '0%.0s' {1..40})"'"' "$work/rec-ok.json" >"$work/rec-commit.json"
jq '.item_id_sha256 = "0000"' "$work/rec-ok.json" >"$work/rec-item.json"
jq -n --arg t "Store release test ${version}" '{workflow_runs: [{id: 7001, run_number: 3, display_title: $t}, {id: 7000, run_number: 2, display_title: ($t + " (dry run)")}]}' >"$work/runs.json"

# ------------------------------------------------------------------ dry runs that pass
d="$(fresh dry)"
reset_state
expect pass "dry run tier=test on the fixture build (no ids set)" "$sr" --tier test --version "$version" --dir "$d" --dry-run
assert "dry run made no store, token or AWS call" bash -c "! grep -qE '^(curl|aws) ' '$state/calls' 2>/dev/null"
assert "dry run wrote a record without ids" jq -e '.dry_run == true and .tier == "TEST" and .item_id_sha256 == "" and (tostring | test("'"$TEST_ID"'") | not)' "$d/store-release-record.json"
reset_state
expect pass "dry run tier=prod with no TEST release yet (warning, real run would refuse)" "$sr" --tier prod --version "$version" --dir "$d" --dry-run
assert "  ... and it says the real run refuses" grep -q 'found: false' "$work/last.log"
reset_state
expect pass "dry run tier=test with a saved status (one older published version)" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-ok.json"
assert "  ... and the TEST item id is not printed" bash -c "! grep -q '$TEST_ID' '$work/last.log'"
expect pass "dry run tier=test with a REJECTED earlier submission (not pending)" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-rejected.json"
expect pass "dry run tier=test, pending submission, replace_pending=true" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-pending.json" --replace-pending
reset_state
export STUB_RUNS="$work/runs.json" STUB_RECORD="$work/rec-ok.json"
expect pass "dry run tier=prod: TEST release run found on GitHub and matches" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run
expect pass "dry run tier=prod with TEST item PUBLISHED at this version" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --test-status-file "$work/st-test-published.json"
expect pass "dry run tier=prod with TEST item STAGED at this version" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --test-status-file "$work/st-test-staged.json"

# ------------------------------------------------------------------ one refusal per guard
reset_state
expect fail "refuses: workflow not on dev" env GITHUB_REF=refs/heads/feature "$sr" --tier test --version "$version" --dir "$d" --dry-run
expect fail "refuses: version not in the artifact" "$sr" --tier test --version "${version%.*}.42" --dir "$d" --dry-run
m="$(fresh sums)"; echo x >>"$m/$zt"
expect fail "refuses: SHA256SUMS does not verify" "$sr" --tier test --version "$version" --dir "$m" --dry-run
m="$(fresh nolist)"; grep -v -- "-store-prod.zip" "$build/SHA256SUMS" >"$m/SHA256SUMS"
expect fail "refuses: a store zip missing from SHA256SUMS" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
m="$work/art-branch"; rm -rf "$m"; pack "$m" 41 feature/x
expect fail "refuses: build made on another branch" "$sr" --tier test --version "$version" --dir "$m" --dry-run
# Mutate one zip inside a copy of the artifact and fix SHA256SUMS, so only the guard under test trips.
mutate() { # mutate <name> <zip file name> <snippet run in the unzipped dir> -> artifact dir
  local a; a="$(fresh "$1")"
  local x="$work/mx-$1"; rm -rf "$x"; mkdir -p "$x"
  unzip -q "$a/$2" -d "$x"; (cd "$x" && bash -c "$3")
  rm "$a/$2"; (cd "$x" && find . -type f | sed 's|^\./||' | LC_ALL=C sort | zip -X -D -q -@ "$a/$2")
  (cd "$a" && awk '{print $2}' SHA256SUMS | xargs sha256sum >SHA256SUMS.new && mv SHA256SUMS.new SHA256SUMS)
  echo "$a"
}
m="$(mutate key "$zp" "jq '. + {key: \"X\"}' manifest.json >m && mv m manifest.json")"
expect fail "refuses: store zip with a manifest key" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
m="$(mutate stamp "$zp" 'echo "{\"tier\":\"TEST\"}" > tier.json')"
expect fail "refuses: stamp does not match the tier" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
m="$(mutate secret "$zp" 'echo "var c={clientSecret:\"abc\"};" >> assets/bundle.js')"
expect fail "refuses: a secret key with a value in the bundle" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
m="$(mutate bundle "$zp" 'echo "// other" >> assets/bundle.js')"
expect fail "refuses: TEST and PROD zips carry different bundles" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
m="$(mutate keys "$zp" "jq '.env_keys_set -= [\"keycloakProdUrl\"]' build-info.json >b && mv b build-info.json")"
expect fail "refuses: a key the tier needs is not set (PROD Keycloak URL)" "$sr" --tier prod --version "$version" --dir "$m" --dry-run
export STUB_COMPARE=diverged
expect fail "refuses: commit not on dev" "$sr" --tier test --version "$version" --dir "$d" --dry-run
unset STUB_COMPARE
expect fail "refuses: CWS_PROD_ITEM_ID is not the PROD item" env CWS_PROD_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run
expect fail "refuses: CWS_TEST_ITEM_ID is the PROD item" env CWS_TEST_ITEM_ID="$PROD_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run
expect fail "refuses: version equal to the published one" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-same.json"
expect fail "refuses: version lower than a pending one (even with replace_pending)" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-higher-pending.json" --replace-pending
expect fail "refuses: a second pending submission (PENDING_REVIEW)" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-pending.json"
expect fail "refuses: a second pending submission (STAGED, not yet published)" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-staged.json"
expect fail "refuses: item taken down" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-takendown.json"
expect fail "refuses: an upload still in progress" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-uploading.json"
expect fail "refuses: item publicKey derives another id" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d" --dry-run --status-file "$work/st-otherkey.json"
expect fail "refuses: prod item whose publicKey is not the PROD id" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --status-file "$work/st-ok.json"
expect fail "refuses: prod when the TEST item has this version only in review" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --test-status-file "$work/st-test-inreview.json"
expect fail "refuses: prod when the TEST item does not have this version" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --test-status-file "$work/st-ok.json"
for r in bundle zip dry commit item; do
  expect fail "refuses: prod when the TEST record differs (${r})" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run --test-record-file "$work/rec-${r}.json"
done
export STUB_RUNS="$work/runs.json" STUB_RECORD=""
expect fail "refuses: prod when the TEST run's record artifact is gone" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier prod --version "$version" --dir "$d" --dry-run
unset STUB_RUNS STUB_RECORD
expect fail "refuses: real run outside GitHub Actions" "$sr" --tier test --version "$version" --dir "$d"
expect fail "refuses: real run with a variable missing" env GITHUB_ACTIONS=true CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --tier test --version "$version" --dir "$d"
expect fail "refuses: real run with no TEST release (tier=prod)" env GITHUB_ACTIONS=true "$sr" --tier prod --version "$version" --dir "$d"
assert "usage: --status-file is refused outside --dry-run" bash -c "! '$sr' --tier test --version '$version' --dir '$d' --status-file '$work/st-ok.json' >/dev/null 2>&1"
assert "usage: a bad version is refused" bash -c "! '$sr' --tier test --version 1.2.3 --dir '$d' --dry-run >/dev/null 2>&1"

# ------------------------------------------------------------------ real run against the stubs
real_env=(GITHUB_ACTIONS=true GITHUB_RUN_ID=9001 CWS_PUBLISHER_ID=fixture-publisher CWS_TEST_ITEM_ID="$TEST_ID"
  CWS_PROD_ITEM_ID="$PROD_ID" STORE_AWS_ROLE_ARN=arn:fixture STORE_KEY_SECRET_ID=fixture-secret AWS_REGION=fixture-1
  ACTIONS_ID_TOKEN_REQUEST_URL='https://oidc.example.invalid/?x=1' ACTIONS_ID_TOKEN_REQUEST_TOKEN=FAKEREQUESTTOKEN
  STORE_POLL_SECONDS=0 STORE_POLL_TRIES=5)
r="$(fresh real)"; reset_state; cp "$work/st-ok.json" "$state/status-${TEST_ID}.json"
expect pass "real run tier=test (stubs): token, fetchStatus, upload, poll, STAGED_PUBLISH" env "${real_env[@]}" GITHUB_STEP_SUMMARY="$work/summary.md" "$sr" --tier test --version "$version" --dir "$r"
cp "$work/last.log" "$work/real.log"
assert "  ... uploaded exactly the TEST store zip" bash -c "[[ \$(cat '$state/uploaded-$TEST_ID') == \$(sha256sum '$r/$zt' | cut -d' ' -f1) ]]"
assert "  ... submitted with STAGED_PUBLISH and blockOnWarnings" jq -e '.publishType == "STAGED_PUBLISH" and .blockOnWarnings == true' "$state/publish-body-$TEST_ID"
assert "  ... polled until the upload SUCCEEDED" grep -q 'upload SUCCEEDED' "$work/real.log"
assert "  ... the token request carried a jwt-bearer grant and a three-part assertion" bash -c "grep -q 'grant-type:jwt-bearer' '$state/calls' && [[ \$(tr -cd . < '$state/assertion' | wc -c) == 2 ]]"
assert "  ... masked the access token and the AWS secrets" bash -c "grep -q '::add-mask::FAKEACCESSTOKEN' '$work/real.log' && grep -q '::add-mask::FAKESECRETKEY' '$work/real.log' && grep -q '::add-mask::FAKESESSION' '$work/real.log'"
assert "  ... printed no secret outside the mask commands" bash -c "! grep -v '^::add-mask::' '$work/real.log' | grep -qE 'FAKEACCESSTOKEN|FAKESECRETKEY|FAKESESSION|FAKEOIDCTOKEN|FAKEREQUESTTOKEN|PRIVATE KEY|$TEST_ID'"
assert "  ... the summary has no secret and no TEST item id" bash -c "! grep -qE 'FAKE|PRIVATE|$TEST_ID' '$work/summary.md' && grep -q 'PENDING_REVIEW' '$work/summary.md'"
assert "  ... the record says SUCCEEDED / PENDING_REVIEW, real, no plain ids" jq -e '.dry_run == false and .upload_state == "SUCCEEDED" and .submitted_state == "PENDING_REVIEW" and .run_id == "9001" and (tostring | test("'"$TEST_ID"'") | not)' "$r/store-release-record.json"
assert "  ... no cancelSubmission when nothing was pending" bash -c "! grep -q cancelSubmission '$state/calls'"

r="$(fresh real2)"; reset_state; cp "$work/st-pending.json" "$state/status-${TEST_ID}.json"
expect fail "real run refuses a pending submission without replace_pending, before any upload" env "${real_env[@]}" "$sr" --tier test --version "$version" --dir "$r"
assert "  ... and uploaded nothing" bash -c "! grep -qE ':upload|:publish' '$state/calls'"
r="$(fresh real3)"; reset_state; cp "$work/st-pending.json" "$state/status-${TEST_ID}.json"
expect pass "real run with replace_pending cancels first, then uploads" env "${real_env[@]}" "$sr" --tier test --version "$version" --dir "$r" --replace-pending
assert "  ... cancelSubmission came before the upload" bash -c "grep -n ':cancelSubmission\|:upload' '$state/calls' | head -1 | grep -q cancelSubmission"
r="$(fresh real4)"; reset_state; cp "$work/st-ok.json" "$state/status-${TEST_ID}.json"; export STUB_TOKEN_FAIL=1
expect fail "real run stops on a failed token exchange (prints only the OAuth error code)" env "${real_env[@]}" "$sr" --tier test --version "$version" --dir "$r"
assert "  ... the error shows invalid_grant, not the body" bash -c "grep -q 'error invalid_grant' '$work/last.log' && ! grep -q 'Invalid JWT Signature' '$work/last.log'"
unset STUB_TOKEN_FAIL
r="$(fresh real5)"; reset_state; cp "$work/st-ok.json" "$state/status-${TEST_ID}.json"; export STUB_UPLOAD_FAIL=1
expect fail "real run stops when the upload FAILED, and does not submit" env "${real_env[@]}" "$sr" --tier test --version "$version" --dir "$r"
assert "  ... no publish call" bash -c "! grep -q ':publish' '$state/calls'"
unset STUB_UPLOAD_FAIL
# PROD: the promotion guards pass against the stubs; the PROD item's real publicKey is not known
# offline, so the run must stop at the publicKey id check, before any upload.
r="$(fresh real6)"; reset_state
cp "$work/st-test-published.json" "$state/status-${TEST_ID}.json"; cp "$work/st-ok.json" "$state/status-${PROD_ID}.json"
export STUB_RUNS="$work/runs.json" STUB_RECORD="$work/rec-ok.json"
expect fail "real run tier=prod: promotion found, then refuses a PROD item whose publicKey is not the PROD id" env "${real_env[@]}" "$sr" --tier prod --version "$version" --dir "$r"
assert "  ... the TEST run record matched before that" grep -q 'uploaded this exact bundle' "$work/last.log"
assert "  ... and nothing was uploaded to PROD" bash -c "! grep -qE ':upload|:publish' '$state/calls'"
unset STUB_RUNS STUB_RECORD

# ------------------------------------------------------------------ --status (read-only)
# Live status against the stubs: no --version, no --dir, no build. Every curl line of the call log
# must be the OIDC read, the OAuth token POST or GET :fetchStatus; nothing else may ever appear.
writes_in_calls() { grep -E '^curl ' "$state/calls" | grep -vE 'oidc.example.invalid|oauth2.googleapis.com/token$|^curl GET .*:fetchStatus$' || true; }
assert "status: no store call may be anything but GET :fetchStatus (helper sanity)" bash -c "[[ -z \$(printf 'curl GET https://x/y:fetchStatus\ncurl POST https://oauth2.googleapis.com/token\n' | grep -E '^curl ' | grep -vE 'oidc.example.invalid|oauth2.googleapis.com/token\$|^curl GET .*:fetchStatus\$') ]]"
reset_state; cp "$work/st-ok.json" "$state/status-${TEST_ID}.json"
expect_rc 0 "status tier=test: no pending submission -> exit 0, ACCEPTED" env "${real_env[@]}" GITHUB_STEP_SUMMARY="$work/status-summary.md" "$sr" --status --tier test
cp "$work/last.log" "$work/status.log"
assert "  ... the table says ACCEPTED, with the published version and no pending state" bash -c "grep -q 'ACCEPTED' '$work/status.log' && grep -q '1.0.0.1' '$work/status.log' && grep -q 'would be ACCEPTED' '$work/status.log'"
assert "  ... one fetchStatus, the token exchange, and no other store call" bash -c "[[ \$(grep -c ':fetchStatus' '$state/calls') == 1 ]] && grep -q 'grant-type:jwt-bearer' '$state/calls' && [[ -z \$(grep -E '^curl ' '$state/calls' | grep -vE 'oidc.example.invalid|oauth2.googleapis.com/token\$|^curl GET .*:fetchStatus\$') ]]"
assert "  ... NO write call: no upload, publish or cancelSubmission, no POST/PUT/DELETE to the store" bash -c "! grep -qE ':upload|:publish|cancelSubmission|curl (PUT|DELETE|PATCH)|upload/v2' '$state/calls' && ! grep -E '^curl POST' '$state/calls' | grep -v 'oauth2.googleapis.com/token\$' | grep -q ."
assert "  ... masked the access token; printed no secret, no token, no item id" bash -c "grep -q '::add-mask::FAKEACCESSTOKEN' '$work/status.log' && ! grep -v '^::add-mask::' '$work/status.log' | grep -qE 'FAKEACCESSTOKEN|FAKESECRETKEY|FAKESESSION|FAKEOIDCTOKEN|FAKEREQUESTTOKEN|PRIVATE KEY|$TEST_ID'"
assert "  ... the step summary has no secret and no item id, and says read-only" bash -c "! grep -qE 'FAKE|PRIVATE|$TEST_ID' '$work/status-summary.md' && grep -q 'Read-only' '$work/status-summary.md'"
reset_state; cp "$work/st-rejected.json" "$state/status-${TEST_ID}.json"
expect_rc 0 "status tier=test: an earlier REJECTED submission is not pending -> exit 0" env "${real_env[@]}" "$sr" --status --tier test
reset_state; cp "$work/st-pending.json" "$state/status-${TEST_ID}.json"
expect_rc 3 "status tier=test: PENDING_REVIEW -> distinct exit code 3, REFUSED" env "${real_env[@]}" "$sr" --status --tier test
assert "  ... the table shows PENDING_REVIEW, the pending version and 'would be REFUSED'" bash -c "grep -q 'PENDING_REVIEW' '$work/last.log' && grep -q '1.0.0.5' '$work/last.log' && grep -q 'would be REFUSED' '$work/last.log' && grep -q 'replace_pending=true' '$work/last.log'"
assert "  ... and it made no write call" bash -c "[[ -z \$(grep -E '^curl ' '$state/calls' | grep -vE 'oidc.example.invalid|oauth2.googleapis.com/token\$|^curl GET .*:fetchStatus\$') ]] && ! grep -qE ':upload|:publish|cancelSubmission' '$state/calls'"
reset_state; cp "$work/st-staged.json" "$state/status-${TEST_ID}.json"
expect_rc 3 "status tier=test: STAGED (approved, not yet published) -> exit 3, REFUSED" env "${real_env[@]}" "$sr" --status --tier test
assert "  ... the table shows STAGED and 'would be REFUSED'" bash -c "grep -q 'STAGED' '$work/last.log' && grep -q 'would be REFUSED' '$work/last.log'"
assert "  ... and it made no write call" bash -c "! grep -qE ':upload|:publish|cancelSubmission' '$state/calls'"
reset_state; cp "$work/st-takendown.json" "$state/status-${TEST_ID}.json"
expect fail "status tier=test: item taken down -> the existing refusal code 1" env "${real_env[@]}" "$sr" --status --tier test
reset_state; cp "$work/st-uploading.json" "$state/status-${TEST_ID}.json"
expect fail "status tier=test: an upload in progress -> refusal code 1" env "${real_env[@]}" "$sr" --status --tier test
reset_state; cp "$work/st-otherkey.json" "$state/status-${TEST_ID}.json"
expect fail "status tier=test: publicKey derives another id -> refusal code 1" env "${real_env[@]}" "$sr" --status --tier test
reset_state
expect fail "status tier=test: item unknown to the store (404) -> refusal code 1" env "${real_env[@]}" "$sr" --status --tier test
reset_state; export STUB_TOKEN_FAIL=1; cp "$work/st-ok.json" "$state/status-${TEST_ID}.json"
expect fail "status: failed token exchange -> refusal code 1, only the OAuth error code shown" env "${real_env[@]}" "$sr" --status --tier test
assert "  ... no fetchStatus was sent without a token" bash -c "! grep -q ':fetchStatus' '$state/calls' && grep -q 'error invalid_grant' '$work/last.log' && ! grep -q 'Invalid JWT Signature' '$work/last.log'"
unset STUB_TOKEN_FAIL
# tier=prod: both items are read (the TEST item too); the PROD item's real publicKey is not known
# offline, so the id check refuses, but the calls prove what was read and that nothing was written.
reset_state; cp "$work/st-test-published.json" "$state/status-${TEST_ID}.json"; cp "$work/st-ok.json" "$state/status-${PROD_ID}.json"
expect fail "status tier=prod: reads PROD and TEST, refuses a PROD item whose publicKey is not the PROD id" env "${real_env[@]}" "$sr" --status --tier prod
assert "  ... fetchStatus was called for both items and nothing else touched the store" bash -c "[[ \$(grep -c ':fetchStatus' '$state/calls') == 2 ]] && [[ -z \$(grep -E '^curl ' '$state/calls' | grep -vE 'oidc.example.invalid|oauth2.googleapis.com/token\$|^curl GET .*:fetchStatus\$') ]]"
reset_state
expect fail "status: a live read outside GitHub Actions is refused" "$sr" --status --tier test
expect fail "status: a variable missing is refused" env GITHUB_ACTIONS=true CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --status --tier test
assert "  ... and no store, token or AWS call was made" bash -c "! grep -qE '^(curl|aws) ' '$state/calls' 2>/dev/null"
# --status --dry-run: saved fetchStatus JSON, no credential, no call.
reset_state
expect_rc 0 "status --dry-run on a saved status without a pending submission -> exit 0" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --status --dry-run --tier test --status-file "$work/st-ok.json"
expect_rc 3 "status --dry-run on a saved PENDING_REVIEW status -> exit 3" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --status --dry-run --tier test --status-file "$work/st-pending.json"
expect_rc 3 "status --dry-run on a saved STAGED status -> exit 3" env CWS_TEST_ITEM_ID="$TEST_ID" "$sr" --status --dry-run --tier test --status-file "$work/st-staged.json"
assert "  ... no store, token or AWS call, no TEST item id printed" bash -c "! grep -qE '^(curl|aws) ' '$state/calls' 2>/dev/null && ! grep -q '$TEST_ID' '$work/last.log'"
# Usage: --status is exclusive with a release.
expect_rc 2 "usage: --status refuses --version" env "${real_env[@]}" "$sr" --status --tier test --version "$version"
expect_rc 2 "usage: --status refuses --dir" env "${real_env[@]}" "$sr" --status --tier test --dir "$d"
expect_rc 2 "usage: --status refuses --replace-pending" env "${real_env[@]}" "$sr" --status --tier test --replace-pending
expect_rc 2 "usage: --status refuses --test-record-file" env "${real_env[@]}" "$sr" --status --tier test --test-record-file "$work/rec-ok.json"
expect_rc 2 "usage: --status --dry-run without --status-file is refused" "$sr" --status --dry-run --tier test
expect_rc 2 "usage: --status-file without --dry-run is refused" "$sr" --status --tier test --status-file "$work/st-ok.json"
expect_rc 2 "usage: --status needs a tier" "$sr" --status
# The in-code assertion: status mode lets nothing but GET :fetchStatus through api(). The function
# is cut out of the script and run here with the stub curl.
reset_state
api_src="$(sed -n '/^api() {/,/^}/p' "$sr")"
expect_rc 70 "assertion: api() in status mode aborts on :upload (exit 70)" bash -c "status_mode=1; STORE_API=x; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api POST :upload item --upload /dev/null"
expect_rc 70 "assertion: api() in status mode aborts on :publish" bash -c "status_mode=1; STORE_API=x; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api POST :publish item --json '{}'"
expect_rc 70 "assertion: api() in status mode aborts on cancelSubmission" bash -c "status_mode=1; STORE_API=x; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api POST :cancelSubmission item"
expect_rc 70 "assertion: api() in status mode aborts on a non-GET fetchStatus" bash -c "status_mode=1; STORE_API=x; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api POST :fetchStatus item"
assert "  ... none of those sent a request" bash -c "! grep -q . '$state/calls' 2>/dev/null"
expect_rc 0 "assertion: api() in status mode lets GET :fetchStatus through" bash -c "status_mode=1; STORE_API=https://store.example.invalid; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api GET :fetchStatus item >/dev/null"
assert "  ... that one sent exactly one GET fetchStatus" bash -c "[[ \$(grep -c . '$state/calls') == 1 ]] && grep -q 'curl GET .*:fetchStatus' '$state/calls'"
assert "  ... the same function allows an upload outside status mode (the real run still works)" bash -c "status_mode=''; STORE_API=https://store.example.invalid; publisher=p; RESP=/dev/null; ACCESS_TOKEN=t; $api_src
api POST :publish item --json '{}' >/dev/null && grep -q 'curl POST .*:publish' '$state/calls'"

echo
echo "test-store-release: ${pass} passed, ${failed} failed"
(( failed == 0 ))
