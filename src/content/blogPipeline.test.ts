import { describe, expect, it } from 'vitest'
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { parseBlogPost, selectPublishedBlogPosts } from './blogSchema'
import { filterBlogPosts, getBlogFilters, updateBlogFilters } from './blogFilters'
import { parseBlogMarkdownBlocks, renderBlogHtml, safeBlogUrl } from './blogMarkdown'

const article = (slug = 'fixture', status = 'published') => `---
title: "Fixture & title"
slug: "${slug}"
date: "2026-08-21"
status: "${status}"
category: "git-workflow"
excerpt: "Summary match"
---
BodyOnlyNeedle with **bold** and [local](/about).

\`\`\`
  <script>unsafe & text</script>
\`\`\`
`

describe('blog content contract', () => {
  it('validates metadata, dates, slugs and duplicates before publication', () => {
    const post = parseBlogPost(article())
    expect(selectPublishedBlogPosts([post, parseBlogPost(article('draft', 'draft'))])).toEqual([post])
    expect(() => selectPublishedBlogPosts([post, post])).toThrow('Duplicate blog slug')
    for (const invalid of [article('../escape'), article().replace('2026-08-21', '2026-02-30'), article().replace('category: "git-workflow"\n', ''), article().replace('"git-workflow"', '"unknown"'), article().replace('title: "Fixture & title"', 'title: ""')]) {
      expect(() => parseBlogPost(invalid)).toThrow()
    }
  })

  it('combines title, excerpt and full-body search with category and preserves other URL keys', () => {
    const posts = [parseBlogPost(article())]
    for (const query of ['fixture', 'SUMMARY', 'bodyonlyneedle']) {
      expect(filterBlogPosts(posts, new URLSearchParams({ q: query, category: 'git-workflow' }))).toEqual(posts)
      expect(filterBlogPosts(posts, new URLSearchParams({ q: query, category: 'content-systems' }))).toEqual([])
    }
    expect(filterBlogPosts(posts, new URLSearchParams('q=absent'))).toEqual([])
    expect(getBlogFilters(new URLSearchParams('category=unknown')).category).toBe('')
    const original = new URLSearchParams('q=old&category=git-workflow&utm_source=check')
    const next = updateBlogFilters(original, 'q', 'new')
    expect(next.get('category')).toBe('git-workflow')
    expect(next.get('utm_source')).toBe('check')
    expect(original.get('q')).toBe('old')
    expect(updateBlogFilters(updateBlogFilters(next, 'q', ''), 'category', '').toString()).toBe('utm_source=check')
  })

  it('preserves unlabeled code whitespace and renders only safe inline markup', () => {
    expect(parseBlogMarkdownBlocks('```\n  x\n\n y\n```')).toEqual([{ type: 'code', language: undefined, code: '  x\n\n y' }])
    const html = renderBlogHtml(parseBlogPost(article()).body, 'https://384721.xyz/blog/fixture')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('href="https://384721.xyz/about"')
    expect(html).toContain('  &lt;script&gt;unsafe &amp; text&lt;/script&gt;')
    expect(renderBlogHtml('<img src=x onerror=alert(1)> [bad](javascript:alert) `code`', 'https://384721.xyz')).not.toContain('<img')
    for (const url of ['javascript:alert(1)', 'data:text/html,evil', 'java\nscript:evil', 'vbscript:evil']) expect(safeBlogUrl(url, 'https://384721.xyz')).toBeUndefined()
  })

  it('generates published-only outputs and removes only owned renamed/deleted mirrors', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'portfolio-blog-'))
    try {
      for (const directory of ['scripts', 'src/content', 'content/blog', 'public/blog']) await mkdir(path.join(root, directory), { recursive: true })
      for (const file of ['scripts/generate-agent-files.mjs', 'src/content/blogSchema.ts', 'src/content/blogMarkdown.ts', 'content/site-content.json']) await cp(file, path.join(root, file))
      const run = () => execFileSync('pnpm', ['exec', 'node', path.join(root, 'scripts/generate-agent-files.mjs')], { cwd: process.cwd(), encoding: 'utf8' })
      const source = path.join(root, 'content/blog/fixture.md')
      await writeFile(source, article())
      await writeFile(path.join(root, 'content/blog/draft.md'), article('secret-draft', 'draft').replace('BodyOnlyNeedle', 'PRIVATE_DRAFT_SENTINEL'))
      await writeFile(path.join(root, 'public/blog/manual.md'), 'Unowned asset')
      run()
      for (const file of ['src/content/publishedBlogPosts.json', 'public/blog.md', 'public/llms.txt', 'public/llms-full.txt', 'public/sitemap.xml']) expect(await readFile(path.join(root, file), 'utf8')).not.toMatch(/PRIVATE_DRAFT_SENTINEL|secret-draft/)
      await writeFile(path.join(root, 'index.html'), '<script type="module" src="/entry.js"></script>')
      await writeFile(path.join(root, 'entry.js'), 'import posts from "./src/content/publishedBlogPosts.json"; document.body.textContent = JSON.stringify(posts)')
      execFileSync('pnpm', ['exec', 'vite', 'build', root], { cwd: process.cwd(), encoding: 'utf8' })
      const assets = await readdir(path.join(root, 'dist/assets'))
      const bundle = (await Promise.all(assets.map((file) => readFile(path.join(root, 'dist/assets', file), 'utf8')))).join('')
      expect(bundle).toContain('BodyOnlyNeedle')
      expect(bundle).not.toMatch(/PRIVATE_DRAFT_SENTINEL|secret-draft/)
      await writeFile(source, article('renamed'))
      run()
      await expect(readFile(path.join(root, 'public/blog/fixture.md'))).rejects.toThrow()
      await writeFile(source, article('renamed', 'draft'))
      run()
      await expect(readFile(path.join(root, 'public/blog/renamed.md'))).rejects.toThrow()
      expect(await readFile(path.join(root, 'public/blog/manual.md'), 'utf8')).toBe('Unowned asset')
      const sitePath = path.join(root, 'content/site-content.json')
      const site = JSON.parse(await readFile(sitePath, 'utf8'))
      const removed = site.projects.pop().slug
      await writeFile(sitePath, JSON.stringify(site))
      run()
      await expect(readFile(path.join(root, `public/projects/${removed}.md`))).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 30000)
})
