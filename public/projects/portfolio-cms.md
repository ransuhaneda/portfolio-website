# Git-backed portfolio content system

- Year: 2026
- Client: Personal portfolio
- Role: Frontend developer
- Stack: React, TypeScript, JSON content, Markdown, Cloudflare Pages, Vite
- Homepage image: https://384721.xyz/images/home/featured-project-4.png

## Summary
The content system behind this site: one JSON file feeds the React pages, generated Markdown, project pages, and machine-readable indexes.

## Overview
This portfolio uses one JSON file for the main site copy and project data. A prebuild script turns that source into React content, public Markdown, a sitemap, and machine-readable indexes.

## Problem
The site needed to serve people and machines while keeping project copy in one editable place.

## My responsibility
Frontend developer

- Git-backed CMS
- Content Architecture
- Markdown Generation
- Cloudflare Pages Functions
- React Content Rendering

## What I did
The React pages and generation script read from the same source. Blog posts stay in Markdown. This keeps me from updating the same copy in several places.

- Kept main site copy in content/site-content.json.
- Generated markdown mirrors for pages, projects, resume, blog, and LLM-friendly indexes.
- Rendered public React routes from shared content instead of hardcoded page copy.
- Used Cloudflare Pages functions to serve markdown when requested.

## Result
I can update the portfolio from one main source, regenerate the public files, and check the human and machine-readable versions together.

- The portfolio can be edited from one source and still publish readable Markdown mirrors.
- People and agents can inspect the content directly instead of scraping the visual pages.
- New case studies and posts have a known place to start.

## Project scope
- Git-backed CMS
- Content Architecture
- Markdown Generation
- Cloudflare Pages Functions
- React Content Rendering

## Reflection
The system is worth keeping because one edit can update the page visitors see and the Markdown files machines can read.
