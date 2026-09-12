# Launch checklist

This is an operator checklist, not launch approval. Deployment date remains the owner's decision.

- [ ] Architect accepts combined source and exact-path audit inventory.
- [ ] Independent final runtime evidence covers 390×844 and 1366×900 for every top-level, project and published blog route, plus unknown routes.
- [ ] Keyboard, menu Escape/focus, contact errors and mailto handoff (without sending), carousel descendant links, reduced motion and related-route freshness verified on final source.
- [ ] Blog body search AND category, empty state, reset, reload, back/forward and article return verified.
- [ ] Draft exclusion, stale mirror cleanup, RSS XML/full article content and all initial/client route metadata verified.
- [ ] Source/copy/served PDF SHA-256 all equal; privacy/embedded-content review retained without echoing extra contact details.
- [ ] Production and `/portfolio-website/` preview route/asset checks complete; preview noindex and production canonicals verified; final dist restored to production.
- [ ] pnpm lint, lint:oxlint, lint:colors, test, prebuild, build and git diff --check each exit 0 on exact final source. Record complexity as not configured, not passed.
- [ ] Independent reviewer approves exact final diff; affected evidence rerun after any remediation.
- [ ] Operator verifies image usage rights and accepts explicitly labeled placeholder imagery, or supplies approved replacements.
- [ ] Operator explicitly authorizes commit/push/release/deployment. No work has been published by this task.
- [ ] Production Cloudflare Pages uses Node 24, pnpm, pnpm build, dist and repository Functions; ADMIN_ENABLED remains unset/false.
- [ ] After authorized deployment: verify custom domain/TLS, clean URLs and trailing slash redirects, real 404 status, GET/HEAD Markdown MIME and Vary, RSS, PDF download, no admin entry/API, production indexing and preview noindex.
- [ ] Record release merge/tag and rollback target per git-branch-release-workflow.md. Do not treat local Vite checks as live Cloudflare/GitHub validation.
