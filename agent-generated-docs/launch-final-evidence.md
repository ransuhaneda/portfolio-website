# Final local launch QA evidence — t_f3894ada

Mechanical QA complete; not independent approval, deployment, or permission to publish. Next owner: reviewer t_21743ef9.

## Exact artifact and scope

Workspace /home/ransu/personal-projects/portfolio-website-launch-readiness, branch feat/launch-readiness, HEAD 1e1f672ffe2b5c05f7c8616890c1b091ece14f9b. No source implementation changes, commits, pushes, deployments, credentials/profile changes, OAuth, external messages or mail sends. Parent uncommitted work preserved. Only this report and ignored .playwright verification files authored/adjusted; standard builds regenerated outputs. Final dist restored to production.

Read approved scope, audit, acceptance, integration handoff, route metadata, blog archive, contact/carousel/root code and existing pipeline/integration tests. This is runtime QA, not a new claim of exhaustive source audit. Acceptance/inventory limitations remain: .env.example excluded, licensing unestablished, design color aliases not all reconciled, historical documentation drift, retained disabled admin not security-certified.

## Independent command results

Each command ran independently with its own captured stdout/stderr and exit reported by terminal, not inferred from the last command of a semicolon chain:

| Command | Exit | Raw log |
| --- | --- | --- |
| pnpm lint | 0 | .playwright/final/lint.log |
| pnpm lint:oxlint | 0 | .playwright/final/oxlint.log |
| pnpm lint:colors | 0 | .playwright/final/colors.log |
| pnpm test | 0 | .playwright/final/test.log |
| pnpm run prebuild | 0 | .playwright/final/prebuild.log |
| pnpm build | 0 | .playwright/final/build.log |
| GITHUB_PAGES=true pnpm build | 0 | .playwright/final/preview-build.log |
| pnpm build (final production restore) | 0 | .playwright/final/production-restore.log |
| pnpm test (final) | 0 | .playwright/final/test-final.log |
| git diff --check | 0 | terminal result |

Vitest: 4 files, 14 tests passed. Build includes tsc -b, Vite and route shells. Existing >500 kB main chunk warning remains; no suppression. Complexity gate: not configured (not claimed passed).

## Browser matrix

Reused existing Chrome 152 via http://127.0.0.1:9222; did not launch or close a browser. Served real dist via pnpm preview: production localhost:4175, preview localhost:4176 with GITHUB_PAGES=true. Browser scripts connect native CDP to the shared page. Servers are local-only; preview server now points to restored production dist and must not be treated as current preview without rebuilding.

.playwright/final/matrix.mjs completed exit 0 in both modes. JSON manifests production-matrix.json and preview-matrix.json enumerate exact screenshot filenames, paths, viewport widths, URL, metadata and local image load results. Python contact-sheets.py verified 40 unique route/viewport entries per mode, 80 total, from saved JSON rather than inferred counts.

Each mode covers 390x844 and 1366x900 for:

- /, /about, /resume, /contact, /projects, /blog, /design-system
- /projects/wordpress-maintenance-system, /projects/abcde-creative, /projects/debase, /projects/nsight-index, /projects/portfolio-cms, /projects/gsap-animation, /projects/tetherly
- /blog/build-correctness-is-not-visual-correctness, /blog/git-release-workflow-for-small-teams, /blog/git-backed-portfolio-cms, /blog/writing-useful-portfolio-case-studies
- /unknown-final-qa, /blog/draft-final-qa (unknown unpublished route, not an invented source article)

Assertions per entry: h1 present, one main, no document horizontal overflow, every local image decoded, client title/description/canonical/OG type/title/description/article date and robots match source. Preview noindex, production canonical retained. Unknown entries no canonical/noindex. Reduced-motion media emulated during matrix; visible content remained rendered. Local lazy images explicitly decoded before capture, not incorrectly classified as broken because offscreen.

Screenshot naming: .playwright/final/{production|preview}-{390|1366}-{home|route-with-slashes-replaced}.png. Contact sheets sheet-{mode}-{width}-{0|5|10|15}.jpg cover every saved viewport. All sixteen sheets were visually inspected using vision tools; additional full-size mobile home/blog, desktop Debase, filter/empty/error and related blog views inspected. No confirmed overlap/clipping defects. Ordinary viewport-bottom continuation is not clipping. Vision conjectured an absent initial I in NSIGHT; actual project name is NSIGHT, so that is not a defect. Some subdued secondary text and large headlines noted; no redesign inferred. Captures establish visible viewport quality, not exhaustive full-page pixel inspection.

