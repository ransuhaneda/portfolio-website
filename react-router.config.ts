import type { Config } from '@react-router/dev/config'
import { routeMetadata } from './src/content/routeMetadata'

export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  ssr: false,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  prerender: routeMetadata.map((route) => route.path),
} satisfies Config
