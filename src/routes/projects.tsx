import { routeMetaDescriptors } from "../content/routeMetaDescriptors";
import { ProjectsPage } from "../pages/ProjectsPage";

// oxlint-disable-next-line react/only-export-components
export function meta() {
  return routeMetaDescriptors("/projects");
}

export default ProjectsPage;
