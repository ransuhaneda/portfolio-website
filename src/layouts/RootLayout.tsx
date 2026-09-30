import { useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { siteContent } from '../content/siteContent'

import { useScrollTextAnimations } from '../animations/useScrollTextAnimations'

export function RootLayout({ children }: { children?: ReactNode }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const mainRef = useScrollTextAnimations(location.pathname)

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])


  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        target?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.hash, location.pathname, location.search])

  return (
    <>
      <div className="site-shell">
      <GoogleAnalytics />
      <a className="skip-link" href="#main-content">{siteContent.siteChrome?.skipToContentLabel ?? 'Skip to main content'}</a>
      <SiteHeader />
      <main ref={mainRef} id="main-content" className={isHomePage ? 'site-main site-main--home' : 'site-main site-main--inner'}>
        {children ?? <Outlet />}
      </main>
      <SiteFooter />
      </div>
    </>
  )
}
