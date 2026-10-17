import { Link } from "react-router-dom";
import { LuArrowDown, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { ContactForm } from "../components/ContactForm";
import { FeaturedProjectCarousel } from "../components/FeaturedProjectCarousel";
import { PretextText } from "../components/PretextText";
import { blogPosts } from "../content/blogContent";
import { readingMinutes } from "../content/publicUrl";
import { siteContent } from "../content/siteContent";
import sty from "./HomePage.module.scss";

function renderAccentedTitle(title: string, accentPhrase?: string) {
  if (!accentPhrase || !title.includes(accentPhrase)) return title;
  const [before, after] = title.split(accentPhrase);

  return (
    <>
      {before}
      <span>{accentPhrase}</span>
      {after}
    </>
  );
}

export function HomePage() {
  const hero = siteContent.home.hero;
  const title = hero.title;
  const skillGroups = siteContent.home.skills.groups;

  return (
    <div className={sty.root}>
      <section className={sty.hero} data-text-reveal-group="entry">
        <div className="lg-wrapper">
          <div className={sty.heroInner}>
            <div className={sty.heroGrid}>
              <PretextText as="h1" measure="heading" reveal="heading" text={title}>
                {renderAccentedTitle(title, hero.accentPhrase)}
              </PretextText>
            </div>
            <div className={`${sty.heroActions} button-row`}>
              <a className="button button--primary" href="#selected-work">
                {siteContent.home.cta.primaryLabel}
                <LuArrowDown aria-hidden="true" focusable="false" />
              </a>
              {siteContent.home.cta.secondaryLabel ? (
                <Link className="button button--ghost" to="/contact">
                  {siteContent.home.cta.secondaryLabel}
                  <LuArrowRight aria-hidden="true" focusable="false" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {siteContent.home.featuredProjects.slugs.length ? (
        <section className={sty.featured} id="selected-work">
          <div className="lg-wrapper">
            <div className={sty.sectionInner} data-text-reveal-group="scrub">
              <FeaturedProjectCarousel
                projects={siteContent.projects}
                slugs={siteContent.home.featuredProjects.slugs}
                title={siteContent.home.featuredProjects.title}
                stackAriaTemplate={siteContent.home.featuredProjects.stackAriaTemplate}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className={sty.skills}>
        <div className="lg-wrapper">
          <div className={sty.skillsGrid} data-text-reveal-group="scrub">
            <div>
              <PretextText as="h2" measure="heading" reveal="heading">
                {siteContent.home.skills.title}
              </PretextText>
            </div>
            {skillGroups?.length ? (
              <div className={sty.skillGroups} data-text-reveal="copy">
                {skillGroups.map((group) => (
                  <article key={group.title}>
                    <PretextText as="h3" measure="heading">
                      {group.title}
                    </PretextText>
                    <ul aria-label={`${group.title} skills`}>
                      {group.items.map((skill, index) => (
                        <li
                          className={
                            index % 3 === 1
                              ? sty.skillFlare
                              : index % 3 === 2
                                ? sty.skillIris
                                : undefined
                          }
                          key={skill}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <ul
                data-text-reveal="copy"
                aria-label={siteContent.home.skills.cloudAriaLabel ?? "Skills cloud"}
              >
                {siteContent.home.skills.items.map((skill, index) => (
                  <li
                    className={
                      index % 3 === 1 ? sty.skillFlare : index % 3 === 2 ? sty.skillIris : undefined
                    }
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {blogPosts.length ? (
        <section className={sty.notes}>
          <div className="lg-wrapper">
            <div className={sty.notesInner} data-text-reveal-group="scrub">
              <div className={sty.notesHeader}>
                <PretextText as="h2" measure="heading" reveal="heading">
                  {siteContent.home.notes.title}
                </PretextText>
              </div>
              <div className={sty.notesGrid} data-text-reveal="copy">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link
                    className={sty.noteCard}
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    state={{ from: "/" }}
                  >
                    <div className={sty.noteMeta}>
                      {post.date} <span aria-hidden="true">·</span> {readingMinutes(post.body)} min
                      read
                    </div>
                    <PretextText as="h3" measure="heading">
                      {post.title}
                    </PretextText>
                    <PretextText measure="prose">
                      {post.excerpt ?? post.body.split("\n")[0]}
                    </PretextText>
                    <span className={sty.noteRead}>
                      Read article
                      <LuArrowUpRight
                        className={sty.noteArrow}
                        aria-hidden="true"
                        focusable="false"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={sty.contact} id="contact">
        <div className="lg-wrapper">
          <div className={sty.contactGrid} data-text-reveal-group="scrub">
            <div className={sty.contactCopy}>
              <PretextText as="h2" measure="heading" reveal="heading">
                {siteContent.home.contact.title}
              </PretextText>
              <PretextText
                measure="intro"
                reveal="copy"
                text={`Reach directly at ${siteContent.site.email}.`}
              >
                <span className={sty.contactMessage}>
                  Reach directly at{" "}
                  <span className={sty.contactEmailLine}>
                    <a href={`mailto:${siteContent.site.email}`}>{siteContent.site.email}</a>.
                  </span>
                </span>
              </PretextText>
            </div>
            <ContactForm
              contact={siteContent.home.contact}
              recipientEmail={siteContent.site.email}
              showTitle={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
