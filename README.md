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

## CI and releases

Branch from `dev` and open a PR into `dev`; the PR title must be a [Conventional Commit](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`) because it becomes the squash commit and drives the changelog. The extension has no server deploy: a release is a tagged version plus a manual store upload.
```mermaid
flowchart LR
    PR["PR into dev or master<br/>Conventional Commit title"] --> CI{"CI Gate<br/>build, typecheck, gitleaks, workflow lint<br/>npm audit report-only"}
    CI -- no --> PR
    CI -- "yes: squash merge" --> DEV["dev"]
    CI -. "each build uploads dist and SHA256SUMS<br/>as a run artifact, kept 14 days" .-> ART[("client-dist-commit")]
    DEV --> DIST["dist/ is built with npm run build:prod<br/>and committed by the maintainer"]
    DIST --> REL["PR dev into master, merge commit"]
    REL --> RP["Release Please PR<br/>package.json, manifests, CHANGELOG"]
    RP --> TAG["Tag vX.Y.Z and GitHub release"]
    TAG --> BM["Back-merge PR to dev"]
    TAG --> CWS["Upload to the Chrome Web Store: manual<br/>automation is a TODO"]
```
Release Please does not rebuild `dist/`: build and commit it before the release PR.

`webpack` is pinned to 5.105.4: 5.112.0 fails on the SDK bundle.
