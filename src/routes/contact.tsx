import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { ContactPage } from "../pages/ContactPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/contact");
}

export default ContactPage;
