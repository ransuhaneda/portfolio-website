# Launch source acceptance — t_46baef8b

Decision: ACCEPT the integrated source boundary for runtime QA. This is not independent final approval or permission to publish. No source-remediation blocker was established in this acceptance pass.

## Objective, route and ownership

Retain React/Vite and the existing design, JSON-owned site content, Markdown-owned blog sources, a generated published-only snapshot, small build-time metadata shells, and default-disabled retained admin. No framework, service or speculative admin enablement layer is needed. Approved scope and launch-readiness-audit.md remain the authority.

Workspace: /home/ransu/personal-projects/portfolio-website-launch-readiness. Branch feat/launch-readiness; HEAD 1e1f672ffe2b5c05f7c8616890c1b091ece14f9b. `git merge-base --is-ancestor 1e1f672 HEAD` passed. Related-content helper/tests and spacing token/base files have no diff from HEAD. Both detail pages still derive related entries from the current slug; BlogPostPage retains slug-dependent GSAP teardown/reinitialization and keyed content. Runtime navigation freshness remains a QA requirement.

Graph, verified from live cards: integration t_f6d0e287 (done) -> this acceptance -> coder runtime QA t_f3894ada -> independent reviewer t_21743ef9 -> operator t_ab9e4cae. No new cards or parallel source writers introduced. Only this report authored; verification regenerated existing outputs through the normal build. No implementation edits, commits, push, deployment, profile edits or secret reads.

## Source acceptance evidence

- Publication and taxonomy: direct frontmatter search and Git diff confirm all four existing articles remain published, including the draft-named case-study file. Their categories match the settled content-systems / git-workflow / frontend-quality assignments. Article body prose is preserved in the diff.
- Build boundary: blogContent.ts imports publishedBlogPosts.json rather than raw Markdown. Generator loads and validates all article sources before selecting published posts; blogSchema.ts validates required fields, actual dates, route-safe slugs and duplicates. Existing isolated regression executes the real generator and a real Vite fixture bundle, checking draft sentinel absence and rename/unpublish/project-delete cleanup while preserving an unowned asset. These tests passed in this run.
- Filters: blogFilters.ts implements case-insensitive title/excerpt/body substring search AND category. q/category are authoritative; unknown category means All; updates preserve unrelated parameters. BlogPage controls, reset and article links use those helpers; BlogPostPage carries query context through archive/related links. Behavior-level filter tests passed; browser history/reload/article-return matrix remains next owner's work.
- RSS and rendering: generator emits canonical https://384721.xyz links/GUIDs, UTC dates, category labels and full rendered article HTML in content:encoded. Read representative actual public/rss.xml output, including full prose and fenced shell code. Shared renderer escapes raw HTML and restricts link protocols, preserves unlabeled code whitespace, and rewrites same-origin article links for browser preview only. Safe rendering/full-feed regressions passed. Final XML parser and all-item comparisons remain runtime QA.
- Cleanup: public/.generated-mirrors.json bounds blog/project deletion to exact route-safe owned paths; metadata/slug validation precedes output writes. Missing manifest does not infer ownership of arbitrary historical files. This deliberate limit is documented, not a claim to clean unknown assets.
- Metadata: routeMetadata.ts derives known-route title/description/canonical/OG/article date and RSS metadata from source; unknown routes omit canonical and are noindex. generate-route-shells.mjs writes known directory shells and distinct 404; RootLayout updates the same metadata on client navigation. Existing artifact harness passed all 18 production shells after a fresh build. Preview logic uses noindex and production canonical. Shells are metadata-only, not server-rendered page bodies.
- Admin containment: Vite has only the public HTML input. Function guard covers admin/UI/API prefixes before asset/API access, requires exact ADMIN_ENABLED=true and complete nonempty configuration for any opt-in. Method matrix tests exercise incomplete configuration without allowing assets/network. Dist has no admin HTML. Deferred CMS schema/race/upload/auth risks remain explicitly documented; containment is not repair or authorization to enable.
- Routes: inspected function GET/HEAD/trailing-slash negotiation and MIME checks. Existing filesystem-backed ASSETS harness passed known Markdown paths, missing paths, admin absence and truthful 404. It is not actual Cloudflare runtime or host redirect proof.
- Assets and resume: publicUrl.ts, carousel preload/render, detail visuals, footer and resume changes use preview-aware local URLs; Router Links retain basename ownership. Fresh artifact harness found all six distinct local content assets. Source/public/dist PDF SHA-256 all equal dd694da4e118042315c30eee3041550b4495dde6a7ad4c963078a4fa957200e7. Metadata/embedded privacy inspection is upstream operator evidence, not repeated here; no extra PDF contact values copied into this report. Actual page download/MIME must be repeated by runtime QA.
- Accessibility and copy: inspected removal of nested main, descendant key guards, disclosure Escape-to-toggle focus, contact first-error focus/live alert and explicit content-owned mail-app handoff. Derived reading estimate is shared. Four explicit case-study headings remain. Content diff primarily adds functional labels/download and replaces unsupported stock-photo descriptions with neutral disclosure; no new employment metrics or stronger biography claims introduced. Placeholder assets remain placeholders, not authored-work proof.
- Documentation: README, maintenance/deployment and checklist accurately separate source generation, Node 24, production/preview, disabled CMS, operator authorization and remaining release checks. Historical scope observations are snapshots, not current implementation status.

