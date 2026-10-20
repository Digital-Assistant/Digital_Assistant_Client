# Digital Assistant Client (UDAN)

Browser extension UI for the Universal Digital Assistant Network. The core logic comes from the published SDK, `@udan/digital-assistant-sdk` (source: https://github.com/Digital-Assistant/Digital-Assistant-SDK), so no local SDK checkout is needed.

## Build

```
npm install
npm run build        # default build -> build/
npm run build:dev    # development
npm run build:prod   # production -> dist/
npm run build:qa     # QA -> dist/
```

`npm start` runs webpack in watch mode.

`webpack` is pinned to 5.105.4: 5.112.0 fails on the SDK bundle.
