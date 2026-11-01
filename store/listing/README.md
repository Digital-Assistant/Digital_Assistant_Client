# Store listing assets

Everything the Chrome Web Store dashboard asks you to supply for the listing. The text lives in `docs/store-listing-draft.md`; this folder holds the images and how to make them again. Nothing here is uploaded by a script: the owner pastes and uploads by hand.

## Files

| File | Pixels | What |
|---|---|---|
| `01-title-card-1280x800.png` | 1280x800 | **Generated** title card: logo, product name, one line of value text, white background. Not a UI screenshot. |
| `02-panel-sign-in-1280x800.png` | 1280x800 | **Real UI**: the signed-out panel ("Sign in with Google") open on a synthetic page. |
| `03-page-with-udan-button-1280x800.png` | 1280x800 | **Real UI**: the same synthetic page with the extension's floating UDAN button, panel closed. |
| `promo-tile-440x280.png` | 440x280 | **Generated** small promo tile: logo and name. |
| `demo-page.html` | | The synthetic page ("Example Co.", placeholder text, no real site or person). |
| `make-cards.sh` | | Makes the title card and the tile (ImageMagick, DejaVu Sans). |
| `capture-screenshots.mjs` | | Makes screenshots 02 and 03 from a built extension (Playwright). |

No screenshot shows a signed-in state: that needs a backend, and nothing here may touch one. The panel shows no TEST badge because the demo page asks for the PROD look (`UDAPluginSDK({ environment: "PROD" })` after `UDASdkReady`, the documented host-page call); the build behind it has only unroutable placeholder URLs.

## Make them again

From the repo root, Node 22, ImageMagick, and the Playwright Chromium (`npx playwright-core install chromium` if missing):

```
store/listing/make-cards.sh

printf '%s\n' baseProdURL=http://127.0.0.1:9/api baseTestURL=http://127.0.0.1:9/api \
  tokenProdUrl=http://127.0.0.1:9 tokenTestUrl=http://127.0.0.1:9 \
  llmProdUrl=http://127.0.0.1:9 llmTestUrl=http://127.0.0.1:9 \
  keycloakProdUrl=http://127.0.0.1:9 keycloakTestUrl=http://127.0.0.1:9 \
  keycloakRealm=placeholder-realm keycloakClientId=placeholder-client \
  keycloakPublicClientId=placeholder-public-client keycloakIdpHint= \
  googleAnalyticsMeasurementId= enableGoogleAnalytics=false > /tmp/shot.env
UDAN_ENV_FILE=/tmp/shot.env npm run build
node store/listing/capture-screenshots.mjs build
```

The capture serves the page from `127.0.0.1` (content scripts only run on `http(s)` pages), aborts every other request, prints the hosts it aborted and fails on anything but the placeholder `127.0.0.1:9`. The cards are deterministic (same bytes on every run with the same fonts); screenshots 02 and 03 depend on the Chromium build and fonts, so re-run `identify` after regenerating.

## Dashboard fields, copy-paste

Text for each field is in `docs/store-listing-draft.md`.

| Dashboard tab / field | Value |
|---|---|
| Store listing, Summary (max 132) | the "Summary" block (112 characters) |
| Store listing, Description | the "Description" block |
| Store listing, Category | Productivity (alternatives: Tools, Education) |
| Store listing, Language | English |
| Store listing, Screenshots | `01`, `02`, `03` (1280x800) |
| Store listing, Small promo tile | `promo-tile-440x280.png` |
| Store listing, Privacy policy URL | `https://udan.nistapp.com/legal/privacy` (never `/privacy`: it renders an empty page) |
| Privacy practices, Single purpose | the "Single purpose" block |
| Privacy practices, Permission justifications | the table: `identity`, `identity.email`, `storage`, `tabs`, `activeTab`, host access |
| Privacy practices, Remote code | No |
| Privacy practices, Data usage | Personally identifiable information, Authentication information, User activity, Website content, Web history |
| Privacy practices, Certifications | tick all three (not sold, no unrelated use, no creditworthiness use) |
| Distribution, Visibility (TEST item) | Unlisted |
