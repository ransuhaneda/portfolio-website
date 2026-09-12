import { useEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { siteContent } from '../content/siteContent'
import { metadataTags } from '../content/routeMetadata'
import { useScrollTextAnimations } from '../animations/useScrollTextAnimations'

export function RootLayout() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isHomePage = location.pathname === '/'
  const mainRef = useScrollTextAnimations(location.pathname)

  useEffect(() => {
    document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[property^="article:"], link[rel="canonical"], link[type="application/rss+xml"]').forEach((node) => node.remove())
    document.head.insertAdjacentHTML('beforeend', metadataTags(location.pathname, import.meta.env.BASE_URL !== '/', import.meta.env.BASE_URL))
  }, [location.pathname])

  useEffect(() => {
    if (navigationType === 'POP') return

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      target?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.hash, location.pathname, navigationType])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{siteContent.siteChrome?.skipToContentLabel ?? 'Skip to main content'}</a>
      <SiteHeader />
      <main ref={mainRef} id="main-content" className={isHomePage ? 'site-main site-main--home' : 'site-main site-main--inner'}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
