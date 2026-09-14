import { createElement, type HTMLAttributes, type ReactNode } from 'react'

type PretextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote'
type PretextMeasure = 'heading' | 'intro' | 'prose'

type PretextTextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  as?: PretextElement
  children?: ReactNode
  measure: PretextMeasure
  reveal?: 'heading' | 'copy'
  /** Legacy measurement hint; CSS now owns the rendered text width. */
  text?: string
}

export function PretextText({
  as = 'p',
  children,
  measure,
  reveal,
  text,
  ...attributes
}: PretextTextProps) {
  void text

  return createElement(as, {
    ...attributes,
    'data-pretext': measure,
    'data-text-reveal': reveal,
  }, children)
}
