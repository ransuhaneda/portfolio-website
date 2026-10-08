# Deployment and deferred CMS

Read [development](development.md), [content](content.md), and the [launch checklist](launch-checklist.md) for source, verification, and PDF privacy requirements. Local checks do not authorize publication.

## Production: Cloudflare Pages

Intended canonical origin: https://384721.xyz. Public production build: `vp run build`, output `dist/client`. Cloudflare Pages must build from repository source with `functions/[[path]].ts`; a static-only drag/drop of dist/client does not establish function behavior. `wrangler.toml` declares output and compatibility date. Leave `GITHUB_PAGES` unset and admin disabled. No public build secrets are needed. Avoid SITE_URL/CONTACT overrides: legacy generator overrides affect mirrors only, while browser metadata uses JSON; keeping defaults avoids divergence.

React Router prerenders configured routes with initial HTML and metadata, then hydrates on the client. The build also produces `__spa-fallback.html`. Verify unknown-route behavior and noindex metadata on the actual host; do not assume the historical standalone `404.html` shell is still generated. Markdown negotiation supports GET/HEAD and trailing slashes and rejects an HTML fallback even when it returns 200. Verify deployed MIME, clean-URL redirects, missing-slug HTTP status and `Vary: Accept` after deployment. `_headers` applies to static responses; function responses must be verified separately.

Deployment, DNS/custom-domain configuration and publication are operator-only actions requiring separate approval. Follow the [Git workflow](git-workflow.md). Pushing development triggers the existing GitHub Pages preview workflow, so it is itself a publication action. Nothing in this guide authorizes a push.

## GitHub Pages preview

Build locally with `GITHUB_PAGES=true vp run build`. Base is `/portfolio-website/`; canonical stays production, all route metadata is noindex, and preview robots disallows crawling. Images, PDF and local anchors use the base. GitHub Pages does not execute Cloudflare Functions or `_headers`: Markdown files are directly addressable, negotiation/API are unavailable. Existing routes have dedicated directory shells; host clean-URL redirects may add slashes. Unknown paths may retain host 404 status while React renders the not-found page. Do not replace unknown-route handling with a blanket homepage fallback. Always restore `vp run build` without GITHUB_PAGES after preview checks.

## Deferred CMS: do not enable for launch

Admin source remains, but the React Router route manifest includes only the public application. Cloudflare rejects `/admin` and `/api/admin` routes with 404/no-store unless `ADMIN_ENABLED` is exactly `true` AND every allowlist/session/OAuth/repository/branch field is nonempty. No supported admin build opt-in is supplied in this release. Adding an entry alone is not an approved enablement path.

Before any future enablement, require separate security and workflow review: strong session secret and explicit login allowlist; non-protected CMS branch; bounded streamed request bodies; reject/sanitize SVG and validate actual file signatures/extensions; safe malformed cookie/referer handling; sanitized upstream errors; constrained OAuth scope; transactional rename/error recovery; stale asynchronous selection/save handling; runtime validation for image JSON; blog category/schema parity and filename/frontmatter slug parity. Current admin serialization drops required category, so saving through it would break the public generator. Source UI also has unguarded async state races and incomplete unsaved-edit protection. Default-disable is containment, not repair of these risks. Never exercise real OAuth, upload or GitHub writes as a smoke test.

Check the generated security.txt expiry before release and renew it before it expires. Historical Figma/migration/reference docs are background, not a release task list; use the [documentation owners](README.md).

## Configuration drift to resolve before publication

`wrangler.toml` and the verified local build use `dist/client`. The existing `.github/workflows/deploy-pages.yml` still uploads `dist` and sets up pnpm 10, while the package manifest declares pnpm 11.25.0. Align and verify the workflow before the next authorized preview publication; this documentation update does not change CI or authorize a push. Configure Cloudflare's build environment to run the checked-in build script with the required runtime/toolchain.

The old `scripts/generate-route-shells.mjs` is not part of the current package build script. Do not infer current HTML, 404, or deployed host behavior from old launch evidence. Renew affected runtime and host checks against the final source.
