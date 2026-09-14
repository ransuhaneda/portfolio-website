import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import siteContent from '../content/site-content.json' with { type: 'json' }
import { blogCategories, parseBlogPost, selectPublishedBlogPosts, validateSlug } from '../src/content/blogSchema.ts'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const skillDir = path.join(publicDir, '.well-known', 'agent-skills', 'site-navigation')
const blogDir = path.join(root, 'content', 'blog')
const siteUrl = (process.env.SITE_URL || siteContent.site.siteUrl || 'https://384721.xyz').replace(/\/$/, '')
const email = process.env.CONTACT_EMAIL || siteContent.site.email
const location = process.env.CONTACT_LOCATION || siteContent.site.location
const featuredProjectSlugs = new Set(siteContent.home.featuredProjects.slugs)
const featuredProjects = siteContent.projects.filter((project) => featuredProjectSlugs.has(project.slug))

const loadPublishedBlogPosts = async () => {
  const entries = await fs.readdir(blogDir, { withFileTypes: true })
  const markdownFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))

  const posts = await Promise.all(
    markdownFiles.map(async (entry) => {
      const filePath = path.join(blogDir, entry.name)
      const markdown = await fs.readFile(filePath, 'utf8')
      try {
        return parseBlogPost(markdown)
      } catch (error) {
        throw new Error(`${entry.name}: ${error.message}`, { cause: error })
      }
    }),
  )

  return selectPublishedBlogPosts(posts)
}

const blogPosts = await loadPublishedBlogPosts()
const projectSlugs = new Set()
for (const project of siteContent.projects) {
  validateSlug(project.slug)
  if (projectSlugs.has(project.slug)) throw new Error(`Duplicate project slug: ${project.slug}`)
  projectSlugs.add(project.slug)
}
const categoryLabel = (post) => blogCategories.find((category) => category.id === post.category).label

const routes = [
  { path: '/', md: '/index.md', title: 'Home', description: siteContent.site.description },
  { path: '/about', md: '/about.md', title: 'About', description: siteContent.about.intro },
  { path: '/blog', md: '/blog.md', title: 'Blog', description: siteContent.blogPage?.intro ?? 'Build notes and frontend delivery posts.' },
  { path: '/projects', md: '/projects.md', title: 'Projects', description: 'Project index and case-study summaries.' },
  { path: '/contact', md: '/contact.md', title: 'Contact', description: siteContent.contact.body },
  { path: '/resume', md: '/resume.md', title: 'Resume', description: siteContent.resume.summary },
  { path: '/design-system', md: '/design-system.md', title: 'Design system', description: siteContent.designSystemPage?.intro ?? 'Visual system reference.' },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    md: `/blog/${post.slug}.md`,
    title: post.title,
    description: post.excerpt ?? post.body.split('\n')[0] ?? 'Blog post.',
  })),
  ...siteContent.projects.map((project) => ({
    path: `/projects/${project.slug}`,
    md: `/projects/${project.slug}.md`,
    title: project.title,
    description: project.summary,
  })),
]

const lines = (value) => `${value}`.trim().split('\n')
const bullets = (items) => items.map((item) => `- ${item}`).join('\n')

const homeMd = `# ${siteContent.site.name}

${siteContent.site.tagline}

${siteContent.home.hero.eyebrow}

## Homepage hero
${siteContent.home.hero.titleLines.join(' ')}

${siteContent.home.hero.description}

## Main pages
${routes
  .filter((route) => ['/', '/about', '/blog', '/projects', '/contact', '/resume', '/design-system'].includes(route.path))
  .map((route) => `- [${route.title}](${siteUrl}${route.md}): ${route.description}`)
  .join('\n')}

## Featured case studies
${featuredProjects.map((project) => `- [${project.title}](${siteUrl}/projects/${project.slug}.md): ${project.summary}`).join('\n')}

## Homepage stats
${siteContent.home.stats.map((stat) => `- ${stat.value}: ${stat.label}`).join('\n')}

## Highlighted skills
${bullets(siteContent.home.skills.items)}
`

const aboutMd = `# About

${siteContent.about.intro}

${siteContent.about.body.join('\n\n')}

## Working principles
${bullets(siteContent.about.principles)}
`

const blogIndexMd = `# Blog

${siteContent.blogPage?.intro ?? 'Build notes and frontend delivery posts.'}

${blogPosts
  .map(
    (post) => `## [${post.title}](${siteUrl}/blog/${post.slug}.md)\n\n- Date: ${post.date}\n\n${post.excerpt ?? post.body.split('\n')[0]}`,
  )
  .join('\n\n')}
