export const blogCategories = [
  { id: 'content-systems', label: 'Content systems' },
  { id: 'git-workflow', label: 'Git workflow' },
  { id: 'frontend-quality', label: 'Frontend quality' },
] as const

export type BlogCategory = (typeof blogCategories)[number]['id']
export type BlogStatus = 'draft' | 'published'
export type BlogPostMeta = {
  title: string
  slug: string
  date: string
  status: BlogStatus
  category: BlogCategory
  excerpt: string
  coverImage?: string
  coverAlt?: string
}
export type BlogPost = BlogPostMeta & { body: string }

export function isBlogCategory(value: string): value is BlogCategory {
  return blogCategories.some((category) => category.id === value)
}

export function validateSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug: ${slug}`)
}

export function parseBlogPost(markdown: string): BlogPost {
  const match = markdown.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Blog markdown is missing frontmatter.')
  const fields = new Map<string, string>()
  for (const line of match[1].split('\n').filter((line) => line.trim())) {
    const entry = line.match(/^([A-Za-z]+):\s*(.*?)\s*$/)
    if (!entry || fields.has(entry[1])) throw new Error(`Invalid or duplicate frontmatter field: ${line}`)
    const raw = entry[2]
    if (raw.startsWith('"') && !/^"(?:[^"\\]|\\.)*"$/.test(raw)) throw new Error(`Expected quoted text for ${entry[1]}`)
    const value: string = raw.startsWith('"') ? JSON.parse(raw) : raw.replace(/^'(.*)'$/, '$1')
    fields.set(entry[1], value)
  }
  const required = (key: string) => {
    const value = fields.get(key)?.trim()
    if (!value) throw new Error(`Missing required blog metadata: ${key}`)
    return value
  }
  const title = required('title')
  const slug = required('slug')
  validateSlug(slug)
  const date = required('date')
  const timestamp = Date.parse(`${date}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid blog date: ${date}`)
  }
  const status = required('status')
  if (status !== 'draft' && status !== 'published') throw new Error(`Invalid blog status: ${status}`)
  const category = required('category')
  if (!isBlogCategory(category)) throw new Error(`Invalid blog category: ${category}`)
  const excerpt = required('excerpt')
  const coverImage = fields.get('coverImage') || undefined
  const coverAlt = fields.get('coverAlt') || undefined
  if (coverImage && !coverAlt) throw new Error('Blog cover image requires coverAlt.')
  const body = match[2].trim()
  if (!body) throw new Error(`Blog body is empty: ${slug}`)
  return { title, slug, date, status, category, excerpt, coverImage, coverAlt, body }
}

export function selectPublishedBlogPosts(posts: BlogPost[]) {
  const slugs = new Set<string>()
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`)
    slugs.add(post.slug)
  }
  return posts.filter((post) => post.status === 'published')
    .sort((left, right) => right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug))
}
