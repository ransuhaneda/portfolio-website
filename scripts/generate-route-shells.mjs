import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { routeMetadata, metadataTags } from '../src/content/routeMetadata.ts'

const preview = process.env.GITHUB_PAGES === 'true'
const template = await readFile('dist/index.html', 'utf8')
const shell = (path) => template.replace(/<!-- route-metadata:start -->[\s\S]*?<!-- route-metadata:end -->/, `<!-- route-metadata:start -->${metadataTags(path, preview)}<!-- route-metadata:end -->`)
for (const route of routeMetadata) {
  const directory = `dist${route.path === '/' ? '' : route.path}`
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/index.html`, shell(route.path))
}
await writeFile('dist/404.html', shell('/404'))
if (preview) await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n')
console.log(`Generated ${routeMetadata.length} route shells and truthful 404 metadata.`)