`

const projectsIndexMd = `# Projects

Case-study style project archive.

${siteContent.projects
  .map(
    (project) => `## [${project.title}](${siteUrl}/projects/${project.slug}.md)\n\n- Year: ${project.year}\n- Client: ${project.client}\n- Role: ${project.role}\n- Stack: ${project.stack.join(', ')}\n\n${project.summary}`,
  )
  .join('\n\n')}
`

const resumeMd = `# Resume

## ${siteContent.resume.headline}

${siteContent.resume.summary}

[${siteContent.resume.download.label}](${siteUrl}${siteContent.resume.download.href})

## Skills
${bullets(siteContent.resume.skills)}

## Experience
${siteContent.resume.experience
  .map(
    (job) => `### ${job.role}, ${job.company} (${job.period})\n${bullets(job.highlights)}`,
  )
  .join('\n\n')}

${siteContent.resume.education?.length ? `## ${siteContent.resume.educationSectionTitle ?? 'Education and training'}\n${siteContent.resume.education
  .map(
    (item) => `### ${item.program}, ${item.school} (${item.period})\n${bullets(item.highlights)}`,
  )
  .join('\n\n')}` : ''}
`

const contactMd = `# Contact

${siteContent.contact.title}

${siteContent.contact.body}

- Email: ${email}
- Location: ${location}
- Availability: ${siteContent.contact.availability}
`

const designSystemMd = `# ${siteContent.designSystemPage?.title ?? 'Design system reference'}

${siteContent.designSystemPage?.intro ?? 'The reusable visual engine behind the site.'}

${(siteContent.designSystemPage?.sections ?? [])
  .map((section) => `## ${section.title}\n\n${section.description}`)
  .join('\n\n')}
`

const projectMarkdown = Object.fromEntries(
  siteContent.projects.map((project) => [
    `/projects/${project.slug}.md`,
    `# ${project.title}

- Year: ${project.year}
- Client: ${project.client}
- Role: ${project.role}
- Stack: ${project.stack.join(', ')}
${project.image ? `- Homepage image: ${siteUrl}${project.image.src}` : ''}

## Summary
${project.summary}

## Overview
${project.overview}

## Problem
${project.challenge}

## My responsibility
${project.role}

${bullets(project.scope)}

## What I did
${project.approachSummary}

${bullets(project.approach)}

## Result
${project.resultSummary}

${bullets(project.outcome)}

## Project scope
${bullets(project.scope)}

## Reflection
${project.reflection}
`,
  ]),
)

const blogMarkdown = Object.fromEntries(
  blogPosts.map((post) => [
    `/blog/${post.slug}.md`,
    `# ${post.title}

- Date: ${post.date}
- Category: ${categoryLabel(post)}
${post.excerpt ? `- Excerpt: ${post.excerpt}` : ''}
${post.coverImage ? `- Cover image: ${post.coverImage}` : ''}

${post.body}
`,
  ]),
)

const pageMarkdown = {
  '/index.md': homeMd,
  '/about.md': aboutMd,
  '/blog.md': blogIndexMd,
  '/projects.md': projectsIndexMd,
  '/resume.md': resumeMd,
  '/contact.md': contactMd,
  '/design-system.md': designSystemMd,
  ...blogMarkdown,
  ...projectMarkdown,
}

const llms = `# ${siteContent.site.name}

> ${siteContent.site.tagline}

${siteContent.site.description}

## Preferred machine-readable entry points
- [Site index](${siteUrl}/index.md)
- [Full site content](${siteUrl}/llms-full.txt)
- [Blog index](${siteUrl}/blog.md)
- [Project archive](${siteUrl}/projects.md)
- [Resume](${siteUrl}/resume.md)
- [Contact](${siteUrl}/contact.md)
- [Design system](${siteUrl}/design-system.md)

## Core pages
${routes.map((route) => `- [${route.title}](${siteUrl}${route.md})`).join('\n')}
`

const llmsFull = `# ${siteContent.site.name}: full machine-readable content

## Site summary
- Name: ${siteContent.site.name}
- Tagline: ${siteContent.site.tagline}
- Description: ${siteContent.site.description}
- Contact email: ${email}
- Location: ${location}

## Home
${lines(homeMd).join('\n')}

## About
${lines(aboutMd).join('\n')}

## Blog
${lines(blogIndexMd).join('\n')}

