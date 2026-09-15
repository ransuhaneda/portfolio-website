import type { PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { LuExternalLink, LuGlobe, LuMail, LuMapPin } from 'react-icons/lu'
import { getLinktreeUrl, siteContent } from '../content/siteContent'
import { BrandIcon } from './BrandIcon'
import { PretextFooterCanvas } from './PretextFooterCanvas'
import { publicUrl } from '../content/publicUrl'
import publishedPosts from '../content/publishedBlogPosts.json' with { type: 'json' }
import sty from './SiteFooter.module.scss'

function getBrandParts(name: string) {
  const [primary, ...rest] = name.trim().split(/\s+/)
  return {
    primary: primary?.toUpperCase() ?? '',
    secondary: rest.join(' ').toUpperCase(),
  }
}

function updateFeaturedLinkPointer(event: ReactPointerEvent<HTMLAnchorElement>) {
  const link = event.currentTarget
  const bounds = link.getBoundingClientRect()
  link.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
  link.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
}

function FeaturedLink({ label, to }: { label: string; to: string }) {
  return (
    <Link className={sty.featuredLink} onPointerMove={updateFeaturedLinkPointer} to={to}>
      <span>{label}</span>
      <span className={sty.featuredLinkHighlight} aria-hidden="true">{label}</span>
    </Link>
  )
}


export function SiteFooter() {
  const brand = getBrandParts(siteContent.site.name)
  const linktreeUrl = getLinktreeUrl()
  const year = new Date().getFullYear()
  const visibleSocials = siteContent.site.socials.filter((social) => social.label !== 'Linktree')
  const footerCopy = siteContent.siteChrome?.footer
  const moreLinks = footerCopy?.moreLinks ?? [
    { to: '/#contact', label: 'Book a call' },
    { to: '/resume', label: 'View CV' },
  ]
  const copyrightTemplate = footerCopy?.copyrightTemplate ?? '© {year} {siteName}. All rights reserved.'
  const copyright = copyrightTemplate
    .replace('{year}', String(year))
    .replace('{siteName}', siteContent.site.name)
  const pretextSource = [
    ...siteContent.projects.flatMap((project) => [project.title, project.summary, project.approachSummary]),
    ...publishedPosts.flatMap((post) => [post.title, post.excerpt]),
  ].join('')

  return (
    <footer className={sty.root}>
      <div className={sty.border}>
        <PretextFooterCanvas text={pretextSource} />
        <div className="lg-wrapper">
        <div className={sty.inner}>
          <div className={sty.info}>
            <p className={sty.brand}>
              <span>{brand.primary}</span>
              {brand.secondary ? <span className={sty.brandSecondary}>{brand.secondary}</span> : null}
            </p>
            <p className={sty.description}>{siteContent.site.description}</p>
          </div>

          <div className={sty.links}>
            <nav className={sty.featuredNavigation} aria-label="Featured pages">
              <FeaturedLink label="HOME" to="/" />
              <FeaturedLink label="PROJECTS" to="/projects" />
              <FeaturedLink label="ABOUT" to="/about" />
              <FeaturedLink label="NOTES" to="/blog" />
              <FeaturedLink label="CONTACT" to="/#contact" />
            </nav>

            <nav className={sty.navigation} aria-label="Footer">
              <p className={sty.heading}>{footerCopy?.generalHeading ?? 'General'}</p>
              <ul className={sty.linkList}>
                {moreLinks.map((link) => (
                  <li key={`${link.to}-${link.label}`}>
                    {link.to.startsWith('/#') || link.to.startsWith('#') || link.to.startsWith('http')
                      ? <a href={publicUrl(link.to)}>{link.label}</a>
                      : <Link to={link.to}>{link.label}</Link>}
                  </li>
                ))}
                {linktreeUrl ? (
                  <li><a href={linktreeUrl} target="_blank" rel="noreferrer">{footerCopy?.linktreeLabel ?? 'Linktree'}<LuExternalLink aria-hidden="true" className={sty.inlineIcon} focusable="false" /></a></li>
                ) : null}
              </ul>
            </nav>

            <div className={sty.contact}>
              <p className={sty.heading}>Contact</p>
              <a href={`mailto:${siteContent.site.email}`}><LuMail aria-hidden="true" className={sty.inlineIcon} focusable="false" />{siteContent.site.email}</a>
              <a href={siteContent.site.siteUrl}><LuGlobe aria-hidden="true" className={sty.inlineIcon} focusable="false" />{siteContent.site.siteUrl.replace(/^https?:\/\//, '')}</a>
              <p><LuMapPin aria-hidden="true" className={sty.inlineIcon} focusable="false" />{siteContent.site.location}</p>
            </div>
          </div>
        </div>

        </div>
      </div>

      <div className={sty.bottomBorder}>
        <div className="lg-wrapper">
          <div className={sty.bottom}>
          <p className={sty.copyright}>{copyright}</p>
          <ul className={sty.socials} aria-label={siteContent.siteChrome?.footerSocialsAriaLabel ?? 'Social links'}>
            {visibleSocials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} title={social.label}>
                  <span className={sty.socialIcon}><BrandIcon label={social.label} /></span>
                </a>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
