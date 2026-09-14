import { useCallback, useRef } from 'react'
import { measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap'

type ScrollOpacityTextProps = {
  children: string
  className?: string
  as?: 'h2' | 'p' | 'div' | 'blockquote'
  id?: string
}

export function ScrollOpacityText({ children, className, as: Tag = 'div', id }: ScrollOpacityTextProps) {
  const triggerRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])

  useGSAP(() => {
    const element = triggerRef.current
    const parent = element?.parentElement
    if (!element || !parent) return

    const setWidth = () => {
      const availableWidth = parent.getBoundingClientRect().width
      const style = window.getComputedStyle(element)
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const letterSpacing = Number.parseFloat(style.letterSpacing) || 0
      const measurableText = style.textTransform === 'uppercase' ? children.toLocaleUpperCase() : children
      const prepared = prepareWithSegments(measurableText, font, { letterSpacing })
      const naturalWidth = measureNaturalWidth(prepared)
      element.style.setProperty('--pretext-inline-size', `${Math.min(availableWidth, Math.ceil(naturalWidth + 1))}px`)
    }

    const resizeObserver = new ResizeObserver(setWidth)
    resizeObserver.observe(parent)
    setWidth()
    void document.fonts?.ready.then(setWidth)

    return () => resizeObserver.disconnect()
  }, { scope: triggerRef, dependencies: [children], revertOnUpdate: true })

  const setLettersRef = useCallback((ref: HTMLSpanElement | null) => {
    if (!ref) return

    // Callback refs can run more than once as React reconciles a route. Keep
    // one target per character so the scrub timeline never accumulates stale
    // nodes or duplicates.
    const index = Number(ref.dataset.letterIndex)
    lettersRef.current[index] = ref
  }, [])

  useGSAP(() => {
    const letters = lettersRef.current.filter(Boolean)
    const trigger = triggerRef.current
    if (!trigger || !letters.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(letters, { opacity: 1 })
      return
    }

    gsap.set(letters, { opacity: 0.3 })
    gsap.to(letters, {
      opacity: 1,
      stagger: { each: 0.035, from: 'start' },
      scrollTrigger: {
        trigger,
        start: 'top 78%',
        end: 'bottom 42%',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, { scope: triggerRef, dependencies: [children], revertOnUpdate: true })

  // SAFETY: Every allowed Tag accepts an HTMLElement-compatible ref at runtime.
  const polymorphicRef = triggerRef as never
  return (
    <Tag ref={polymorphicRef} id={id} className={className} aria-label={children} data-pretext={Tag === 'p' ? 'prose' : 'heading'}>
      {Array.from(children).map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          ref={setLettersRef}
          data-letter-index={index}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </Tag>
  )
}
