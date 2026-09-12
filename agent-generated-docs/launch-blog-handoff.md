# Blog pipeline implementation handoff

Task: t_571a5543. Next owner: coder t_f6d0e287, then the existing acceptance/runtime/reviewer graph. This is implementation completion, not launch approval.

Workspace: /home/ransu/personal-projects/portfolio-website-launch-readiness. Branch feat/launch-readiness; HEAD remains 1e1f672. No commits, pushes, deployment, publication-status changes, profile changes or original-checkout edits. Preserved and finished the previous interrupted implementation rather than resetting it.

## Implementation

- Required categories and metadata validation in src/content/blogSchema.ts. Validates real ISO calendar dates, safe route slugs, required title/excerpt/body/status/category, cover alt when a cover exists, duplicate frontmatter keys and duplicate post slugs. All four existing articles remain published.
- scripts/generate-agent-files.mjs owns publication selection. src/content/blogContent.ts now imports generated src/content/publishedBlogPosts.json, never raw draft Markdown. The generator uses the same schema and Markdown renderer as public consumers.
- src/content/blogFilters.ts combines case-insensitive title/excerpt/body substring search with category. URL q/category are authoritative; missing/unknown category means All; updates and reset preserve unrelated parameters without mutating their input.
- src/pages/BlogPage.tsx adds labeled search/category controls, reset, live empty/results state and visible RSS. Article URLs carry query context. src/pages/BlogPostPage.tsx preserves archive query context through back/all-notes/related links and uses safe inline Markdown rendering.
- src/content/blogMarkdown.ts fixes unlabeled fenced code and preserves interior code whitespace. Supports existing article headings, paragraphs, lists, code fences, inline code, emphasis and links. Raw HTML is escaped; link protocols restricted to http/https/mailto with control characters rejected. This is intentionally a small Markdown dialect, not full CommonMark.
- public/rss.xml has full escaped safe HTML, canonical production GUID/link/self URL, UTC publication dates and category labels. index.html provides base-aware feed discovery; archive feed link is also base-aware.
- public/.generated-mirrors.json records exact owned blog/project mirrors. Subsequent generation removes only obsolete owned paths, validates manifest path bounds and retains unrelated files. Keep this manifest with generated outputs. On an absent manifest, ownership starts with current outputs; it does not guess ownership of arbitrary historical files.

## Exact source/audit coverage

Fully inspected tracked files in the requested directories:
- content/blog/2026-07-22-draft-notes-on-case-study-writing.md — published despite filename; category content-systems added, prose unchanged.
- content/blog/2026-07-22-lightweight-git-backed-portfolio-cms.md — content-systems added; inline code used in body; prose unchanged.
- content/blog/2026-08-21-git-workflow-for-small-teams.md — git-workflow added; fenced shell code must retain whitespace; prose unchanged.
- content/blog/2026-08-26-build-correctness-is-not-visual-correctness.md — frontend-quality added; list rendering retained; prose unchanged.
- scripts/generate-agent-files.mjs — shared validation, snapshot, full-content RSS and bounded cleanup added.
- scripts/check-color-tokens.mjs — inspected, unchanged; checks src SCSS color usage.
- src/content/blogContent.ts — raw eager glob removed.
- src/content/blogMarkdown.ts — safe shared renderer and fence fix.
- src/content/siteContent.ts — fully inspected; only six blog control labels added to type contract. Existing broad JSON assertion is unchanged.
- src/content/relatedContent.ts and src/content/relatedContent.test.ts — inspected, unchanged; related-entry exclusion remains covered.
- src/pages/BlogPage.tsx, src/pages/BlogPostPage.tsx and src/pages/InternalPages.module.scss — fully inspected; narrow archive/filter/detail rendering edits, token-based control styles. Existing unrelated styles unchanged.

Additional inspected files: AGENTS.md, README.md, CONTEXT.md, agent-generated-docs/launch-readiness-audit.md, agent-generated-docs/launch-readiness-scope.md, package.json, eslint.config.js, oxlint.config.ts. Guidance/config files unchanged. content/site-content.json inspected at the changed blog labels only; exhaustive remaining JSON coverage belongs to integration.

