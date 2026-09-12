import { isBlogCategory, type BlogPost } from './blogSchema'

export function getBlogFilters(params: URLSearchParams) {
  const category = params.get('category') ?? ''
  return { query: params.get('q') ?? '', category: isBlogCategory(category) ? category : '' }
}

export function updateBlogFilters(params: URLSearchParams, key: 'q' | 'category', value: string) {
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  return next
}

export function filterBlogPosts(posts: BlogPost[], params: URLSearchParams) {
  const { query, category } = getBlogFilters(params)
  const search = query.trim().toLowerCase()
  return posts.filter((post) => (!category || post.category === category)
    && [post.title, post.excerpt, post.body].some((text) => text.toLowerCase().includes(search)))
}
