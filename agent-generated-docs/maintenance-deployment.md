# Maintenance and deployment

## Source and toolchain

Work in the intended checkout, not the absolute paths in historical notes. Main copy and project facts belong to `content/site-content.json`; blog articles belong to `content/blog/*.md`. Use Node 24 and pnpm (CI uses pnpm 10; local verification used pnpm 11). Install with `pnpm install --frozen-lockfile`. Do not expose a development server publicly.

Run `pnpm run prebuild` after content changes, including during a running dev session. `pnpm dev` regenerates once at startup. `pnpm build` regenerates, type-checks, builds the public app, then creates route-specific HTML metadata shells. Do not substitute raw `vite build`: it skips required generation. Generated public mirrors, RSS, sitemap, security contact and agent indexes plus `src/content/publishedBlogPosts.json` must not be hand-edited. Keep `public/.generated-mirrors.json`: it bounds cleanup of renamed/unpublished/deleted project/blog mirrors.

Blog frontmatter requires title, slug, date (real YYYY-MM-DD), status (`draft` or `published`), excerpt, and one category: `content-systems`, `git-workflow`, or `frontend-quality`. A filename containing “draft” does not control publication. Set status explicitly. Cover image and descriptive alt must be paired. The renderer supports paragraphs, ## headings, dash lists, fenced code, inline code/emphasis/links, not arbitrary HTML or full CommonMark. Draft bodies are excluded before browser bundling. RSS contains full safe published articles and production URLs. Reading estimates use 200 whitespace-separated words/minute, minimum one minute.

Keep professional claims tied to supplied evidence. The four case-study headings are Problem, My responsibility, What I did, Result. Generic mockups and stock photographs are decoration, not project evidence. The Debase checked-in screenshot is actual interface evidence. Do not generate fictional screenshots. Replace imagery only with approved assets and verify usage rights.

The website resume remains editable JSON. `public/files/carteciano_lance-resume.pdf` is the unchanged approved application resume, not a generated replacement. A future replacement requires privacy/metadata/embedded-action inspection and source/copy/download checksum comparison. Do not copy its additional contact values into site text or logs.

## Verification before release

Run each independently: `pnpm lint`, `pnpm lint:oxlint`, `pnpm lint:colors`, `pnpm test`, `pnpm run prebuild`, `pnpm build`, `git diff --check`. Build includes `tsc -b`; the function is also type-checked through its regression import. No cyclomatic-complexity gate is configured. A >500 kB JavaScript chunk warning is currently known, not suppressed.

Check rendered pages at 390×844 and 1366×900, all detail routes, unknown routes, menu Escape/focus, contact errors, carousel links, reduced motion, filters/history and PDF integrity. Store browser evidence only under ignored `.playwright/` folders. Reuse the shared Chrome endpoint when supplied; never close the shared browser. A passed build is not visual approval.

## Production: Cloudflare Pages

Intended canonical origin: https://384721.xyz. Public production build: `pnpm build`, output `dist`. Cloudflare Pages must build from repository source with `functions/[[path]].ts`; a static-only drag/drop of dist does not establish function behavior. `wrangler.toml` declares output and compatibility date. Leave `GITHUB_PAGES` unset and admin disabled. No public build secrets are needed. Avoid SITE_URL/CONTACT overrides: legacy generator overrides affect mirrors only, while browser metadata uses JSON; keeping defaults avoids divergence.

Route shells provide initial title, description, canonical, Open Graph and article publication time, not server-rendered body content. React still renders the page. `404.html` is distinct and noindex; no blanket homepage SPA rewrite. Markdown negotiation supports GET/HEAD and trailing slashes and rejects an HTML fallback even when it returns 200. Verify deployed MIME, clean-URL redirects, missing-slug HTTP status and `Vary: Accept` after deployment. `_headers` applies to static responses; function responses must be verified separately.

Deployment, DNS/custom-domain configuration and publication are operator-only actions requiring separate approval. Follow `git-branch-release-workflow.md`: feature/fix merge into development, one release merge into main with annotated tag, atomic publication, then fast-forward development. Pushing development triggers the existing GitHub Pages preview workflow, so it is itself a publication action. Nothing in this guide authorizes a push.

## GitHub Pages preview

Build locally with `GITHUB_PAGES=true pnpm build`. Base is `/portfolio-website/`; canonical stays production, all route metadata is noindex, and preview robots disallows crawling. Images, PDF, RSS and local anchors use the base. GitHub Pages does not execute Cloudflare Functions or `_headers`: Markdown files are directly addressable, negotiation/API are unavailable. Existing routes have dedicated directory shells; host clean-URL redirects may add slashes. Unknown paths may retain host 404 status while React renders the not-found page. Do not overwrite `404.html` with homepage HTML. Always restore `pnpm build` without GITHUB_PAGES after preview checks.

## Deferred CMS: do not enable for launch

Admin source remains, but Vite builds only the public entry. Cloudflare rejects `/admin` and `/api/admin` routes with 404/no-store unless `ADMIN_ENABLED` is exactly `true` AND every allowlist/session/OAuth/repository/branch field is nonempty. No supported admin build opt-in is supplied in this release. Adding an entry alone is not an approved enablement path.

Before any future enablement, require separate security and workflow review: strong session secret and explicit login allowlist; non-protected CMS branch; bounded streamed request bodies; reject/sanitize SVG and validate actual file signatures/extensions; safe malformed cookie/referer handling; sanitized upstream errors; constrained OAuth scope; transactional rename/error recovery; stale asynchronous selection/save handling; runtime validation for image JSON; blog category/schema parity and filename/frontmatter slug parity. Current admin serialization drops required category, so saving through it would break the public generator. Source UI also has unguarded async state races and incomplete unsaved-edit protection. Default-disable is containment, not repair of these risks. Never exercise real OAuth, upload or GitHub writes as a smoke test.

Renew the generated security.txt expiry before 2027-06-25. Historical Figma/migration/reference docs are background, not a release task list; AGENTS, CONTEXT and approved launch scope take precedence.
