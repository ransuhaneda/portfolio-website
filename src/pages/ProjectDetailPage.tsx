import { Link, useLocation, useParams } from 'react-router-dom'
import { LuArrowLeft, LuArrowRight, LuExternalLink } from 'react-icons/lu'
import { siteContent } from '../content/siteContent'

import sty from './ProjectDetailPage.module.scss'
import { PretextText } from '../components/PretextText'
import { ScrollOpacityText } from '../components/ScrollOpacityText'
import { ProjectStack } from '../components/ProjectStack'
import { getRelatedEntries } from '../content/relatedContent'


const sectionLabel = (index: string, label: string) => `[ ${index} / ${label} ]`

const getInternalBackPath = (state: { from?: string } | null, fallback: string) => state?.from?.startsWith('/') && !state.from.startsWith('//') ? state.from : fallback

export function ProjectDetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const backPath = getInternalBackPath(location.state, '/projects')
  const projectIndex = siteContent.projects.findIndex((entry) => entry.slug === slug)
  const project = projectIndex >= 0 ? siteContent.projects[projectIndex] : undefined
  const detailCopy = siteContent.projectDetailPage

  if (!project) {
    return (
      <div className={sty.page}>
        <section className={sty.notFound} data-text-reveal-group="entry">
          <div className="lg-wrapper">
            <div>
              <PretextText as="h1" measure="heading" reveal="heading">{detailCopy?.notFoundTitle ?? 'Project not found'}</PretextText>
              <PretextText measure="intro" reveal="copy">{detailCopy?.notFoundIntro ?? 'That case study is missing or has not been published yet.'}</PretextText>
              <Link className="button button--primary" to={backPath}><LuArrowLeft aria-hidden="true" focusable="false" />{detailCopy?.backToProjectsLabel ?? 'Back to projects'}</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const projects = siteContent.projects
  const relatedProjects = getRelatedEntries(projects, project.slug)


  return (
    <div className={sty.page} key={project.slug}>
      <section className={sty.hero} data-text-reveal-group="entry" aria-labelledby="project-title">
        <div className="lg-wrapper">
          <div className={sty.heroInner}>
            <Link className={sty.backLink} to={backPath}><LuArrowLeft aria-hidden="true" focusable="false" />{detailCopy?.backToProjectsLabel ?? 'All Projects'}</Link>
            <div className={sty.heroCopy}>
              <PretextText as="h1" id="project-title" measure="heading" reveal="heading">{project.title}</PretextText>
              <PretextText measure="prose">{project.summary}</PretextText>

            </div>
            <div className={sty.heroAside}>
              <ProjectStack items={project.stack} reverseFlow ariaLabel={`${project.title} technologies`} />
            <dl className={sty.metaTable} data-text-reveal="copy" aria-label="Project metadata">
              <div className={sty.statusRow}><dt>Status</dt><dd className={sty.statusContent}>
                {project.links?.length ? <span className={sty.projectLinks}>
                  {project.links.map((link, index) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {index === 0 ? <span className={sty.statusIndicator} aria-label="Online"><span aria-hidden="true" /></span> : null}
                    {link.label}<LuExternalLink aria-hidden="true" focusable="false" />
                  </a>)}
                </span> : null}
              </dd></div>
              <div><dt>{detailCopy?.roleLabel ?? 'Role'}</dt><dd>{project.role}</dd></div>
              <div><dt>{detailCopy?.clientLabel ?? 'Context'}</dt><dd>{project.client}</dd></div>
              <div><dt>{detailCopy?.yearLabel ?? 'Year'}</dt><dd>{project.year}</dd></div>
              </dl>
            </div>

          </div>
        </div>
      </section>


      <section className={sty.paperSection} data-text-reveal-group="scrub" aria-labelledby="overview-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.lightLabel} data-text-reveal="copy">{sectionLabel('01', 'OVERVIEW')}</p>
            <div>
              <ScrollOpacityText id="overview-title" as="h2" className={sty.statement}>{project.overview}</ScrollOpacityText>
            </div>
          </div>
        </div>
      </section>


      <section className={sty.narrativeSection} data-text-reveal-group="scrub" aria-labelledby="challenge-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.kicker} data-text-reveal="copy">{sectionLabel('02', 'PROBLEM')}</p>
            <div className={sty.prose}>
              <PretextText as="h2" id="challenge-title" measure="heading" reveal="heading">Problem</PretextText>
              <PretextText measure="prose" reveal="copy">{project.challenge}</PretextText>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.narrativeSection} data-text-reveal-group="scrub" aria-labelledby="approach-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.kicker} data-text-reveal="copy">{sectionLabel('03', 'RESPONSIBILITY')}</p>
            <div className={sty.prose}>
              <PretextText as="h2" id="approach-title" measure="heading" reveal="heading">My responsibility</PretextText>
              <PretextText measure="prose" reveal="copy">I worked as {project.role.toLowerCase()}, responsible for {project.scope.join(', ').toLowerCase()}.</PretextText>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.narrativeSection} data-text-reveal-group="scrub" aria-labelledby="work-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.kicker} data-text-reveal="copy">{sectionLabel('04', 'WORK')}</p>
            <div className={sty.prose}>
              <PretextText as="h2" id="work-title" measure="heading" reveal="heading">What I did</PretextText>
              <PretextText measure="prose" reveal="copy">{project.approachSummary}</PretextText>
              <ol className={sty.cardGrid} data-text-reveal="copy">
                {project.approach.map((item, index) => (
                  <li className={sty.numberedCard} key={item}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>


      <section className={sty.narrativeSection} data-text-reveal-group="scrub" aria-labelledby="result-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.kicker} data-text-reveal="copy">{sectionLabel('05', 'RESULT')}</p>
            <div className={sty.prose}>
              <PretextText as="h2" id="result-title" measure="heading" reveal="heading">Result</PretextText>
              <PretextText measure="prose" reveal="copy">{project.resultSummary}</PretextText>
              <ol className={sty.cardGrid} data-text-reveal="copy">
                {project.outcome.map((item, index) => (
                  <li className={sty.numberedCard} key={item}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.scopeSection} data-text-reveal-group="scrub" aria-labelledby="scope-title">
        <div className="lg-wrapper">
          <div className={sty.editorialBlock}>
            <p className={sty.kicker} data-text-reveal="copy">[ PROJECT SCOPE ]</p>
            <div>
              <PretextText as="h2" id="scope-title" measure="heading" reveal="heading">Services / Role / Tools</PretextText>
              <ul className={sty.scopeList} data-text-reveal="copy">{project.scope.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.quoteBand} data-text-reveal-group="scrub" aria-label="Project reflection">
        <div className="lg-wrapper">
          <div>
            <p className={sty.quoteLabel} data-text-reveal="copy">Project Reflection</p>
            <ScrollOpacityText as="blockquote">{`“${project.reflection}”`}</ScrollOpacityText>
          </div>
        </div>
      </section>

      {/* <nav className={sty.projectNav} aria-label="Adjacent projects">
        <div className="lg-wrapper">
          <div>
              <Link to={`/projects/${previousProject.slug}`}>
              <span><LuArrowLeft aria-hidden="true" focusable="false" />Previous Project</span>
              <strong>{previousProject.title}</strong>
            </Link>
            <Link to={`/projects/${nextProject.slug}`}>
              <span>Next Project<LuArrowRight aria-hidden="true" focusable="false" /></span>
              <strong>{nextProject.title}</strong>
            </Link>
          
          </div>
        </div>
      </nav> */}

      <section className={sty.relatedSection} data-text-reveal-group="scrub" aria-labelledby="related-title">
        <div className="lg-wrapper">
          <div className={sty.relatedHeader}>
            <div>
              <p className={sty.kicker} data-text-reveal="copy">[ MORE PROJECTS ]</p>
              <PretextText as="h2" id="related-title" measure="heading" reveal="heading">More Selected Work</PretextText>
            </div>
            <Link className={sty.viewAll} to="/projects">View All Work<LuArrowRight aria-hidden="true" focusable="false" /></Link>
          </div>
          <div className={sty.relatedGrid}>
            {relatedProjects.map((entry) => (
              <article className={sty.relatedCard} key={entry.slug}>
                <Link to={`/projects/${entry.slug}`}>
                  <span>{entry.year} / {entry.kind === 'experiment' ? 'Experiment' : 'Case study'}</span>
                  <PretextText as="h3" measure="heading" reveal="copy">{entry.title}</PretextText>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
