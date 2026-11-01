import content from "../../content/site-content.json" with { type: "json" };
import seo from "../../content/seo.json" with { type: "json" };
import posts from "./publishedBlogPosts.json" with { type: "json" };

const homeImage = content.projects.find(
  (project) => project.slug === content.home.featuredProjects.slugs[0],
)?.image?.src;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: content.site.name,
  url: content.site.siteUrl,
  email: `mailto:${content.site.email}`,

  sameAs: content.site.socials.map((social) => social.href),
};

function getSeoEntry<T extends Record<string, { title: string; description: string }>>(
  entries: T,
  key: string,
  kind: string,
) {
  // SAFETY: The runtime guard below verifies that every route/content key has SEO copy.
  const entry = entries[key as keyof T];
  if (!entry) throw new Error(`Missing SEO metadata for ${kind}: ${key}`);
  return entry;
}

export const routeMetadata = [
  {
    path: "/",
    title: seo.pages.home.title,
    description: seo.pages.home.description,
    image: homeImage,
  },
  { path: "/about", ...seo.pages.about },
  { path: "/resume", ...seo.pages.resume },
  { path: "/contact", ...seo.pages.contact },
  { path: "/projects", ...seo.pages.projects },
  { path: "/blog", ...seo.pages.blog },
  {
    path: "/design-system",
    ...seo.pages.designSystem,
  },
  ...content.projects.map((project) => ({
    path: `/projects/${project.slug}`,
    ...getSeoEntry(seo.projects, project.slug, "project"),
    image: project.image?.src,
  })),
  ...posts.map((post) => ({
    path: `/blog/${post.slug}`,
    ...getSeoEntry(seo.blog, post.slug, "blog post"),
    date: post.date,
    image: post.coverImage,
  })),
];

export function getRouteMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const entry = routeMetadata.find((route) => route.path === path);
  return {
    title: entry?.title ?? seo.pages.notFound.title,
    description: entry?.description ?? seo.pages.notFound.description,
    canonical: entry ? `${content.site.siteUrl}${entry.path}` : undefined,
    date: entry && "date" in entry ? String(entry.date) : undefined,
    image: entry?.image,
    found: Boolean(entry),
  };
}

export function metadataTags(path: string, preview: boolean) {
  const meta = getRouteMetadata(path);
  const escape = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const image = meta.image
    ? meta.image.startsWith("http")
      ? meta.image
      : `${content.site.siteUrl}${meta.image}`
    : undefined;
  return `<title>${escape(meta.title)}</title>
<meta name="description" content="${escape(meta.description)}" />
<meta name="robots" content="${preview || !meta.found ? "noindex, nofollow" : "index, follow"}" />
<meta property="og:title" content="${escape(meta.title)}" />
<meta property="og:description" content="${escape(meta.description)}" />
<meta property="og:type" content="${meta.date ? "article" : "website"}" />
${meta.canonical ? `<link rel="canonical" href="${escape(meta.canonical)}" /><meta property="og:url" content="${escape(meta.canonical)}" />` : ""}
<meta property="og:site_name" content="${escape(content.site.name)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(meta.title)}" />
<meta name="twitter:description" content="${escape(meta.description)}" />
${image ? `<meta property="og:image" content="${escape(image)}" /><meta name="twitter:image" content="${escape(image)}" />` : ""}
${path === "/" && !preview ? `<script type="application/ld+json">${JSON.stringify(personSchema).replace(/</g, "\\u003c")}</script>` : ""}
${meta.date ? `<meta property="article:published_time" content="${meta.date}T00:00:00.000Z" />` : ""}`;
}
