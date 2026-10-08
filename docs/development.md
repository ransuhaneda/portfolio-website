# Development rules

## Before editing

Inspect the intended checkout, relevant files, `git status`, current branch, and relevant build/check state. Preserve unrelated changes. Prefer the smallest concrete fix that fully solves the issue; avoid speculative abstractions, temporary compatibility paths, and fallback-heavy code. Reuse existing dependencies, components, tokens, and patterns before adding packages or infrastructure.

## Local toolchain

Use Vite+ (`vp`) for local dependency, script, and executable commands. The repository still declares pnpm as its package manager; package scripts and CI can invoke pnpm internally. Read `package.json`, `pnpm-workspace.yaml`, and `vite.config.ts` for current configuration. Node must satisfy the manifest's Node 24 requirement; the generator imports erasable TypeScript directly.

`vp <name>` invokes a built-in command. `vp run <name>` invokes a project script or task. Use the project scripts for app development and production builds:

`vite.config.ts` is the toolchain entry point. Lint rules, environment overrides, plugin registration, and shared lint/format exclusions live in [`tools/lint.config.ts`](../tools/lint.config.ts), imported into the root config. Keep one active lint configuration; do not add a competing standalone Oxlint config.

| Operation | Command |
| --- | --- |
| Install after pulling remote changes | `vp install --frozen-lockfile` |
| Generate content and start the app | `vp run dev` |
| Regenerate content outputs | `vp run prebuild` |
| Generate, type-check, and build the app | `vp run build` |
| Preview the existing build | `vp run preview` |
| Format, lint, and type-check | `vp check` |
| Run tests once | `vp run test` |
| Run configured lint script | `vp run lint` |
| Run explicit Oxlint script | `vp run lint:oxlint` |
| Check color-token usage | `vp run lint:colors` |

Raw `vp build` is not a substitute for the application script: it does not express the required generator, TypeScript build, and React Router build sequence. `vp dev` and `vp run dev` can also differ. The app dev server is configured on port 4173.

Vite+ combines Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. See local `node_modules/vite-plus/docs` or the [Vite+ guide](https://viteplus.dev/guide/). Use `vp help` and `vp <command> --help` for command details; `vp toolchain` (optionally a tool name, or `--global`) for tool versions; `vp why <package>` for dependency relationships. Use `vp env doctor` if runtime or package-manager behavior is wrong, and report its result.

## Verification

Validate at the changed layer:

- Content: run `vp run prebuild` and inspect affected generated outputs.
- Code, structure, styles, build, or generated-output logic: run `vp run build` and affected tests/lint. Build includes `tsc -b`.
- Review: run `vp check` and `vp run test`; inspect project scripts/tasks for additional checks. Do not use autofix across an unrelated dirty worktree.
- Visual or browser behavior: check rendered output. A passed build is not visual approval.
- Documentation only: verify links, reconcile source claims, and run `git diff --check`.
- Release: apply every independent gate in the [launch checklist](launch-checklist.md).

Record actual results and blockers. A local check does not establish live Cloudflare or GitHub Pages behavior. No cyclomatic-complexity gate is configured.

## Working files and browser checks

Use `agent-generated-docs/` for agent-created plans, task lists, reference notes, and other working Markdown. Use clear descriptive filenames. Maintained project rules belong in `docs/`.

Keep Playwright screenshots, snapshots, MCP output, and generated verification files in the ignored `.playwright/`, `.playwright-cli/`, or `.playwright-mcp/` directories, never the repo root. Configure the output path or move misplaced artifacts into those directories.

Reuse the user's existing Chrome CDP endpoint on port 9222. Never close the shared browser. If it is unavailable, ask for a manual check instead of installing or launching another browser. Reuse a suitable existing dev server; start one only if needed and stop any server you started after QA. Do not expose the development server publicly.

For release UI verification, cover 390×844 and 1366×900, detail and unknown routes, menu Escape/focus, contact errors, carousel links, reduced motion, blog filters/history, and PDF integrity. See the checklist for the complete evidence matrix.
