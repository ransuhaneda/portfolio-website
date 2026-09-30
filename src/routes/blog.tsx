import { routeMetaDescriptors } from '../content/routeMetaDescriptors'
import { BlogPage } from '../pages/BlogPage'

export function meta() {
  return routeMetaDescriptors('/blog')
}

export default BlogPage
