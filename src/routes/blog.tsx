import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { BlogPage } from "../pages/BlogPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/blog");
}

export default BlogPage;
