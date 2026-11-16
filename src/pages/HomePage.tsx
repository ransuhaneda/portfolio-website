import { Link } from "react-router";
import {
  LuArrowDown,
  LuArrowRight,
  LuArrowUpRight,
  LuGithub,
  LuLinkedin,
  LuMail,
} from "react-icons/lu";
import { ContactForm } from "../components/ContactForm";
import { FeaturedProjectCarousel } from "../components/FeaturedProjectCarousel";
import { GithubContributionBackground } from "../components/GithubContributionBackground";
import { PretextText } from "../components/PretextText";
import { SkillsMarquee } from "../components/SkillsMarquee";
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

function getContactIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("linkedin")) return LuLinkedin;
  if (normalized.includes("github")) return LuGithub;

  return LuMail;
}

export function HomePage() {
  const hero = siteContent.home.hero;
  const title = hero.title;
  const tools = siteContent.home.skills.items;

  return (
    <div className={sty.root}>
      <section className={sty.hero} data-text-reveal-group="entry">
        <GithubContributionBackground />
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
            <SkillsMarquee
              items={tools}
              ariaLabel={siteContent.home.skills.cloudAriaLabel ?? "Tools and technologies"}
            />
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
              <div className={sty.contactMethods} data-text-reveal="copy">
                {siteContent.contact.methods.map((method) => {
                  const Icon = getContactIcon(method.title);

                  return (
                    <a
                      key={method.title}
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <span>
                        <Icon aria-hidden="true" focusable="false" />
                      </span>
                      <div>
                        <strong>{method.title}</strong>
                        <small>{method.label}</small>
                      </div>
                    </a>
                  );
                })}
              </div>
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
