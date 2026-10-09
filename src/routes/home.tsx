import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { HomePage } from "../pages/HomePage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/");
}

export default HomePage;
