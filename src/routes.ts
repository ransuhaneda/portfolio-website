import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  layout('./routes/layout.tsx', [
    index('./routes/home.tsx'),
    route('about', './routes/about.tsx'),
    route('blog', './routes/blog.tsx'),
    route('blog/:slug', './routes/blog-post.tsx'),
    route('projects', './routes/projects.tsx'),
    route('projects/:slug', './routes/project-detail.tsx'),
    route('contact', './routes/contact.tsx'),
    route('design-system', './routes/design-system.tsx'),
    route('resume', './routes/resume.tsx'),
    route('*', './routes/not-found.tsx'),
  ]),
] satisfies RouteConfig
