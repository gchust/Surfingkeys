# Fork maintenance

This fork keeps upstream code and fork-specific changes on separate branches.

- `master` mirrors `brookhong/Surfingkeys:master`. Do not commit fork changes to it.
- `custom/master` is the default development and release branch.
- New work should use `feature/*` branches created from `custom/master`.

The **Sync upstream** workflow runs every six hours and can also be started manually. It fast-forwards the fork's `master` branch to upstream, mirrors release tags when available, and opens or updates a pull request from `master` into `custom/master`. The workflow enables auto-merge when repository policy permits it; otherwise, the pull request remains open for review.

Every pull request merged into `custom/master` triggers **Release custom build**. The workflow builds Chrome and Firefox extension ZIP files on macOS and publishes a fork release. Tags use `v<upstream-or-package-version>-fork.<number>`, for example `v1.18.0-fork.1`.

The mirror branch is protected against deletion and force pushes. If upstream rewrites its history, resolve that exceptional case manually rather than force-updating `master` automatically.
