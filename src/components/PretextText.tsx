import { createElement, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { layoutWithLines, measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'

type PretextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote'
type PretextMeasure = 'heading' | 'intro' | 'prose'

type PretextTextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  as?: PretextElement
  children?: ReactNode
  measure: PretextMeasure
  reveal?: 'heading' | 'copy'
  text?: string
}

type PretextMeasurement = {
  naturalWidth: number
  preferredWidth: number
  prepared: ReturnType<typeof prepareWithSegments>
}

const measurementCache = new Map<string, PretextMeasurement>()

const preferredCharacters: Record<PretextMeasure, number> = {
  heading: 24,
  intro: 52,
  prose: 68,
}

function getMeasurableText(text: string, textTransform: string) {
  if (textTransform === 'uppercase') return text.toLocaleUpperCase()
  if (textTransform === 'lowercase') return text.toLocaleLowerCase()
  if (textTransform === 'capitalize') {
    return text.replace(/(^|\s)(\S)/g, (_, space: string, letter: string) => `${space}${letter.toLocaleUpperCase()}`)
  }

  return text
}

function getCanvasFont(style: CSSStyleDeclaration) {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
}

export function PretextText({
  as = 'p',
  children,
  measure,
  reveal,
  text = typeof children === 'string' ? children : '',
  ...attributes
}: PretextTextProps) {
  const elementRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = elementRef.current
    const parent = element?.parentElement
    if (!element || !parent || !text.trim()) return

    let frame = 0
    let disposed = false

    const update = () => {
      frame = 0
      const availableWidth = parent.getBoundingClientRect().width
      if (availableWidth <= 0) return

      const style = window.getComputedStyle(element)
      const measurableText = getMeasurableText(text.trim(), style.textTransform)
      const letterSpacing = Number.parseFloat(style.letterSpacing) || 0
      const font = getCanvasFont(style)
      const cacheKey = `${measure}\u0000${font}\u0000${letterSpacing}\u0000${measurableText}`
      let measurement = measurementCache.get(cacheKey)

      if (!measurement) {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        const segments = Array.from(segmenter.segment(measurableText), ({ segment }) => segment)
        if (!segments.length) return

        const prepared = prepareWithSegments(measurableText, font, { letterSpacing })
        const naturalWidth = measureNaturalWidth(prepared)
        const preferredIndex = Math.min(segments.length, preferredCharacters[measure])
        const preferredWidth = preferredIndex === segments.length
          ? naturalWidth
          : measureNaturalWidth(prepareWithSegments(segments.slice(0, preferredIndex).join(''), font, { letterSpacing }))

        measurement = { naturalWidth, preferredWidth, prepared }
        measurementCache.set(cacheKey, measurement)
      }

      const { naturalWidth, preferredWidth, prepared } = measurement
      const minimumWidth = Number.parseFloat(style.fontSize) * 8
      const layoutWidth = Math.min(availableWidth, naturalWidth, Math.max(preferredWidth, minimumWidth))
      const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2
      const { lines } = layoutWithLines(prepared, layoutWidth, lineHeight)
      const measuredWidth = lines.reduce((widest, line) => Math.max(widest, line.width), 0)

      element.style.setProperty('--pretext-inline-size', `${Math.min(availableWidth, Math.ceil(measuredWidth + 4))}px`)
    }

    const scheduleUpdate = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(parent)
    update()
    void document.fonts?.ready.then(() => {
      if (!disposed) scheduleUpdate()
    })

    return () => {
      disposed = true
      if (frame) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      element.style.removeProperty('--pretext-inline-size')
    }
  }, [measure, text])

  return createElement(as, {
    ...attributes,
    ref: elementRef,
    'data-pretext': measure,
    'data-text-reveal': reveal,
  }, children)
}
