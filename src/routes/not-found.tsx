import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { NotFoundPage } from "../pages/NotFoundPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/404");
}

export default NotFoundPage;
