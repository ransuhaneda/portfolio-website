import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics() {
  const location = useLocation()
  const firstLocation = useRef(true)

  useEffect(() => {
    if (firstLocation.current) {
      firstLocation.current = false
      return
    }
    window.gtag?.('event', 'page_view', {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location.hash, location.pathname, location.search])

  return null
}
