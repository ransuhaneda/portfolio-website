import type { ReactNode } from 'react'
import sty from './PageHeader.module.scss'
import { PretextText } from './PretextText'

type PageHeaderProps = {
  title: string
  intro: string
  actions?: ReactNode
}

export function PageHeader({ title, intro, actions }: PageHeaderProps) {
  return (
    <header className={sty.root} data-text-reveal-group="entry">
      <PretextText as="h1" measure="heading" reveal="heading">{title}</PretextText>
      <PretextText className={sty.intro} measure="intro" reveal="copy">{intro}</PretextText>
      {actions ? <div className={sty.actions}>{actions}</div> : null}
    </header>
  )
}
