#!/usr/bin/env bash
# Checks the build-time env before a release build (public keys only, R10).
# Fails if:
#   - the schema environments/env.example has a value, or names a secret key;
#   - the env file is missing, lacks a schema key, or gives a secret key a value;
#   - src/ reads a process.env.<name> that is not in the schema (NODE_ENV is fine),
#     or reads process.env dynamically (process.env[...]);
#   - src/ mentions any secret key name at all.
# Never prints values, only key names.
#
# Usage: scripts/ci/check-env-keys.sh [ENV_FILE]
#   ENV_FILE defaults to the file the build reads: UDAN_ENV_FILE, else
#   environments/<BUILD_ENV>.env (BUILD_ENV defaults to production).
set -euo pipefail
cd "$(dirname "$0")/../.."

SCHEMA=environments/env.example
SRC_DIR="${SRC_DIR:-src}"
SECRET_KEYS=(keycloakClientSecret profanityKey googleTranslateApiKey googleAnalyticsSecretKey clientSecret)
ENV_FILE="${1:-$(node scripts/build-env.js "${BUILD_ENV:-production}" --file)}"

fail=0
err() { echo "::error::$*" >&2; fail=1; }

# KEY=VALUE lines of a dotenv file, comments and blanks skipped.
assignments() { grep -E '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=' "$1" || true; }
# Value of KEY in FILE with quotes stripped ("" if absent).
value_of() {
  assignments "$2" | sed -nE "s/^[[:space:]]*(export[[:space:]]+)?$1[[:space:]]*=[[:space:]]*(.*)$/\2/p" \
    | tail -n1 | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/'
}
is_secret() { local k; for k in "${SECRET_KEYS[@]}"; do [[ "$1" == "$k" ]] && return 0; done; return 1; }

[[ -f "$SCHEMA" ]] || { echo "::error::$SCHEMA not found" >&2; exit 1; }
mapfile -t KEYS < <(node scripts/build-env.js production --schema)
(( ${#KEYS[@]} > 0 )) || { echo "::error::no keys in $SCHEMA" >&2; exit 1; }
declare -A IN_SCHEMA=()
for k in "${KEYS[@]}"; do IN_SCHEMA[$k]=1; done

# 1. Schema: names only, no values, no secrets.
for k in "${KEYS[@]}"; do
  is_secret "$k" && err "$SCHEMA lists the secret key $k"
  [[ -n "$(value_of "$k" "$SCHEMA")" ]] && err "$SCHEMA must not hold values (key $k has one)"
done

# 2. Env file: every schema key present, no secret with a value.
if [[ ! -f "$ENV_FILE" ]]; then
  err "env file $ENV_FILE not found (copy $SCHEMA, or run scripts/ci/generate-env.sh)"
else
  env_lines="$(assignments "$ENV_FILE")"
  for k in "${KEYS[@]}"; do
    grep -Eq "^[[:space:]]*(export[[:space:]]+)?${k}[[:space:]]*=" <<<"$env_lines" \
      || err "$ENV_FILE lacks schema key $k"
  done
  for k in "${SECRET_KEYS[@]}"; do
    [[ -n "$(value_of "$k" "$ENV_FILE")" ]] && err "$ENV_FILE gives the secret key $k a value: remove it (secrets never go into the extension)"
  done
  # Keys outside the schema are ignored by the build; list them so old names get renamed.
  while IFS= read -r k; do
    [[ -z "$k" ]] && continue
    is_secret "$k" && continue
    [[ -n "${IN_SCHEMA[$k]:-}" ]] || echo "note: $ENV_FILE key $k is not in the schema and is ignored by the build"
  done < <(sed -E 's/^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*).*/\2/' <<<"$env_lines" | sort -u)
fi

# 3. src/: only allowlisted process.env names.
if grep -rqE 'process\.env\[' "$SRC_DIR"; then
  err "dynamic process.env[...] access in $SRC_DIR (use process.env.<key>):"
  grep -rnE 'process\.env\[' "$SRC_DIR" >&2 || true
fi
while IFS= read -r name; do
  [[ -z "$name" || "$name" == NODE_ENV ]] && continue
  [[ -n "${IN_SCHEMA[$name]:-}" ]] || err "$SRC_DIR reads process.env.$name, which is not in $SCHEMA"
done < <(grep -rhoE 'process\.env\.[A-Za-z_][A-Za-z0-9_]*' "$SRC_DIR" 2>/dev/null | sed 's/^process\.env\.//' | sort -u)

# 4. src/: no secret key name anywhere.
for k in "${SECRET_KEYS[@]}"; do
  if grep -rqw -- "$k" "$SRC_DIR"; then
    err "$SRC_DIR references the secret key name $k:"
    grep -rnw -- "$k" "$SRC_DIR" | cut -c1-200 >&2 || true
  fi
done

if (( fail )); then
  echo "check-env-keys: FAILED" >&2
  exit 1
fi
echo "check-env-keys: OK (${#KEYS[@]} schema keys, env file $ENV_FILE)"