## Interaction and file evidence

- .playwright/check-blog.mjs exit 0, raw final/blog-runtime.log: body-only reachability AND git-workflow yields the Git article; unrelated utm retained; reload and article-return preserve URL; incompatible category produces no results; back/forward restores filters; reset restores four notes. RSS browser DOMParser returns zero errors/four items.
- .playwright/check-integration.mjs exit 0, raw final/integration-runtime.log: mobile Escape closes disclosure and restores toggle focus; contact required-name focus/live alert; homepage handoff disclosure; keyboard Enter on carousel descendant All projects navigates correctly; single main/four case-study headings; base-aware image and client metadata; missing route noindex.
- final/interactions.mjs exit 0, raw interactions.log: keyboard skip link followed by Tab continues inside main; next/previous carousel changes/restores project; related project and blog links perform client navigation; invalid name/email focus and aria-invalid; actual resume page download.
- Related transitions exercised: Debase -> WordPress maintenance and Git-backed CMS article -> build correctness article. related-project-mobile.png and related-blog-mobile.png show the new route. Existing related-content tests remain green; this script verifies route/H1 presence rather than an exhaustive related-card set comparison.
- filter-mobile.png and empty-mobile.png recaptured after instant scroll and visually inspected with actual result/no-result content visible. The original contact-invalid-mobile.png was incorrectly described as showing errors: it showed only the hero/options. Its old interactions.mjs capture is superseded by the focused repair below; do not rerun that historical script to reproduce the repaired capture. The archive count uses singular/plural wording correctly.
- final/mailto.mjs exit 0, raw mailto.log: valid synthetic QA inputs caused Page.frameRequestedNavigation with mailto scheme. No send action; no recipient/payload logged.
- Actual a[download] activation saved PDF under .playwright/final. HTTP Content-Type application/pdf. Source, public copy, dist and actual browser download all SHA256 dd694da4e118042315c30eee3041550b4495dde6a7ad4c963078a4fa957200e7. pdf-integrity.json records only MIME/hash; no PDF contact information copied.

## Outputs, feed, draft and routing

final/outputs.mjs exit 0 on production and preview; logs outputs.log and preview-outputs.log. HTTP-checked built JS/CSS/images/fonts/PDF/XML MIME rather than trusting status alone; all matching built assets passed. Exact initial metadata tag strings compared for all 18 route shells using explicit index.html URLs, separately from client assertions. Artifact inventory reports 59 dist files, not 59 MIME-classified assets.

Reviewer-observed Vite preview limitation independently reproduced during t_f15710c6: GET http://localhost:4175/about returns 200 with homepage initial title/canonical; /about/ and /about/index.html return 200 with correct About metadata; /unknown-final-qa returns 200 with homepage initial HTML metadata. Raw results are in .playwright/final/contact-repair.json and contact-repair.log. Client-rendered matrix metadata does not prove initial HTTP metadata/status. The 18 explicit-shell checks and filesystem function adapter (which supplies directory mapping itself) do not prove deployed Cloudflare clean-URL resolution or 404 behavior. This is a local Vite fallback limitation, not a proven Cloudflare defect. Deployment remains unauthorized and unverified.

Imported real Cloudflare onRequest under Node with a filesystem-backed ASSETS adapter. GET/HEAD x HTML/Markdown x plain/trailing slash checked for every known route and missing/blog-draft/admin/API-admin. Known 200, missing/admin 404, HEAD empty. Wrong HTML fallback for Markdown rejected 404 with Vary Accept. Existing integration tests additionally assert retained Vary Origin and incomplete admin configuration across GET/HEAD/POST/PUT/DELETE without asset/network access. This is a local function harness, NOT deployed Cloudflare runtime/settings proof. Root function behavior is checked against both output modes; GitHub preview does not run Cloudflare functions.

final/feed.py exit 0: XML parsed, four items, title/link/GUID/date/category, sitemap and mirror parity. Every content:encoded value equals the complete rendered source body (rendered-feed.json from shared renderer); no truncation, raw script or javascript scheme. Escaping/raw HTML/unsafe schemes/unlabeled fenced whitespace and safe absolute links covered by existing behavior tests.

Existing blogPipeline isolated fixture test passed in both full test runs: actual generator and Vite fixture bundle; draft sentinel excluded from published JSON, bundle, feed, indexes, llms and sitemap; rename/unpublish/project-delete removes owned mirrors while retaining unowned manual asset. All four real source articles remain published, including the misleading draft-named file. No source article was unpublished for QA.

## Hash anchors after final production restore

