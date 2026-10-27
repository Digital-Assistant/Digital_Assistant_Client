#!/usr/bin/env bash
# Sanity check of a built extension zip: loads it unpacked in Chromium (Playwright), opens a
# local host page and looks at what the extension does. Unauthenticated, read-only: no login,
# no token, no secret. Runs after Deploy to TEST (deploy-test.yml) and works on a laptop too.
#   scripts/ci/smoke-extension.sh <zip> <test-base-url>
#   <test-base-url> is the BASE_TEST_URL value (http(s)://host[:port]/api, the /api is optional)
# Checks (3 tries each; details in smoke-extension.mjs):
#   1. the extension service worker starts and its manifest version equals build-info.json;
#   2. the panel mounts (#udan-react-root) on a page that matches the content scripts;
#   3. a request to <test-base-url>/api/ gets an answer (2xx or 401, not the HTML fallback), none goes to PROD;
#   4. the TEST badge shows and UDASdkReady fired (builds with the runtime environment, C04).
# Optional env: BASE_PROD_URL (a request to it fails check 3), SMOKE_ATTEMPTS (default 3),
#   SMOKE_WAIT (seconds between tries, default 3), GITHUB_STEP_SUMMARY (results table appended).
# Needs: Node 22, unzip, `npm ci` (playwright-core) and the browser:
#   npx playwright-core install chromium     (add --with-deps on a fresh Linux machine)
# The test base URL is never printed: output shows "<test backend>" instead.
set -euo pipefail
cd "$(dirname "$0")/../.."

zip="${1:?usage: smoke-extension.sh <zip> <test-base-url>}"
base="${2:?usage: smoke-extension.sh <zip> <test-base-url>}"
[[ -f "${zip}" ]] || { echo "zip not found: ${zip}" >&2; exit 2; }
[[ "${base}" =~ ^https?://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~/-]*)?$ ]] || { echo "test base URL must be http(s)://host[:port][/api]" >&2; exit 2; }
command -v unzip >/dev/null || { echo "unzip not found on PATH" >&2; exit 2; }
[[ -d node_modules/playwright-core ]] || { echo "playwright-core missing: run npm ci" >&2; exit 2; }

# Same bytes as the build: when SHA256SUMS sits next to the zip, it must match.
dir="$(dirname "${zip}")"
if [[ -f "${dir}/SHA256SUMS" ]]; then
  (cd "${dir}" && grep -F "  $(basename "${zip}")" SHA256SUMS | sha256sum -c - >/dev/null) \
    || { echo "SHA256SUMS does not match $(basename "${zip}")" >&2; exit 1; }
  echo "SHA256SUMS ok for $(basename "${zip}")"
fi

exec node scripts/ci/smoke-extension.mjs "${zip}" "${base}"
