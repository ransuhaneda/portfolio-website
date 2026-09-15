# Why this portfolio uses a Git-backed content system

- Date: 2026-07-22
- Category: Content systems
- Excerpt: How JSON and Markdown keep the portfolio's visible pages, mirrors, and project notes in sync.
- Cover image: https://picsum.photos/seed/git-backed-portfolio-cms/1600/900.jpg

This portfolio keeps its editable content in the repository. Site copy lives in JSON. Blog and project notes live in Markdown. A prebuild script generates the public mirrors, sitemap entries, and agent-readable navigation files.

That is more setup than a tiny hosted CMS, but it solves a problem I keep running into: portfolio copy appears in several places unless one file owns it.

## One source prevents drift

A project title can appear in a card, a detail page, a project index, and a resume entry. A contact address can be correct in the footer and stale in a generated page. Editing each copy by hand makes it easy to miss one.

The editable content file is the source of truth. React pages read from it, and the prebuild script creates derived Markdown and metadata files. Generated files are outputs, not a second place to edit.

Each content change also has a visible diff. A reviewer can see a changed title, description, or link without comparing screenshots.

## Markdown mirrors make the site inspectable

The visual routes are for people. Files such as `/llms-full.txt`, `/projects.md`, and individual project pages expose the same material in a form that is quick to read, search, or inspect without scraping layout.

The mirrors give accessibility tools, search systems, and agents another way to read the site. They also turn content review into a file review. If a claim is outdated, the source and generated copies have a predictable relationship.

The generated files should not be edited directly. The next prebuild can replace them, so a direct change would be temporary and easy to lose.

## Git keeps the rewrite visible

When content is stored in files, a rewrite appears in a diff. I can review changed claims, spot placeholder text, and see whether a project page was updated everywhere before building.

Git also preserves the history of those edits. A future maintainer can identify when a description changed, which files changed together, and whether the update was content-only or part of a structural change.

For this workflow, I validate a content-only commit with `pnpm run prebuild`. A structural change also gets `pnpm build`, and a rendered change gets a browser check.

## This is not a general-purpose CMS

The system leaves out many features of a hosted CMS. It uses a small set of files, predictable generation, and changes I can review in Git.

That trade-off fits a portfolio I edit myself. The content stays portable, the outputs can be regenerated, and a rewrite remains visible in Git.
