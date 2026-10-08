# Lance Carteciano — Portfolio Website

A case-study portfolio for Lance Carteciano, built with React, TypeScript, SCSS, and Vite. The site presents frontend, WordPress, and design-to-code work through reusable pages and project detail routes.

## Public launch status

Intended production: https://384721.xyz on Cloudflare Pages. GitHub Pages is a noindex preview under `/portfolio-website/`. Launch approval and deployment are separate operator steps. The default build is public-only; admin source is retained but not shipped, and Cloudflare admin routes fail closed.

## Features

- Home, About, Blog, Projects, Contact, Resume, and Design System pages
- Individual case-study routes for each project
- Content-first architecture: `/content/site-content.json` is the editable source of truth
- Published blog posts sourced from `/content/blog/*.md`
- Generated markdown mirrors and agent-readable metadata:
  - `/public/*.md` and `/public/projects/*.md`
  - `/public/llms.txt` and `/public/llms-full.txt`
  - `/public/sitemap.xml`
  - `/public/.well-known/agent-skills/index.json` and `site-navigation/SKILL.md`
- Cloudflare Pages support through `wrangler.toml`, `_headers`, `_redirects`, and `functions/[[path]].ts`
- Published-only local blog search and categories with URL filters
- Route-specific initial HTML and client-navigation metadata
- Web resume plus downloadable PDF

## Stack

- React 19 and React Router 7
- TypeScript 5.8
- Vite+ (Vite, Rolldown, Vitest, Oxlint, and Oxfmt)
- SCSS (Sass)
- GSAP for motion
- pnpm package management through Vite+ locally

## Requirements

- Node.js 24 (generation imports erasable TypeScript directly)
- Vite+ (`vp`); the repository declares pnpm as its package manager

## Install and run locally

```bash
vp install --frozen-lockfile
vp run dev
```

Vite serves the site at [http://localhost:4173](http://localhost:4173). The `dev` script regenerates the machine-readable files before starting the server.

To preview a production build locally:

```bash
vp run build
vp run preview
```

## Project guides

Start with the [documentation index](docs/README.md). Maintained rules have one owner:

- [Development](docs/development.md): local commands, checks, and working artifacts
- [Architecture](docs/architecture.md): React Router prerendering, routes, metadata, and runtime boundaries
- [Content](docs/content.md) and [positioning](CONTEXT.md): editable sources, blog contracts, evidence, and resume privacy
- [Styling](docs/styling.md): tokens, wrappers, typography, and responsive layout
- [Git workflow](docs/git-workflow.md): branches, merges, tags, releases, and cleanup
- [Deployment](docs/deployment.md) and [launch checklist](docs/launch-checklist.md): host requirements, approval, and CMS containment

The application build produces deployable files in `dist/client/`. No secrets or environment file are required for the public build. Deployment remains a separately authorized operator action; see the deployment guide for current preview workflow drift and host checks.

## Repository layout

```text
content/       Editable site and blog content
public/        Generated markdown, metadata, and static assets
src/           Public React application and SCSS
admin/         Deferred CMS source (not in public build)
functions/     Cloudflare Pages Function
scripts/       Content and agent-file generation scripts
docs/          Maintained project rules and guides
agent-generated-docs/  Working notes and historical evidence
```

## License

No license file is currently included. All rights remain with the project owner unless a separate written agreement states otherwise.
