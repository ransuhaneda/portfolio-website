import type { MetaDescriptor } from 'react-router'
import content from '../../content/site-content.json' with { type: 'json' }
import { getRouteMetadata } from './routeMetadata'

export function routeMetaDescriptors(pathname: string): MetaDescriptor[] {
  const meta = getRouteMetadata(pathname)
  const image = meta.image ? (meta.image.startsWith('http') ? meta.image : `https://384721.xyz${meta.image}`) : undefined
  const descriptors: MetaDescriptor[] = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { name: 'robots', content: meta.found ? 'index, follow' : 'noindex, nofollow' },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:type', content: meta.date ? 'article' : 'website' },
    { property: 'og:site_name', content: content.site.name },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
  ]

  if (meta.canonical) {
    descriptors.push({ tagName: 'link', rel: 'canonical', href: meta.canonical })
    descriptors.push({ property: 'og:url', content: meta.canonical })
  }
  if (image) {
    descriptors.push({ property: 'og:image', content: image })
    descriptors.push({ name: 'twitter:image', content: image })
  }
  if (meta.date) descriptors.push({ property: 'article:published_time', content: `${meta.date}T00:00:00.000Z` })
  if (pathname === '/') {
    // SAFETY: React Router accepts the JSON-LD descriptor through its extensible metadata type.
    descriptors.push({
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: content.site.name,
        url: content.site.siteUrl,
        email: `mailto:${content.site.email}`,
        address: { '@type': 'PostalAddress', addressCountry: content.site.location },
        sameAs: content.site.socials.map((social) => social.href),
      },
    } as MetaDescriptor)
  }

  return descriptors
}
