import type { ReactNode } from 'react'
import sty from './InternalHero.module.scss'
import { PretextText } from './PretextText'

type InternalHeroProps = {
  title: string
  intro: string
  beforeTitle?: ReactNode
  actions?: ReactNode
}

export function InternalHero({ title, intro, beforeTitle, actions }: InternalHeroProps) {
  return (
    <section className={sty.root} data-text-reveal-group="entry">
      <div className="lg-wrapper">
        <div className={sty.inner}>
          <div className={sty.copy}>
            {beforeTitle}
            <PretextText as="h1" measure="heading" reveal="heading">{title}</PretextText>
            <PretextText className={sty.intro} measure="intro" reveal="copy">{intro}</PretextText>
            {actions ? <div className={sty.actions}>{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
