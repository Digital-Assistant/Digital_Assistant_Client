# Store listing draft: privacy (owner submits)

Draft only. The Chrome Web Store text is the owner's to submit; check it against the README section "Privacy: what the extension stores" first.

**Single purpose.** Record, save and replay step-by-step guides on a web page (Universal Digital Assistant Network).

**Data the extension handles**
- Account: when you sign in, UDAN gets a Keycloak account id, your email and your name from your Google account. The extension keeps sign-in tokens in its own browser storage so you stay signed in; Sign Out deletes them and ends the session.
- Content you create: the guides you record and save (the clicks and labels on a page), and search terms you type, are sent to the UDAN service.
- Local: the extension stores its settings and your sign-in tokens in the browser only.

**Things to say plainly**
- The web page where the panel runs receives a short-lived access token (about 5 minutes). A script on that page can ask the extension for a new one while you are signed in. The long-lived refresh token never leaves the extension.
- Your Google password is never seen by UDAN: you enter it on Google's or Keycloak's own page.
- Data is not sold and not used for advertising.

**Permission reasons** (unchanged by this change): `identity` (sign-in window and the Chrome profile hint), `identity.email` (suggest the signed-in Chrome account on the sign-in page), `storage` (settings and tokens), `tabs` and `activeTab` (find the page to show the panel on), host access (the panel runs on the pages of customer sites).
