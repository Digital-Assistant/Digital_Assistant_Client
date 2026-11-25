# 0001. Stay on Babel 7 until babel-loader supports Babel 8

## Context

The webpack build compiles `.js` and `.jsx` files with `babel-loader` ([`webpack.config.js`](../../webpack.config.js)).
The Babel settings are in [`babel.config.js`](../../babel.config.js).

Dependabot proposed `@babel/core` 8.0.9 (pull request #609, closed). With Babel 8, the webpack build emits no assets
and exits 0. The loader in use was `babel-loader` 10.1.1, the latest release at the time. The bump is not
adoptable: no config change fixes the loader (pull request #609).

Babel 8 also needs a rewrite of `babel.config.js`. It removes options this file uses, for example `useBuiltIns` and
`corejs`, `loose`, `isTSX` and `allExtensions`. That rewrite exists on the branch `chore/babel-8`.

Routine Dependabot version pull requests are now off (`open-pull-requests-limit: 0` in
[`.github/dependabot.yml`](../../.github/dependabot.yml)); the ignore rule below keeps Babel 8 out of security
updates and stays as the record for the manual bump window.

## Decision

1. Stay on Babel 7 (`@babel/core` 7.x in [`package.json`](../../package.json)).
2. Dependabot ignores semver-major updates of `@babel/*`
   ([`.github/dependabot.yml`](../../.github/dependabot.yml)).
3. The Babel 8 config rewrite is not merged. It stays on the branch `chore/babel-8` for the day a Babel 8 capable
   loader exists.

## Alternatives Considered

| Alternative | Why it is rejected |
| --- | --- |
| Merge the Babel 8 bump (pull request #609) | The build emits no assets and still exits 0 |
| Merge the Babel 8 config rewrite now | Same failure: the loader, not the config, blocks it |
| Leave Dependabot as it is | It opens a new pull request for each new Babel 8 release, and each one fails the same way |

## Consequences

### Positive

- The build keeps producing assets.
- The ignore rule keeps a Babel 8 bump that cannot work out of Dependabot updates, and records why.

### Negative / Trade-offs

- The Babel 7 line is not updated to Babel 8 features until the block clears.
- The ignore rule hides every `@babel/*` major bump, not only Babel 8.

### Re-open trigger

Re-open this decision when `babel-loader` supports Babel 8. Then remove the ignore rule, rebase `chore/babel-8`,
and run the build and `scripts/ci` checks, and test the extension (README, "Testing a change locally"), before
merging.
