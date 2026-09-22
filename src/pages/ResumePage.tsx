import { LuDownload } from 'react-icons/lu'
import { PretextText } from '../components/PretextText'
import { Section } from '../components/Section'
import { publicUrl } from '../content/publicUrl'
import { siteContent } from '../content/siteContent'
import sty from './InternalPages.module.scss'

export function ResumePage() {
  return (
    <div className={`${sty.page} ${sty.resumePage}`}>
      <section className={sty.resumeHero} data-text-reveal-group="entry">
        <div className="lg-wrapper">
          <div className={sty.resumeHeroGrid}>
            <PretextText as="h1" measure="heading" reveal="heading">{siteContent.resume.headline}</PretextText>
            <div className={sty.resumeHeroSummary} data-text-reveal="copy">
              <div className={sty.resumeHeroMeta}>
                <span className={sty.resumeSummaryLabel}>{siteContent.resume.eyebrow}</span>
                <a className={sty.resumeDownload} href={publicUrl(siteContent.resume.download.href)} download>
                  <LuDownload aria-hidden="true" focusable="false" />
                  <span>{siteContent.resume.download.label}</span>
                </a>
              </div>
              <div className={sty.resumeIntro}>
                {(siteContent.resume.summaryParagraphs ?? [siteContent.resume.summary]).map((paragraph) => <PretextText key={paragraph} measure="intro">{paragraph}</PretextText>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={siteContent.resume.skillsSectionTitle}>
        <ul className={sty.capabilityList} data-text-reveal="copy">
          {siteContent.resume.skills.map((skill, index) => <li className={index % 3 === 1 ? sty.skillFlare : index % 3 === 2 ? sty.skillIris : undefined} key={skill}>{skill}</li>)}
        </ul>
      </Section>
      <Section title={siteContent.resume.experienceSectionTitle}>
        <ol className={sty.experienceList} data-text-reveal="copy">
          {siteContent.resume.experience.map((item) => (
            <li key={`${item.company}-${item.role}`}>
              <div><PretextText as="h3" measure="heading">{item.role}</PretextText><PretextText measure="prose">{item.company}</PretextText></div>
              <span>{item.period}</span>
              <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </li>
          ))}
        </ol>
      </Section>

      {siteContent.resume.education?.length ? (
        <Section title={siteContent.resume.educationSectionTitle ?? 'Education and training'}>
          <ol className={sty.experienceList} data-text-reveal="copy">
            {siteContent.resume.education.map((item) => (
              <li key={`${item.school}-${item.program}`}>
                <div><PretextText as="h3" measure="heading">{item.program}</PretextText><PretextText measure="prose">{item.school}</PretextText></div>
                <span>{item.period}</span>
                <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
    </div>
  )
}
