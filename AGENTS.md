# Portfolio Website Agent Guide

Keep the portfolio content-first, case-study oriented, and easy for people and agents to navigate.

## Start here

- Before any change, read [development rules](docs/development.md). Inspect the current files, Git state, and relevant build/check results; preserve unrelated work.
- Use Vite+ (`vp`) for local Node tooling. Read the command mapping in the development guide before running scripts; raw `vp build` is not the application build.
- Update source content, not generated mirrors. Preserve user-authored wording unless copy changes are requested.
- Commit, push, release, and deploy only with explicit authorization. Admin remains disabled for public delivery.

## Read the guide for your task

| Task | Required guide |
| --- | --- |
| Project structure, routing, metadata, or runtime behavior | [Architecture](docs/architecture.md) |
| Site copy, projects, blog posts, images, or resume | [Content](docs/content.md) and [positioning](CONTEXT.md) |
| SCSS, layout, typography, colors, or motion | [Styling](docs/styling.md) |
| Branches, commits, merges, tags, releases, or cleanup | [Git workflow](docs/git-workflow.md) |
| Publishing, preview hosts, Cloudflare, PDF integrity, or admin security | [Deployment](docs/deployment.md) |
| Launch approval or release verification | [Launch checklist](docs/launch-checklist.md) |

[Documentation index](docs/README.md) defines rule ownership and the status of older notes. Keep detailed rules in their owner guide and link them here; do not grow this file into a second manual.