${Object.values(blogMarkdown)
  .map((entry) => lines(entry).join('\n'))
  .join('\n\n')}

## Resume
${lines(resumeMd).join('\n')}

## Projects
${Object.values(projectMarkdown)
  .map((entry) => lines(entry).join('\n'))
  .join('\n\n')}

## Contact
${lines(contactMd).join('\n')}

## Design system
${lines(designSystemMd).join('\n')}
`

const skillMd = `---
name: site-navigation
description: Navigate this portfolio website quickly, prefer markdown mirrors, and understand where blog posts, case studies, resume details, and contact information live.
---

# Site navigation

Use this skill when you need to inspect or summarize this portfolio site efficiently.

## Prefer markdown sources

Read these machine-friendly pages first:

- \`/llms.txt\` for the site index
- \`/llms-full.txt\` for the complete machine-readable snapshot
- \`/blog.md\` for published blog posts
- \`/projects.md\` for the case-study archive
- \`/resume.md\` for CV/resume content
- \`/design-system.md\` for the public visual system reference
- Project pages under \`/projects/<slug>.md\`
- Blog posts under \`/blog/<slug>.md\`

## Human page mapping

- \`/\`: homepage and overview
- \`/about\`: background, principles, and positioning
- \`/blog\`: published notes and articles
- \`/blog/<slug>\`: individual blog post
- \`/projects\`: project archive
- \`/projects/<slug>\`: individual case study
- \`/resume\`: resume summary and experience
- \`/contact\`: contact and availability
- \`/design-system\`: color, typography, spacing, layout, and component reference

## Notes

- The site is content-first and meant to stay understandable even without visual interpretation.
- If both HTML and markdown are available, prefer markdown first.
`

const digest = (value) => `sha256:${createHash('sha256').update(value).digest('hex')}`
const agentIndex = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [
    {
      name: 'site-navigation',
      type: 'skill-md',
      description:
        'Navigate this portfolio website quickly, prefer markdown mirrors, and understand where blog posts, case studies, resume details, and contact information live.',
      url: '/.well-known/agent-skills/site-navigation/SKILL.md',
      digest: digest(skillMd),
    },
  ],
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>\n    <loc>${siteUrl}${route.path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${route.path === '/' ? '1.0' : route.path === '/projects' || route.path === '/blog' ? '0.9' : '0.8'}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`

await fs.mkdir(path.join(publicDir, 'projects'), { recursive: true })
await fs.mkdir(path.join(publicDir, 'blog'), { recursive: true })
await fs.mkdir(skillDir, { recursive: true })

// The manifest records exact owned files; never glob-delete public assets.
const manifestPath = path.join(publicDir, '.generated-mirrors.json')
const previousMirrors = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch((error) => {
  if (error.code === 'ENOENT') return '[]'
  throw error
}))
const ownedPath = /^\/(?:blog|projects)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/
if (!Array.isArray(previousMirrors) || previousMirrors.some((entry) => !ownedPath.test(entry))) {
  throw new Error('Invalid generated mirror manifest.')
}
const currentMirrors = [...Object.keys(blogMarkdown), ...Object.keys(projectMarkdown)].sort()
for (const stale of previousMirrors.filter((entry) => !currentMirrors.includes(entry))) {
  await fs.rm(path.join(publicDir, stale), { force: true })
}

for (const [relativePath, content] of Object.entries(pageMarkdown)) {
  const filePath = path.join(publicDir, relativePath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content.replace(/\n\n\n+/g, '\n\n'), 'utf8')
}

await fs.writeFile(path.join(publicDir, 'llms.txt'), llms, 'utf8')
await fs.writeFile(path.join(publicDir, 'llms-full.txt'), llmsFull, 'utf8')
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
await fs.writeFile(path.join(publicDir, '.well-known', 'security.txt'), `Contact: mailto:${email}\nExpires: 2027-06-25T00:00:00.000Z\nPreferred-Languages: en\nCanonical: ${siteUrl}/.well-known/security.txt\n`, 'utf8')
await fs.writeFile(manifestPath, JSON.stringify(currentMirrors, null, 2) + '\n', 'utf8')
await fs.writeFile(path.join(root, 'src/content/publishedBlogPosts.json'), JSON.stringify(blogPosts, null, 2) + '\n', 'utf8')
await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillMd, 'utf8')
await fs.writeFile(path.join(publicDir, '.well-known', 'agent-skills', 'index.json'), JSON.stringify(agentIndex, null, 2), 'utf8')
