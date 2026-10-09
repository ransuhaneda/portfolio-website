# Content and generated assets

Work in the intended checkout, not the absolute paths in historical notes. Main copy and project facts belong to `content/site-content.json`; blog articles belong to `content/blog/*.md`. Use the local toolchain and commands in [development](development.md).

Run `vp run prebuild` after content changes, including during a running dev session. `vp run dev` regenerates once at startup. `vp run build` regenerates, type-checks, builds and prerenders the public app through React Router. Do not substitute raw `vite build`: it skips required generation. Generated public mirrors, sitemap, security contact and agent indexes plus `src/content/publishedBlogPosts.json` must not be hand-edited. Keep `public/.generated-mirrors.json`: it bounds cleanup of renamed/unpublished/deleted project/blog mirrors.

Blog frontmatter requires title, slug, date (real YYYY-MM-DD), status (`draft` or `published`), excerpt, and one category: `content-systems`, `git-workflow`, or `frontend-quality`. A filename containing “draft” does not control publication. Set status explicitly. Cover image and descriptive alt must be paired. The renderer supports paragraphs, ## headings, dash lists, fenced code, inline code/emphasis/links, not arbitrary HTML or full CommonMark. Draft bodies are excluded before browser bundling. Reading estimates use 200 whitespace-separated words/minute, minimum one minute.

Keep professional claims tied to supplied evidence. The four case-study headings are Problem, My responsibility, What I did, Result. Generic mockups and stock photographs are decoration, not project evidence. The Debase checked-in screenshot is actual interface evidence. Do not generate fictional screenshots. Replace imagery only with approved assets and verify usage rights.

The website resume remains editable JSON. `public/files/carteciano_lance-resume.pdf` is the unchanged approved application resume, not a generated replacement. A future replacement requires privacy/metadata/embedded-action inspection and source/copy/download checksum comparison. Do not copy its additional contact values into site text or logs.

## Editing sequence

1. Read [positioning](../CONTEXT.md) before changing career copy or case studies. Preserve user-authored wording unless the task requests copy changes.
2. Update the editable source. React pages must render shared copy from JSON rather than hardcoding duplicates.
3. If the schema changes, update `src/content/siteContent.ts`, consumers, and `scripts/generate-agent-files.mjs` together.
4. Run `vp run prebuild`. Inspect affected mirrors and the published snapshot, including stale-output cleanup.
5. Run `vp run build` for structural changes. Verify rendered output for presentation changes.

The project schema includes `responsibility` for case studies, `kind` for case-study/experiment classification, resume summary paragraphs, grouped skills, and education. Use the current types and source JSON instead of inventing parallel fields. Featured selection belongs to `home.featuredProjects.slugs` in JSON, not a hardcoded component list.

## Generator ownership

`scripts/generate-agent-files.mjs` owns Markdown mirrors, `llms.txt`, `llms-full.txt`, sitemap, robots, RSS, security contact, agent-skill metadata, and `src/content/publishedBlogPosts.json`. Treat `public/.generated-mirrors.json` as the generator's cleanup boundary. Static images and the approved resume PDF are not generated copy.

Use real evidence for result claims; do not invent metrics or turn planned work into completed outcomes. Draft status, not the filename, controls blog publication. Search, categories, related content, mirrors, and metadata must use the same published source snapshot.
