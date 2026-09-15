import { InternalHero } from '../components/InternalHero'
import { ProjectCard } from '../components/ProjectCard'
import { siteContent } from '../content/siteContent'
import sty from './InternalPages.module.scss'

export function ProjectsPage() {
  return (
    <div className={sty.page}>
      <InternalHero
        title={siteContent.projectsPage?.title ?? 'Selected projects with enough context to be useful.'}
        intro={siteContent.projectsPage?.intro ?? 'Selected frontend and design-to-code work presented with useful context.'}
      />

      <section className={sty.archiveSection}>
        <div className="lg-wrapper">
          <div className={sty.projectGrid}>
            {siteContent.projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
