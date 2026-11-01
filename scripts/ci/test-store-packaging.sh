#!/usr/bin/env bash
# Tests package-extension.sh --store and check-store-zip.sh on a small fixture dist/.
# No npm build, no network, no secret: the fixture is a few files plus the repo's own logos, and
# the env file holds public placeholder values only.
#
# Usage: scripts/ci/test-store-packaging.sh      (needs bash, node, zip, unzip, jq, git)
# Exit 0 when every case behaves as expected.
set -euo pipefail
cd "$(dirname "$0")/../.."
root="$(pwd)"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
pass=0; failed=0
expect() { # expect pass|fail "<label>" <command...>
  local want="$1" label="$2"; shift 2
  local rc=0
  "$@" >"$work/last.log" 2>&1 || rc=$?
  if { [[ "$want" == pass ]] && (( rc == 0 )); } || { [[ "$want" == fail ]] && (( rc != 0 )); }; then
    pass=$((pass + 1)); echo "ok    ${label}"
  else
    failed=$((failed + 1)); echo "NOT OK ${label} (rc=${rc})"; sed 's/^/        /' "$work/last.log" | tail -15
  fi
}

# Fixture dist/: a manifest with a "key", the four logos, a bundle, a page.
dist="$work/dist"
mkdir -p "$dist/logos" "$dist/assets"
cp public/logos/nist-logo-*.png "$dist/logos/"
cat >"$dist/manifest.json" <<'EOF'
{
  "manifest_version": 3,
  "name": "Fixture Assistant",
  "version": "1.0.0",
  "key": "FIXTURE-PUBLIC-KEY-NOT-REAL"
}
EOF
# the SDK keeps a clientSecret property that stays empty: the name alone must not fail the check
echo 'console.log("fixture bundle");var cfg={realm:"",clientSecret:""};' >"$dist/assets/bundle.js"
echo '<!doctype html><title>fixture</title>' >"$dist/options.html"

# Public placeholder env: some keys set, the secret keys empty.
env_file="$work/fixture.env"
{
  echo "baseProdURL=https://prod.example.invalid/api"
  echo "baseTestURL=https://test.example.invalid/api"
  echo "keycloakRealm=fixture-realm"
  echo "keycloakPublicClientId=fixture-public-client"
} >"$env_file"
export UDAN_ENV_FILE="$env_file"

sha="$(git rev-parse HEAD)"
out="$work/out"
(cd "$root" && scripts/ci/package-extension.sh --no-build --store --run-number 7 --sha "$sha" --dist-dir "$dist" --out-dir "$out") >"$work/pack.log" 2>&1 \
  || { cat "$work/pack.log"; echo "package-extension.sh --store failed on the fixture"; exit 1; }

version="$(node -p "require('./package.json').version").7"
zt="$out/udan-extension-${version}-store-test.zip"
zp="$out/udan-extension-${version}-store-prod.zip"
check="$root/scripts/ci/check-store-zip.sh"

expect pass "packaging wrote the sideload zip, both store zips and build-info.json" \
  bash -c "cd '$out' && ls udan-extension-${version}.zip udan-extension-${version}-store-test.zip udan-extension-${version}-store-prod.zip build-info.json"
expect pass "SHA256SUMS has one line per zip plus build-info.json and verifies" \
  bash -c "cd '$out' && [[ \$(wc -l < SHA256SUMS) == 4 ]] && sha256sum --check --strict --quiet SHA256SUMS"
expect pass "the sideload zip keeps the manifest key (only store zips drop it)" \
  bash -c "jq -e 'has(\"key\")' '$dist/manifest.json'"   # the sideload zip keeps the key
expect pass "packaging again gives the same zip bytes" \
  bash -c "cd '$root' && h1=\$(sha256sum '$zt' '$zp' | cut -d' ' -f1 | tr -d '\n') && scripts/ci/package-extension.sh --no-build --store --run-number 7 --sha '$sha' --dist-dir '$dist' --out-dir '$out' >/dev/null && h2=\$(sha256sum '$zt' '$zp' | cut -d' ' -f1 | tr -d '\n') && [[ \$h1 == \$h2 ]]"

