# Another Markdown Viewer

- Year: 2026
- Client: Personal project
- Role: Frontend developer
- Stack: TypeScript, Vite, CodeMirror 6, Marked, DOMPurify, Vitest, Playwright

## Summary
A client-side Markdown workspace for editing source, checking a rendered preview, recovering a local draft, and exporting a print-ready PDF.

## Overview
Another Markdown Viewer is a browser-based workspace for editing Markdown, checking its rendered form, and exporting a PDF. The raw Markdown remains the document state throughout the workflow.

## Problem
I wanted a focused way to make small Markdown edits and inspect the rendered document without losing the original source or requiring an app backend.

## My responsibility
I built this project independently from the initial product idea through implementation, testing, and deployment. I owned the editor, Markdown rendering, browser storage, file operations, PDF export, and release verification.

- Browser-based Markdown editing
- GFM rendering and HTML sanitization
- Local draft recovery
- Markdown file operations
- Print-to-PDF export
- Automated tests

## What I did
I kept the editor, renderer, recovery, and file actions separate so each part has a clear job and the source stays readable.

- Built a browser app with Vite and TypeScript, using CodeMirror 6 for source editing and Marked for GitHub-Flavored Markdown rendering.
- Kept raw Markdown as the canonical document state and sanitized rendered HTML with DOMPurify and an explicit URL policy.
- Added source ranges to rendered blocks so selecting preview content can take me back to its Markdown source.
- Separated automatic local draft recovery from explicit Markdown file downloads, and used browser print styles for PDF export.
- Added Vitest and Playwright coverage for Markdown behavior and browser workflows.

## Result
The v0.1.0 app supports source editing, a sanitized GFM preview, local draft recovery, Markdown file operations, and browser print-to-PDF.

- Deployed the v0.1.0 project as a live site at https://md-viewer.384721.xyz/ and kept the source available in a public GitHub repository.
- The browser workflow keeps editing, rendering, recovery, and print preparation on the client without a required backend runtime.
- The project keeps Markdown as editable text instead of treating the rendered document as the source.

## Project scope
- Browser-based Markdown editing
- GFM rendering and HTML sanitization
- Local draft recovery
- Markdown file operations
- Print-to-PDF export
- Automated tests

## Reflection
Keeping the raw Markdown as the source of truth made it easier to connect editing, preview, recovery, and export without making those flows compete for ownership of the document.
