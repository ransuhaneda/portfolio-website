import type { Config } from "@react-router/dev/config";
import { routeMetadata } from "./src/content/routeMetadata";

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  splitRouteModules: true,
  prerender: routeMetadata.map((route) => route.path),
} satisfies Config;
