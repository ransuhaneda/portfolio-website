import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { AboutPage } from "../pages/AboutPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/about");
}

export default AboutPage;
