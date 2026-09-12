# Public launch integration handoff

Task t_f6d0e287; next owner architect t_46baef8b, then existing runtime QA and independent reviewer. Implementation completion is not launch approval.

Workspace: /home/ransu/personal-projects/portfolio-website-launch-readiness. Branch feat/launch-readiness, HEAD 1e1f672. Ancestry check passed. Preserved all upstream uncommitted blog and metadata/security work; no commits, push, deploy, OAuth, GitHub writes, profile/configuration changes or original-checkout edits.

## Implemented

- Default Vite entry is public only. Cloudflare /admin and /api/admin fail closed with 404/no-store unless explicit ADMIN_ENABLED=true and complete nonempty allowlist/session/OAuth/repository/branch configuration. Missing allowlist no longer authenticates. Admin source retained; no supported admin build switch added. This is containment, not CMS security repair.
- Content-derived initial HTML route shells and client metadata: title, description, canonical, OG type/title/description/url, article publication date, RSS discovery. Eighteen known routes plus distinct noindex 404. Preview base /portfolio-website/ is noindex with production canonical; preview robots disallows crawling. Blanket homepage rewrite and CI homepage-to-404 copy removed; Node 24 in CI.
- Markdown negotiation checks actual MIME, GET/HEAD, trailing slash, missing slugs and Vary. HTML fallback is never relabeled Markdown. Static blanket index header replaced with nosniff to avoid contradictory 404 indexing. security.txt now generated with content-owned contact/canonical, no fictional policy link. Manifest paths made relative.
- Unchanged authorized PDF copied to public/files/carteciano_lance-resume.pdf. JSON owns download href/label; ResumePage exposes it and web resume remains. Markdown mirror includes download.
- Base-aware content images, preloaded carousel images, footer local anchors and PDF. Markdown local article links remap to browser base while RSS stays absolute/canonical. Shared 200-word/minute reading estimate across home/archive/article.
- Single main landmark, carousel and ProjectCard descendant key guard, mobile disclosure Escape/focus, contact error focus/live announcement and explicit content-owned homepage mail-app handoff.
- Additional inspection fixes: ScrollOpacityText explicitly imports ScrollTrigger rather than relying on browser global and skips decorative opacity under reduced motion; ProjectStack tooltip IDs now unique per instance; footer corrected nonexistent display font token.
- Stock photograph claims made neutral in JSON/blog frontmatter. Project stock images are decorative with visible disclosure; carousel caption uses accurate asset alt rather than implying mockups are project screenshots. Four explicit case-study headings retained in React and added to mirrors.

## PDF evidence and privacy

Read-only metadata/embedded inspection was completed by the preceding operator unblock (pypdf 6.18.0 through isolated uv): one unencrypted page, no attachments, OpenAction/AA, Names tree or XMP; two URI Link annotations; no Author/Title/Subject/Keywords. Creator Word 2016, Producer ilovepdf, July 22 2026 timestamps. Prior audit text comparison found matching employers/dates/8 active sites/4 migrations; no proven factual conflict. PDF omission of the site's existing three-theme count is not a contradiction. Additional professional contact information was authorized for unchanged PDF download, not copied into prose/logs.

Source, public copy and HTTP-downloaded bytes on both root and preview match SHA-256 dd694da4e118042315c30eee3041550b4495dde6a7ad4c963078a4fa957200e7. Source not modified.

## Audit coverage and residual findings

Exact tracked-path inventory: launch-file-inventory.json, 170 tracked paths classified: 136 inspected, 27 generated, 6 binary, 1 deferred. This combines direct integration reads with explicit parent blog handoff coverage. All public pages/components/SCSS, animation hooks, entire admin source, function, custom lint rules/helpers, CI/config, full lockfile, historical guidance and JSON were inspected. The large design export was fully parsed and traversed (796 token leaves, 36 zeros), with responsive values inspected; not every color alias manually reconciled. .env.example was deliberately excluded with credential/environment files; no secrets read.

