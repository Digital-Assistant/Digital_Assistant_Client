# Store listing: copy-paste text for the Chrome Web Store dashboard

The owner submits this text. It is checked against the README section "Privacy: what the extension stores"; change the README and this file together. Images and the dashboard field list are in `store/listing/README.md`. The two items (PROD and the unlisted TEST item "UDA TEST") use the same text; the item name comes from the manifest in each store zip, not from this file. The PROD name is `Universal Digital Assistant by Nistapp (UDAN)`, exactly 45 characters, the Chrome Web Store limit; keep any copy consistent with it.

## Store listing tab

**Title (PROD item).** Universal Digital Assistant by Nistapp (UDAN)

The title is the manifest `name` of the PROD store zip (45 characters; the documented manifest limit is 75). It is the product name, not a beta label: do not add Beta or Alpha to the listing title or text. The TEST item keeps the name "UDA TEST".

**Summary** (from the package; 112 of 132 characters)

```
Record, save and replay step-by-step guides on any web page. Sign in with Google to keep and search your guides.
```

**Description** (plain text, no headings; paste as is)

```
Universal Digital Assistant by Nistapp (UDAN) lets you record a task on a web page as a step-by-step guide, save it, and replay it later so that you or someone else can follow the same steps.

What you can do
- Record: start a recording on a page and click through the task. The extension notes each step (the clicked element and a label you can edit).
- Save: give the guide a name and save it to your UDAN account.
- Replay: open the panel on the page, search for a guide, and follow it step by step.

How it works
The extension adds a small UDAN button to web pages. Open it to get the panel. Signing in uses Google through UDAN's sign-in page.

Your data, in plain words
- When you sign in, UDAN receives a Keycloak account id, your email and your name from your Google account. Your Google password is never seen by UDAN: you enter it on Google's or UDAN's own sign-in page.
- The guides you record and save (the clicks and labels on a page, and the page's domain) and the search terms you type are sent to the UDAN service.
- Your sign-in tokens and settings are kept in the extension's own browser storage so that you stay signed in. Sign Out ends the session and deletes the tokens.
- The web page where the panel runs receives a short-lived access token (about 5 minutes). A script on that page can ask the extension for a fresh access token while you are signed in. The long-lived refresh token never leaves the extension.
- Your data is not sold and not used for advertising.

Privacy policy: https://udan.nistapp.com/legal/privacy
```

**Category:** Productivity, subcategory "Workflow & Planning". Closest alternatives: Productivity > "Tools" and Productivity > "Education" (from the dashboard list as I know it; I did not open the dashboard, so if a name has changed, pick the nearest).

**Language:** English.

**Privacy policy URL:** `https://udan.nistapp.com/legal/privacy` (renders the policy in a browser, verified 2026-11-01). Do not use `https://udan.nistapp.com/privacy`: the site is a single-page app and that route renders an empty page.

**Images:** see `store/listing/README.md` (three 1280x800 screenshots, small promo tile 440x280).

## Privacy practices tab

**Single purpose** (paste into "Single purpose description")

```
Record, save and replay step-by-step guides on a web page (Universal Digital Assistant Network).
```

**Permission justifications** (one box per permission; unchanged from the earlier submission, `1.0.8.8`)

| Permission | Text for the dashboard |
|---|---|
| `identity` | Opens the sign-in window (launchWebAuthFlow) for the user's Google sign-in through UDAN's sign-in page, and reads the Chrome profile hint so the sign-in page can suggest the signed-in Chrome account. |
| `identity.email` | Suggests the Chrome account that is already signed in on the sign-in page, so the user does not have to type it. |
| `storage` | Keeps the extension's settings and the user's sign-in tokens in the extension's own storage so the user stays signed in. Sign Out deletes the tokens. |
| `tabs` | Finds the page the user is on, to show the panel on it. |
| `activeTab` | Gives the extension access to the page the user is on when they open the panel or start a recording. |
| Host access (`*://*/*`, content scripts) | The panel and the recorder run on the pages where the user records or replays a guide. The guides are for customer sites that can be on any domain, so the extension cannot name them in advance. |

**Remote code:** No. All code is in the package; the page script is loaded from the extension's own files.

**Data usage: what the extension collects** (tick these; leave the others empty)

| Dashboard category | Tick | Why |
|---|---|---|
| Personally identifiable information | yes | Name and email from the user's Google account, and the Keycloak account id. |
| Authentication information | yes | Access, refresh and ID tokens from the UDAN sign-in (kept in the extension's storage). |
| User activity | yes | The clicks the user records as steps in a guide. |
| Website content | yes | The labels and element data of the steps of a recorded guide. |
| Web history | yes | A saved guide stores the page it was recorded on (`fetchDomain()` / the page URL is saved with the recording), so page addresses are collected. Verified. |
| Health, Financial and payment, Personal communications, Location | no | Not collected. |

**Certifications** (the three statements; tick all three)

- I do not sell or transfer user data to third parties, outside of the approved use cases. Data goes to the UDAN service that provides the item's function; the Google sign-in is the approved sign-in use. Not sold.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose. Not used for advertising or anything else.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Answers to the questions behind them**

| Question | Answer |
|---|---|
| Is data sold? | No. |
| Used for purposes unrelated to the single purpose (for example advertising)? | No. |
| Is the data required for the single purpose? | Yes: the account is needed to save and find guides; the guides and search terms are the function itself. |
| Encrypted in transit? | Yes. Evidence: the PROD store zip `1.1.0.204` was unzipped and the bundle grepped; every backend host is `https://` (`udan.nistapp.com`, `authenticate.nistapp.com`, `iam.nistapp.com`, the `*test` equivalents, third-party docs links). The only `http://` strings are `http://localhost` (dev only) and `http://www.w3.org` (a namespace string, not a request). Checkpoint: no PROD request uses plain HTTP. |
| Can the user delete it? | Sign Out deletes the tokens in the extension. For data saved on the service, point to the privacy policy (the policy page is the place to name a deletion route; see the privacy-policy placeholder issue in the PR output). |

## Facts behind the text (from the README, keep in step)

- Account: when you sign in, UDAN gets a Keycloak account id, your email and your name from your Google account. The extension keeps sign-in tokens in its own browser storage (`chrome.storage.local`, not readable by websites) so you stay signed in; Sign Out ends the session and deletes them.
- Content you create: the guides you record and save (the clicks and labels on a page), and search terms you type, are sent to the UDAN service. The email is sent as a hash.
- Local: the extension stores its settings and your sign-in tokens in the browser only.
- The web page where the panel runs receives a short-lived access token (about 5 minutes). **A script on that page can ask the extension for a new one while you are signed in** (`UDARequestAccessToken`). The long-lived refresh token never leaves the extension.
- Your Google password is never seen by UDAN: you enter it on Google's or Keycloak's own page.
- Data is not sold and not used for advertising.
- The package file `tier.json` (`TEST` or `PROD`) is read from the extension's own package; it stores nothing and sends nothing.
- Not stored or sent: the Google password, browsing history outside the pages where the user records.
