import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { DesignSystemPage } from "../pages/DesignSystemPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/design-system");
}

export default DesignSystemPage;