New/untracked integration paths: src/content/publicUrl.ts, src/content/launchIntegration.test.ts, src/content/routeMetadata.ts, scripts/generate-route-shells.mjs, public/files/carteciano_lance-resume.pdf, agent-generated-docs/launch-file-inventory.json, agent-generated-docs/launch-integration-handoff.md, agent-generated-docs/maintenance-deployment.md, agent-generated-docs/launch-checklist.md. Parent untracked files are enumerated in launch-blog-handoff.md; architect audit/scope preserved unchanged. Full combined changed paths are available via git status --short; generated mirrors deliberately follow sources.

Binary visual inspection: Debase screenshot visibly shows encode/decode, format controls, source/result panels and browser-local copy, supporting alt. Featured 1 is phone mockup; 2 blank-screen laptop pair; 3 Mockuply laptop mockup; 4 tablet/chair mockup. Mask is texture. Generic imagery is not evidence of authored work. Visual review does not establish image licensing; operator must verify usage rights before publication. Remote stock contents are not relied on as evidence. No fake images created.

Deferred CMS findings: category is absent from admin types/editor/serialization and would break public generation; filename/frontmatter slug mismatch can prevent retrieval; JSON image parser checks syntax only; async selection/save/upload responses can overwrite newer state; partial rename can create duplicate files; main branch fallback is unsuitable; SVG/MIME/extension trust, Content-Length-only limits, malformed cookies/referer exceptions, broad OAuth scope and upstream error leakage remain. All must be reviewed before enablement. Three pre-existing function type errors became visible through regression import; fixed generic JSON constraint, optional commit-message input and explicit post narrowing without suppressions.

Custom lint rules are syntactic heuristics, not runtime contract validation. Their own directory is excluded from Oxlint as before; Effect plugin is unused. No complexity gate configured. Historical Figma plan suggests removing resume CTA/grid changes and contains old absolute paths; not current launch authority. Typography reference line heights and some design-system token lists are dated; current SCSS is authoritative. No broad refactor performed.

## Actual verification

Final independent runs: pnpm lint exit 0; pnpm lint:oxlint exit 0; pnpm lint:colors exit 0; pnpm test exit 0 (4 files, 14 tests); pnpm run prebuild exit 0; pnpm build exit 0, includes tsc -b, 102 modules, 18 shells plus 404. git diff --check exit 0. Existing >500 kB minified main chunk warning remains, not suppressed. No dependency changes.

New Vitest regression exercises metadata/preview/missing routes, base URLs/reading estimate, admin routes across methods without asset/network access, Markdown GET/HEAD/trailing slash and wrong-MIME fallback with preserved Vary. Parent generator regressions remain green, including real isolated draft bundle exclusion and stale cleanup.

Focused native-CDP script .playwright/check-integration.mjs passed on root dev and built preview: PDF HTTP checksum, mobile Escape returns focus, homepage handoff, error focus/alert, descendant All projects Enter, single main, four headings, base image, client metadata and missing noindex/no canonical. Initial root run failed because old server had stopped; restarted pnpm dev. Initial preview focus run raced scroll-reveal visibility; scrolling target into view and waiting before focus corrected the harness, final run passed. Shared Chrome was not closed. Resume mobile and footer desktop captures under .playwright/ were visually reviewed: no visible overlap/clipping; CTA legible. This is not the final all-route capture matrix.

.playwright/check-artifact.mjs exit 0: all 18 built route shells, built Markdown GET/HEAD/trailing slash through real function with filesystem-backed ASSETS adapter, missing paths/admin 404, six distinct local content assets present, admin HTML absent and truthful 404. Adapter is not Cloudflare runtime proof. Final dist restored to production after preview build; later prebuild regenerated identical source outputs.

Servers started in this attempt: pnpm dev session proc_d62d0e7fbf6e (4173), preview session proc_08d63bf2b1c9 (4174, preview base; dist now production so rebuild preview before using that server for preview checks). Scripts/captures are ignored working evidence. Full runtime QA should own final evidence and server lifecycle.

## Remaining downstream gates

Architect source acceptance, full final browser matrix/reduced-motion and independent exact-diff review remain. Real Cloudflare/GitHub clean-URL/status/MIME/header behavior, live domain/TLS, deployment and OAuth are unverified, not passed. Deployment requires separate operator authorization. See maintenance-deployment.md and launch-checklist.md for conditions and rollback/release ownership.