Full machine-readable anchors: .playwright/final/artifact-hashes.json.

- dist/assets/main-Ob1ibFJv.js: 315c578a496cfe741e768eba404bc19ceb651b304cc1ae668b4ea521d9805ffc
- dist/assets/main-C_y1cUuy.css: 95503f89297c28033081bcbfda5ca3ccdc8d2280a624850cdd3cbee8ba80159c
- content/site-content.json: 8c9c836747f431ada2235e689015e8c913120e3b81740b6e1ff6fdfe418911d8
- src/content/publishedBlogPosts.json: 978b41d3b0dedc56fb7f2c9d52c4247c48b791b9f5f237afb4ec4c51e2a2b756
- public/rss.xml: f339bb311e59c0b82798137f7a21a13fe449c443447e54263f3bb21eda744304
- functions/[[path]].ts: 7eaf6a905ca03d026fb4dc8cb25e27a96712be347f479507c6cd4996f32932a7

Production JS/CSS/published snapshot/feed anchors match acceptance. Source changes after this run invalidate affected evidence.

## Honest limits and harness corrections

Live domain/TLS, Cloudflare settings/ASSETS host behavior, deployed GitHub clean URLs and OAuth remain unverified and unauthorized. GitHub 404 fallback can render React while retaining HTTP 404; local Vite fallback is not proof of host success status. No deployment or launch approval implied. Image rights remain operator-owned. Screen-reader speech and physical mobile device behavior not measured; browser focus/DOM/live-region contracts were exercised.

Initial harness failures were corrected without source edits: browser injected horse prefix on document.title (no source occurrence; retained raw title in JSON, compared after prefix removal); lazy images not decoded yet; preview dist initially served by root-base server; skip target main is not focusable but subsequent Tab correctly continues in main; escaped selector typo; filesystem adapter initially skipped file existence on HEAD and falsely returned missing 200. Final reruns passed. One vision connection failure retried successfully. Raw-IP preview startup and combined curl command/security scans were rejected; ordinary localhost pnpm preview and pnpm script execution worked without approval/config changes.

## Focused evidence repair — t_f15710c6

Ran `python3 -B .playwright/final/repair-integrity.py before` and `pnpm exec node .playwright/final/contact-repair.mjs` (exit 0). Reused the existing Chrome CDP page on port 9222 against unchanged production dist at localhost:4175; no browser launch/close, source edits, mail sends or mailto navigation. The script clicks the visible submit button with CDP mouse events, verifies first-error focus, then scrolls the form into the viewport without changing focus before capture. Inputs are synthetic: empty required fields, then name “QA Verification”, email “invalid”, empty message.

| Full viewport capture under .playwright/final/ | State and verified focus |
| --- | --- |
| contact-required-mobile.png (390x844) | Three required-field errors; name focused |
| contact-invalid-mobile.png (390x844, replaced incorrect original) | Invalid-email and required-message errors; email focused |
| contact-required-desktop.png (1366x900) | Three required-field errors; name focused |
| contact-invalid-desktop.png (1366x900) | Invalid-email and required-message errors; email focused |

All four full images were visually inspected, not just contact sheets/crops of the form. All fields, field-specific errors, validation summary and Draft email control are readable in frame without form overlap/clipping. Name focus is visually apparent in both required-state images and email focus in mobile invalid state. Desktop invalid-state focus styling is subtle: visual inspection could not establish a strong distinct ring; DOM activeElement proves email focus, rather than claiming an unmistakable visual ring. Partial surrounding/footer content is ordinary scroll continuation. Per-field/error/control viewport bounds, aria-invalid, activeElement, focus-visible matching and zero horizontal overflow are recorded in contact-repair.json; four capture results and zero mailto requests in contact-repair.log. No implementation defect was established requiring source changes.

Baseline integrity was verified before capture: sorted 72 modified/untracked Git paths hashed as path + NUL + bytes + NUL equal reviewer digest e4dcca55d935877a944875f1216abd7f72f7ecccf4aa074c503024e9b6b57298. repair-before.json and repair-after.json record every path hash and all 59 dist file hashes. The after-check permits only this report to change in the Git delivery set and requires exact dist hash equality. No build/test rerun was needed for this evidence-only repair; original gate logs above are retained, not claimed rerun. `git diff --check` rerun after correction. An inline Python integrity invocation was blocked by command policy; the saved script ran without changing protections.

No confirmed implementation blocker established in this mechanical pass. Independent reviewer t_21743ef9 must reassess the repaired evidence, residual audit coverage, exact diff and limitations. This handoff is not independent approval or launch authorization.
