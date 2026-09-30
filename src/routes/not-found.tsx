import { routeMetaDescriptors } from '../content/routeMetaDescriptors'
import { NotFoundPage } from '../pages/NotFoundPage'

export function meta() {
  return routeMetaDescriptors('/404')
}

export default NotFoundPage