New source files: src/content/blogSchema.ts, src/content/blogFilters.ts, src/content/blogPipeline.test.ts.
Generated new files: src/content/publishedBlogPosts.json, public/.generated-mirrors.json, public/rss.xml.
Other changed source: content/site-content.json, index.html (feed link only).
Generated changed files: public/blog.md; public/blog/build-correctness-is-not-visual-correctness.md; public/blog/git-backed-portfolio-cms.md; public/blog/git-release-workflow-for-small-teams.md; public/blog/writing-useful-portfolio-case-studies.md; public/llms-full.txt; public/llms.txt; public/sitemap.xml. Equal-date posts now have a deterministic slug tie-break order. Remaining generated project/static mirrors are regenerated without content changes.
No binary files inspected or modified in this phase. Remote placeholder covers not visually inspected; their inaccurate descriptive alt text is a known integration responsibility, not a verified depiction of real work.

## Real verification

Final individual command results:
- pnpm run lint: exit 0.
- pnpm run lint:oxlint: exit 0.
- pnpm run lint:colors: exit 0.
- pnpm test: exit 0; 3 test files, 11 tests passed.
- pnpm build: exit 0, including prebuild and tsc -b; Vite built 119 modules.
- git diff --check: exit 0.
- Cyclomatic complexity gate: not configured in inspected ESLint/Oxlint config; no threshold changed or suppressed.

The new narrow Vitest suite executes the real generator in a temporary isolated directory, not mocked modules and not user content mutations. Checks include invalid metadata/duplicate slugs, full-body AND category filtering, unrelated URL parameters/reset, unknown category, unlabeled code whitespace, hostile HTML/URLs, full HTML feed, canonical GUID/category, sentinel draft exclusion from snapshot/feed/index/LLM/sitemap, a real Vite fixture bundle containing published text but not draft sentinel, post rename/unpublish removal, project delete removal and preservation of an unowned Markdown asset. Temporary fixtures are removed in finally.

Rendered smoke check: pnpm exec node .playwright/check-blog.mjs, exit 0, using the already-running shared Chrome 152 at http://127.0.0.1:9222 via native CDP. PASS: body-only query reachability AND git-workflow, unrelated utm_source retention, reload, article return, no results, browser back/forward, reset to four posts, RSS parsed through browser DOMParser with zero XML errors and four items. The script is ignored working evidence, not a new application dependency. Earlier automation runs hit reload synchronization races; the final run waits for reload and passed. Python Playwright was unavailable and a package-fetch security check was blocked; native Node WebSocket/CDP required no install or browser launch. The shared browser was not closed.

Dev server started with pnpm dev on localhost:4173 (background session proc_e47b863f3fb4); reusable by integration. Production dist was rebuilt last; no preview-base build performed in this phase.

## Known gaps / downstream responsibilities

- Full visual/mobile/reduced-motion/keyboard matrix, production/preview deployment routing and exact final-diff independent review are later graph gates. This smoke test is not screenshot-based visual approval.
- Admin is still in the default build and its API still needs containment under t_f6d0e287. No live OAuth/API publishing exercised.
- Metadata route shells, resume, local asset base-prefix handling, homepage reading time, accessibility fixes and remaining source audit are explicitly integration scope. Current safe article inline links resolve against the canonical article URL; preview-local link policy needs integration when adding linked local article content (existing posts use inline code, not Markdown links).
- Node must support native erasable TypeScript imports for prebuild (verified on Node v24.16.0). Document supported Node runtime in integration docs/CI review.
- Published snapshot is refreshed by pnpm dev startup/prebuild/build; after changing Markdown in an already-running dev session, rerun pnpm run prebuild. Do not edit generated JSON directly or invoke a raw Vite build to bypass publication generation.
- Architect audit/scope documents were pre-existing untracked files and remain untouched. Preserve all worktree changes for serialized integration.
