# Application architecture

## Public app

The public site uses React 19, TypeScript, React Router 7 framework mode, SCSS modules, and Vite+ tooling. The route manifest is `src/routes.ts`; route modules in `src/routes/` render page components in `src/pages/`. `src/root.tsx` owns the HTML document and loads global styles. Shared layout and components live in `src/layouts/` and `src/components/`; GSAP helpers live in `src/animations/`.

`react-router.config.ts` uses `src` as the app directory, disables runtime SSR, and prerenders paths from `src/content/routeMetadata.ts`. The application build writes deployable assets and prerendered route HTML to `dist/client`; the temporary server build is removed. This replaces the historical metadata-only shell build. Do not use `src/main.tsx` or `src/app/routes.tsx` as the active framework route manifest.

Top-level pages are Home, About, Blog, Projects, Contact, Resume, and Design System. Project and published blog slugs have detail routes; a wildcard route handles unknown paths. Update the route manifest and metadata together when adding routes.

## Content and metadata

Follow [content ownership](content.md) before editing copy or generated files. `src/content/siteContent.ts` defines site content types. `src/content/blogSchema.ts` validates blog sources. The generator creates the published-only snapshot consumed by `src/content/blogContent.ts`.

`src/content/routeMetadata.ts` derives paths and metadata from site JSON and the generated blog snapshot. `src/content/routeMetaDescriptors.ts` supplies React Router metadata descriptors. `src/content/publicUrl.ts` handles local URLs for path-based preview hosting. Keep initial HTML metadata, client navigation metadata, production canonicals, and preview noindex behavior aligned.

Machine-readable mirrors live in `public/*.md`, `public/projects/*.md`, and `public/blog/*.md`. `functions/[[path]].ts` handles Cloudflare GET/HEAD requests with `Accept: text/markdown`, checks asset MIME, and adds discovery/negotiation headers. Static preview hosts do not run this Function.

## Runtime boundaries

The contact form validates fields and opens a `mailto:` URL in the visitor's email client; it does not send mail through a server. Verify validation and handoff without sending a message. Most labels and templates come from source JSON; preserve this content-first direction when changing UI.

The HTML document includes a Google tag, and `src/components/GoogleAnalytics.tsx` handles client navigation tracking. Check both entry paths for analytics changes.

`admin/` retains deferred CMS source, but the public route manifest does not include an admin entry. Cloudflare admin/API containment is implemented separately in the Function. Read [deployment and admin security](deployment.md) before changing either boundary; retained source is not authorization to enable it.
