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
- Published-only local blog search and categories, URL filters, full-content `/rss.xml`
- Route-specific initial HTML and client-navigation metadata
- Web resume plus unchanged approved PDF download

## Stack

- React 19 and React Router 7
- TypeScript 5.8
- Vite 7
- SCSS (Sass)
- GSAP for motion
- pnpm

## Requirements

- Node.js 24 (generation imports erasable TypeScript directly)
- pnpm

## Install and run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite serves the site at [http://localhost:4173](http://localhost:4173). The `dev` script regenerates the machine-readable files before starting the server.

To preview a production build locally:

```bash
pnpm build
pnpm preview
```

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Generate content mirrors and start the Vite development server |
| `pnpm build` | Generate content mirrors, type-check, and create the production build in `dist/` |
| `pnpm preview` | Serve the existing production build locally |
| `pnpm run prebuild` | Regenerate markdown mirrors, sitemap, and agent metadata |
| `pnpm lint` | Run ESLint |
| `pnpm lint:oxlint` | Run Oxlint |
| `pnpm lint:colors` | Check color-token usage |
| `pnpm test` | Run the Vitest test suite once |

## Editing content

1. Edit [`content/site-content.json`](content/site-content.json).
2. For blog posts, add or update Markdown files in [`content/blog/`](content/blog/). Published posts require frontmatter with `status: published`; draft posts are excluded from generated output.
3. Regenerate the derived files:

   ```bash
   pnpm run prebuild
   ```

`pnpm dev` and `pnpm build` run this step automatically. Generated files are written to `public/` and should not be edited directly.

## Maintenance

No secrets or environment file are required for the public build. Keep production URLs and contact copy in JSON. Blog posts require a category as well as title, slug, date, status and excerpt. After edits during a running dev session, rerun prebuild to refresh the published snapshot.

See [maintenance/deployment](agent-generated-docs/maintenance-deployment.md) for publishing rules, preview builds, generated files, PDF integrity and deferred CMS security risks. See [launch checklist](agent-generated-docs/launch-checklist.md) for required independent gates.

## Cloudflare Pages

Build command: `pnpm build`; output: `dist/`. Deploy from repository source so Pages includes `functions/[[path]].ts`, which handles Markdown negotiation and admin containment. Do not enable admin for launch. Deployment is not authorized by running local checks.

## Repository layout

```text
content/       Editable site and blog content
public/        Generated markdown, metadata, and static assets
src/           Public React application and SCSS
admin/         Deferred CMS source (not in public build)
functions/     Cloudflare Pages Function
scripts/       Content and agent-file generation scripts
```

## License

No license file is currently included. All rights remain with the project owner unless a separate written agreement states otherwise.
