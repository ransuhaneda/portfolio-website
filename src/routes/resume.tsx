import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { ResumePage } from "../pages/ResumePage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/resume");
}

export default ResumePage;
