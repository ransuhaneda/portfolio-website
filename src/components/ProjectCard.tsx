import { Link, useLocation, useNavigate } from 'react-router-dom'
import { siteContent, type Project } from '../content/siteContent'
import sty from './ProjectCard.module.scss'
import { ProjectStack } from './ProjectStack'
import { PretextText } from './PretextText'


type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const roleLabelPrefix = siteContent.projectsPage?.roleLabelPrefix ?? 'Role'
  const stackAriaLabel = (siteContent.projectsPage?.stackAriaTemplate ?? '{title} technologies').replace('{title}', project.title)
  const projectPath = `/projects/${project.slug}`

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    // SAFETY: React dispatches this handler from an Element, which supports closest().
    const target = event.target as HTMLElement
    if (target.closest('a, button')) return
    navigate(projectPath, { state: { from: location.pathname } })
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    navigate(projectPath, { state: { from: location.pathname } })
  }

  return (
    <article
      className={sty.root}
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title} case study`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className={sty.content} data-text-reveal="copy">
        <div className={sty.titleRow}>
          <PretextText as="h2" measure="heading"><Link to={`/projects/${project.slug}`} state={{ from: location.pathname }}>{project.title}</Link></PretextText>
          <span className={sty.year}>{project.year}</span>
        </div>
        <PretextText measure="prose">{project.summary}</PretextText>
        <div className={sty.meta}>
          <span>{project.client}</span>
          {project.status ? <span>{project.status}</span> : null}
          <span>{roleLabelPrefix}: {project.role}</span>
        </div>
        <div className={sty.stackRow}>
         {/* / {project.kind ? <span className={sty.kind}>{project.kind === 'case-study' ? 'Case study' : 'Experiment'}</span> : null} */}
          <ProjectStack items={project.stack} ariaLabel={stackAriaLabel} />
        </div>
      </div>
    </article>
  )
}
