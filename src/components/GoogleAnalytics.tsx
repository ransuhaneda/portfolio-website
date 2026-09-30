import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = 'G-SXK1957XHQ'

export function GoogleAnalytics() {
  const location = useLocation()
  const firstLocation = useRef(true)

  useEffect(() => {
    if (!measurementId || document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) return

    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
    window.gtag('js', new Date())
    window.gtag('config', measurementId)

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
  }, [])

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
