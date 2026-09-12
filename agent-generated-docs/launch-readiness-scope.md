# Portfolio launch-readiness scope

Status: APPROVED for audit and implementation end to end by Ransu (Discord message 1546660082765529141). Routine implementation decisions do not require further approval. Commits, pushes, deployment, publication, and profile/configuration changes remain unauthorized.

## Agreed decisions

- The user will decide the deployment date later; no fixed deadline or launch date is imposed.
- Positioning remains frontend developer first, with WordPress implementation and visual design as supporting strengths. Target seniority and job market are not yet specified.
- Audit the whole repository, then use targeted, behavior-preserving refactors. Keep React/Vite and the existing design; defer broad redesigns and framework migrations.
- The public portfolio and blog must be launch-ready. The admin interface may be deferred; this does not authorize its deletion or leaving publicly exposed security issues unresolved.
- Documentation should include an accurate, concise README, maintenance/deployment instructions, and a launch checklist. Reuse existing documentation and glossary; create ADRs only for consequential trade-offs.
- Focused regression tests, including narrowly scoped new test files where justified, are approved. Do not introduce a new testing framework.
- Audit and implementation are authorized. Deployment and publication are not authorized.

## Additional agreed decisions

- Production target: Cloudflare Pages with `https://384721.xyz` as the intended canonical domain. GitHub Pages remains a temporary preview. Actual deployment/publication is not yet authorized.
- Contact: prioritize direct email and LinkedIn; clearly label the existing email-client handoff. Do not add a contact backend for this release.
- Blog: include search, categories, and RSS in launch scope, in addition to reliable Markdown publishing, draft exclusion, article rendering, navigation, mobile accessibility, and metadata.
- Content: substantive wording improvements may be made directly without per-edit approval. Keep copy natural, concrete, truthful, and consistent with supplied evidence; do not invent responsibilities, results, or metrics.
- Resume: retain the website resume page and offer the user's existing application-ready PDF for download. Do not generate a competing resume or silently alter the supplied PDF.

## Blog and resume decisions

- Search published article titles, summaries, and full article text locally in the browser. Combine search with the selected category, persist filter state in the URL, and provide clear empty results. No external search service.
- Each post has one primary category. Use a flat category filter with an All option; propose a small taxonomy from the actual articles and assign existing posts. No nested taxonomy or separate tagging system.
- RSS contains full published articles and canonical links on `https://384721.xyz`; exclude drafts.
- User supplied resume path: `home/ransu/personal-projects/work-notes/00-WebFiles/webdev-files/job/carteciano_lance-resume.pdf`.
- The supplied relative path does not exist from the session working directory. The absolute candidate `/home/ransu/personal-projects/work-notes/00-WebFiles/webdev-files/job/carteciano_lance-resume.pdf` exists and has a PDF header. Treat this as an explicit leading-slash interpretation, not an exact match to the supplied path. File contents have not yet been reviewed or copied.

## Settled delivery decisions

- Use the explicitly approved absolute resume path above; inspect privacy and factual consistency before copying the unchanged PDF.
- Primary category identifiers: content-systems (Content systems), git-workflow (Git workflow), frontend-quality (Frontend quality). Assign the existing CMS and case-study-writing articles to content-systems, Git workflow to git-workflow, and visual verification to frontend-quality. Preserve frontmatter publication status: the file named draft-notes-on-case-study-writing currently has status: published; its filename is not a draft flag.
- Blog filter URL parameters are q and category; absent category means All. Combine case-insensitive title/excerpt/body search with category. Preserve filters when returning from articles and through browser navigation.
- Delivery board: portfolio-website. Implementation workspace: /home/ransu/personal-projects/portfolio-website-launch-readiness on feat/launch-readiness, created from development and fast-forwarded to the existing detail-route fix without creating commits. The original fix branch/workspace remains preserved.

## Initial repository observations (not a completed audit)

- Inspected branch: `fix/detail-route-content-refresh`; working tree was clean before this scope document was added.
- Existing glossary: `CONTEXT.md`, with employment-first positioning.
- Vite currently builds both public and admin entry points, with a GitHub Pages base-path option.
- Cloudflare Pages configuration and a GitHub Pages deployment workflow both exist.
- `ContactForm.tsx` currently opens a `mailto:` link; it does not submit messages to a backend.
- No dedicated portfolio board appeared in the inspected Kanban board list. Use an explicit project board for the agreed delivery phase, not another project's current board.
- The codebase index reports partial SCSS parsing, so direct source inspection is required for styles.