expect pass "check: TEST zip alone" "$check" "$zt"
expect pass "check: PROD zip alone" "$check" "$zp"
expect pass "check: the pair" "$check" "$zt" "$zp"
expect pass "check: the pair in the other order" "$check" "$zp" "$zt"
expect pass "check: required keys that are set" "$check" --require-keys keycloakPublicClientId,keycloakRealm "$zt"
expect fail "check: a required key that is not set" "$check" --require-keys googleAnalyticsMeasurementId "$zt"
expect fail "check: the same zip twice is not a pair" "$check" "$zt" "$zt"

# Mutations: unzip a copy of a zip, change one thing, zip it back under the same name.
mutate() { # mutate <zip> <name of mutation> <shell snippet run in the unzipped dir>
  local src="$1" snippet="$3" d="$work/mut-$2" copy
  rm -rf "$d"; mkdir -p "$d/x"
  unzip -q "$src" -d "$d/x"
  (cd "$d/x" && bash -c "$snippet")
  copy="$d/$(basename "$src")"
  (cd "$d/x" && find . -type f | sed 's|^\./||' | LC_ALL=C sort | zip -X -D -q -@ "$copy")
  echo "$copy"
}

m="$(mutate "$zt" key "jq '. + {key: \"X\"}' manifest.json >m && mv m manifest.json")"
expect fail "check: refuses a store zip that has a manifest key" "$check" "$m"
m="$(mutate "$zt" tierprod 'echo "{\"tier\":\"PROD\"}" > tier.json')"
expect fail "check: refuses a tier stamp that does not match the zip name" "$check" "$m"
m="$(mutate "$zt" tierextra 'echo "{\"tier\":\"TEST\",\"x\":1}" > tier.json')"
expect fail "check: refuses a tier stamp with an extra key" "$check" "$m"
m="$(mutate "$zt" tiermissing 'rm tier.json')"
expect fail "check: refuses a zip without tier.json" "$check" "$m"
m="$(mutate "$zt" name "jq '.name = \"Fixture Assistant\"' manifest.json >m && mv m manifest.json")"
expect fail "check: refuses a TEST zip not named UDA TEST" "$check" "$m"
m="$(mutate "$zt" version "jq '.version = \"9.9.9.9\"' manifest.json >m && mv m manifest.json")"
expect fail "check: refuses a manifest version that differs from the name" "$check" "$m"
m="$(mutate "$zp" secretname 'echo "var a = \"keycloakClientSecret\";" >> assets/bundle.js')"
expect fail "check: refuses a secret key name inside the bundle" "$check" "$m"
m="$(mutate "$zp" secretvalue 'echo "var c = {clientSecret: \"abc\"};" >> assets/bundle.js')"
expect fail "check: refuses clientSecret assigned a value in the bundle" "$check" "$m"
m="$(mutate "$zp" secretvalue2 'echo "x.googleAnalyticsSecretKey=\"abc\";" >> assets/bundle.js')"
expect fail "check: refuses another secret key assigned with =" "$check" "$m"
m="$(mutate "$zp" secretset "jq '.env_keys_set += [\"clientSecret\"]' build-info.json >b && mv b build-info.json")"
expect fail "check: refuses a secret key name in env_keys_set" "$check" "$m"
m="$(mutate "$zp" prodjs 'echo "// changed" >> assets/bundle.js')"
expect fail "check: pair refuses a JS file that differs" "$check" "$zt" "$m"
m="$(mutate "$zp" prodextra 'echo x > extra.txt')"
expect fail "check: pair refuses an extra file" "$check" "$zt" "$m"
m="$(mutate "$zp" prodperm "jq '. + {permissions: [\"tabs\"]}' manifest.json >m && mv m manifest.json")"
expect fail "check: pair refuses a manifest that differs beyond the name" "$check" "$zt" "$m"
expect fail "check: refuses a zip with the wrong name" "$check" "$out/udan-extension-${version}.zip"
expect fail "check: refuses a missing file" "$check" "$work/nothing-store-test.zip"

echo
echo "store packaging tests: ${pass} passed, ${failed} failed"
(( failed == 0 ))
