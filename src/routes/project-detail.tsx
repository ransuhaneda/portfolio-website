import { routeMetaDescriptors } from '../content/routeMetaDescriptors'
import { siteContent } from '../content/siteContent'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'

export function meta({ params }: { params: { slug?: string } }) {
  const project = siteContent.projects.find((entry) => entry.slug === params.slug)
  return routeMetaDescriptors(project ? `/projects/${project.slug}` : '/404')
}

export default ProjectDetailPage
