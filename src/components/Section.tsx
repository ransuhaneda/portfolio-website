import type { ReactNode } from 'react'
import sty from './Section.module.scss'
import { PretextText } from './PretextText'

type SectionProps = {
  title: string
  intro?: string
  children: ReactNode
}

export function Section({ title, intro, children }: SectionProps) {
  return (
    <section className={sty.root} data-text-reveal-group="scrub">
      <div className="lg-wrapper">
        <div className={sty.inner}>
          <div className={sty.heading}>
            <PretextText as="h2" measure="heading" reveal="heading">{title}</PretextText>
            {intro ? <PretextText measure="intro" reveal="copy">{intro}</PretextText> : null}
          </div>
          <div className={sty.content}>{children}</div>
        </div>
      </div>
    </section>
  )
}
