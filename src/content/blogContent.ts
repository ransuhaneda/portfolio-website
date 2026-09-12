import publishedPosts from './publishedBlogPosts.json' with { type: 'json' }
import type { BlogPost } from './blogSchema'
export { blogCategories } from './blogSchema'
export type { BlogPost, BlogPostMeta, BlogStatus } from './blogSchema'

export const blogPosts = (
  // SAFETY: prebuild validates metadata and emits only published posts into this snapshot.
  publishedPosts as BlogPost[]
)

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
