import { routeMetaDescriptors } from '../content/routeMetaDescriptors'
import { getBlogPostBySlug } from '../content/blogContent'
import { BlogPostPage } from '../pages/BlogPostPage'

export function meta({ params }: { params: { slug?: string } }) {
  const post = params.slug ? getBlogPostBySlug(params.slug) : undefined
  return routeMetaDescriptors(post ? `/blog/${post.slug}` : '/404')
}

export default BlogPostPage
