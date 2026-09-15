# A Git release workflow for small teams

- Date: 2026-08-21
- Category: Git workflow
- Excerpt: A branch, merge, tag, and cleanup workflow for teams that want reviewable Git history without extra ceremony.
- Cover image: https://picsum.photos/seed/git-release-workflow-small-teams/1600/900.jpg

A small team can use a simple Git process. It needs to know which work is still being reviewed, which work is integrated, and what is in production.

The workflow I use keeps `development` as the integration branch and `main` as the production branch. Short-lived feature or fix branches merge into `development`. A release is one explicit merge into `main`, followed by an annotated tag. After that, `development` fast-forwards to the released `main`.

## Start work from development

I start feature and fix branches from an up-to-date `development` branch. The branch name describes the work, such as `feat/blog-post` or `fix/mobile-header`.

```bash
git switch development
git pull --ff-only origin development
git switch -c feat/blog-post
git push -u origin feat/blog-post
```

Short work branches are easier to review. I keep commits narrow and use a Conventional Commit prefix when it helps explain the change: `feat:`, `fix:`, `docs:`, or `chore:`.

I add specific files rather than every file in the working tree. That matters when generated files, screenshots, or another unfinished change are present.

```bash
git status --short
git diff
git add content/blog/2026-08-21-git-workflow-for-small-teams.md
git diff --cached
git commit -m "docs: add git release workflow post"
git push
```

## Merge the work into development

The branch is reviewed and validated before it is merged. For this portfolio, content changes run `pnpm run prebuild`; structural changes also run `pnpm build`. Browser checks belong in the dedicated `.playwright/` folders when the change affects rendered behavior.

The merge into `development` preserves the work branch in history:

```bash
git switch development
git pull --ff-only origin development
git merge --no-ff feat/blog-post -m "Merge branch 'feat/blog-post' into development"
git push origin development
```

A merge commit records the integration boundary without rewriting the work branch. I leave completed branch history intact unless the project calls for squashing or rebasing.

## Release from validated development

Most releases do not need another branch. If `development` already contains the validated work and no release-only changes are required, it is the release source.

Before merging, I fetch both long-lived branches and check four conditions:

```bash
git fetch --all --prune
git switch development && git pull --ff-only origin development
git switch main && git pull --ff-only origin main

RELEASE_SOURCE=development
VERSION=0.0.7

git merge-base --is-ancestor main "$RELEASE_SOURCE"
git log --oneline main.."$RELEASE_SOURCE"
git diff --quiet main "$RELEASE_SOURCE" && exit 1
git tag --list "v$VERSION"
git ls-remote --tags origin "refs/tags/v$VERSION"
```

The ancestry check exposes an unexpected branch divergence before the release merge. The tree-difference check catches an unchanged release. The local and remote tag checks stop a published version from being reused.

I use a `release/vX.Y.Z` branch only when it contains release preparation, stabilization, or a release-blocking fix. A branch pointing at the unchanged `development` tip adds ceremony without adding a review boundary.

## Merge once, tag once, publish together

The production merge is explicit and non-fast-forward. The annotated tag points at that merge commit so the version identifies the exact release boundary.

```bash
git switch main
git merge --no-ff "$RELEASE_SOURCE" -m "chore(release): publish v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
git push --atomic origin main "v$VERSION"
```

`--atomic` publishes the branch and tag as one remote update. If either reference cannot be published, neither should move. I inspect the merge and tag before pushing when the release is consequential.

## Fast-forward development after the release

After `main` is published, `development` should catch up without a second content-identical merge commit:

```bash
git switch development
git pull --ff-only origin development
git merge --ff-only main
git push origin development
```

The release merge already contains the release source as a parent. Fast-forwarding keeps both long-lived branches aligned and preserves one release boundary.

## Clean up only after verifying history

Short-lived branches are deleted only after the merge and remote state are verified. First check which local branches are merged into `main`, then remove the specific work branch locally and remotely.

```bash
git fetch --all --prune
git branch --merged main
git branch -d feat/blog-post
git push origin --delete feat/blog-post
git branch -vv
```

Cleanup comes after the history check. I delete a branch when its commits are reachable from the intended integration or release branch and the remote deletion is confirmed.

## The workflow in one line

Use `feat/*` or `fix/*` branches for contained work, merge them into `development`, release validated `development` into `main` once with an annotated tag, fast-forward `development`, and delete branches after verifying reachability. Each step leaves a record of what reached production.