## Coverage inventory and limitations

`git ls-files | wc -l` returned 170. Exact inventory path search returned 170 entries; compared its sorted listing against the Git listing. The inventory generation source enumerates git ls-files, and its original terminal output reports 170 classified: 136 inspected, 27 generated, 6 binary, 1 deferred. New/untracked delivery files are separately enumerated by the two handoffs and current git status; inspected representative new contracts, tests and generator files directly.

The inventory is a coverage ledger, not standalone proof that every row received deep review: many findings are generic category text. This acceptance is a representative contract/data-flow review, not a second exhaustive file audit. Independent reviewer must assess combined source-read evidence and residual gaps. Explicit residuals: .env.example deliberately unread; image licensing unestablished; design-export color aliases not individually reconciled; historical documentation drift acknowledged; deferred admin not security-certified. No credentials read. Those documented limitations do not prevent public-only runtime QA.

## Checks actually exercised here

- `pnpm lint && pnpm lint:oxlint && pnpm lint:colors && pnpm test && git diff --check`: exit 0. AND chaining establishes each preceding success. Vitest: 4 files, 14 tests passed.
- `pnpm exec tsc -b --pretty false`: passed, including a later successful AND chain with artifact validation and diff check.
- `pnpm build`: exit 0; actual output ran prebuild, tsc -b, Vite and route-shell generation; 102 modules, 18 shells plus 404. Production artifact restored/current.
- `pnpm exec node .playwright/check-artifact.mjs`: exit 0 before and after fresh build. Actual output: PASS, routes 18, localAssets 6; initial metadata, built Markdown GET/HEAD/trailing slash, missing paths, admin absent, local assets, truthful 404.
- Source/public/dist PDF checksums matched the expected hash.
- `git diff --check`: exit 0 after build. No changes to baseline related-content tests/helper or token/base style files.

Build warning retained: main JS 565.85 kB (gzip 192.70 kB), exceeds Vite's 500 kB warning threshold. No threshold suppression; no complexity gate configured. This is a performance risk to inspect in rendered QA, not a build failure.

Evidence limitations/tool failures: inline Python/Node inventory comparison commands were denied by the headless security gate; jq was unavailable. Used tool-based path enumeration, Git listing and the inspected existing inventory generator instead; did not alter approval configuration. Cross-profile session read exposed original test/prebuild/inventory terminal records, but scrolling returned session-not-found and discovery found no build record; therefore rebuilt directly rather than relying on the prose build claim. No browser screenshots created or visually approved in this architect pass.

Artifact anchors after this pass:

- dist/assets/main-Ob1ibFJv.js: 315c578a496cfe741e768eba404bc19ceb651b304cc1ae668b4ea521d9805ffc
- dist/assets/main-C_y1cUuy.css: 95503f89297c28033081bcbfda5ca3ccdc8d2280a624850cdd3cbee8ba80159c
- src/content/publishedBlogPosts.json: 978b41d3b0dedc56fb7f2c9d52c4247c48b791b9f5f237afb4ec4c51e2a2b756
- public/rss.xml: f339bb311e59c0b82798137f7a21a13fe449c443447e54263f3bb21eda744304

## Required next checks / risks / blockers

Next owner: coder t_f3894ada. Execute its complete production/preview all-route viewport matrix, inspect screenshots, keyboard/focus/reduced-motion/related-navigation behavior, combined filter history, actual PDF download, RSS parser, source/output parity and function/asset MIME/status checks. Save raw per-command exits/logs and artifact/source hashes for the read-only independent reviewer; do not provide only summaries. Reuse shared Chrome and restore production after preview.

Pay particular attention to real clean-URL trailing-slash behavior, unknown HTML routes and wrong asset MIME: the filesystem adapter cannot prove Cloudflare/GitHub hosting. Check every initial title/description/OG/date, not just canonical presence. Ensure source changes invalidate affected screenshots and are rechecked. Independent reviewer t_21743ef9 must approve the exact final diff/evidence before operator completion.

No current external blocker for runtime QA. Live deployment/domain/TLS/OAuth and image rights remain unverified operator boundaries, not passed checks. No launch or publication approval is granted by this report.
