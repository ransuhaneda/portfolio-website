import { useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuCheck, LuLock } from "react-icons/lu";
import {
  useDirectionalContentSwap,
  type SwapDirection,
} from "../animations/useDirectionalContentSwap";
import { AsciiRevealImage } from "../components/AsciiRevealImage";
import { InternalHero } from "../components/InternalHero";
import { PretextFooterCanvas } from "../components/PretextFooterCanvas";
import { PretextText } from "../components/PretextText";
import { siteContent, type Project } from "../content/siteContent";

import sty from "./DesignSystemPage.module.scss";

const colors = [
  ["Page", "--color-background-page", "Page background"],
  ["Surface", "--color-background-surface", "Raised surface"],
  ["Inverse", "--color-background-inverse", "Light surface"],
  ["Chalk", "--color-text-primary", "Primary text"],
  ["Mist", "--color-text-muted", "Muted text"],
  ["Acid", "--color-action-primary", "Primary action"],
  ["Flare", "--color-action-secondary", "Secondary accent"],
  ["Iris", "--color-accent-violet", "Tertiary accent"],
] as const;

const spacing = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

function DirectionalSwapSpecimen({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scopeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { swap, isAnimating } = useDirectionalContentSwap({
    scope: scopeRef,
    copy: copyRef,
  });
  const activeProject = projects[activeIndex];

  if (!activeProject) return null;

  const navigate = (direction: SwapDirection) => {
    const nextIndex = (activeIndex + direction + projects.length) % projects.length;
    void swap(direction, () => setActiveIndex(nextIndex));
  };

  return (
    <div ref={scopeRef} className={sty.swapDemo} aria-live="polite">
      <div ref={copyRef} className={sty.swapDemoCopy}>
        <strong>{activeProject.title}</strong>
        <span>
          {activeProject.year} / {activeProject.client}
        </span>
      </div>
      <div className={sty.swapDemoControls}>
        <button
          type="button"
          className="button button--ghost"
          aria-label="Previous project"
          aria-disabled={isAnimating}
          onClick={() => navigate(-1)}
        >
          <LuArrowLeft aria-hidden="true" focusable="false" />
        </button>
        <button
          type="button"
          className="button button--ghost"
          aria-label="Next project"
          aria-disabled={isAnimating}
          onClick={() => navigate(1)}
        >
          <LuArrowRight aria-hidden="true" focusable="false" />
        </button>
      </div>
    </div>
  );
}

export function DesignSystemPage() {
  const content = siteContent.designSystemPage;
  const imageProject = siteContent.projects.find((project) => project.image);
  const motionProjects = siteContent.projects.filter((project) => project.image).slice(0, 3);
  const footerMotionText = siteContent.projects.map((project) => project.title).join(" / ");

  const section = (id: string) => content?.sections.find((item) => item.id === id);

  return (
    <div className={sty.page}>
      <InternalHero
        title={content?.title ?? "Design system reference"}
        intro={content?.intro ?? "The reusable visual engine behind the site."}
      />

      <section className={sty.block} id="color">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("color")?.title ?? "Color"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("color")?.description}
              </PretextText>
            </header>
            <div className={sty.swatches} data-text-reveal="copy">
              {colors.map(([name, token, role]) => (
                <article key={token}>
                  <div style={{ background: `var(${token})` }} />
                  <strong>{name}</strong>
                  <code>{token}</code>
                  <p>{role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={sty.block} id="type">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("type")?.title ?? "Typography"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("type")?.description}
              </PretextText>
            </header>
            <div className={sty.typeScale} data-text-reveal="copy">
              {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((role) => (
                <div key={role}>
                  <code>{role.toUpperCase()}</code>
                  <p className={`text-${role}`}>Structure before decoration.</p>
                </div>
              ))}
              <div>
                <code>BODY</code>
                <p>Structure before decoration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.block} id="spacing">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("spacing")?.title ?? "Spacing"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("spacing")?.description}
              </PretextText>
            </header>
            <div className={sty.spacingScale} data-text-reveal="copy">
              {spacing.map((size) => (
                <div key={size}>
                  <code>{size.toUpperCase()}</code>
                  <span style={{ width: `var(--space-${size})` }} />
                  <small>{`--space-${size}`}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={sty.block} id="grid">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("grid")?.title ?? "Grid"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("grid")?.description}
              </PretextText>
            </header>
            <div data-text-reveal="copy">
              <div className={sty.gridDemo}>
                {Array.from({ length: 12 }, (_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
              <div className={sty.wrapperList}>
                <article>
                  <code>SM</code>
                  <strong>700px</strong>
                </article>
                <article>
                  <code>MD</code>
                  <strong>960px</strong>
                </article>
                <article>
                  <code>LG</code>
                  <strong>1440px</strong>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.block} id="components">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("components")?.title ?? "Components"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("components")?.description}
              </PretextText>
            </header>
            <div className={sty.components}>
              <div className="button-row">
                <button className="button button--primary">
                  Primary
                  <LuArrowRight aria-hidden="true" focusable="false" />
                </button>
                <button className="button button--ghost">
                  Secondary
                  <LuCheck aria-hidden="true" focusable="false" />
                </button>
                <button className="button" disabled>
                  Disabled
                  <LuLock aria-hidden="true" focusable="false" />
                </button>
              </div>
              <ul className="tag-list">
                <li>Neutral</li>
                <li className={sty.tagAcid}>Acid</li>
                <li className={sty.tagFlare}>Flare</li>
                <li className={sty.tagIris}>Iris</li>
              </ul>
              <div className={sty.fieldDemo}>
                <label htmlFor="design-system-field">Field label</label>
                <input id="design-system-field" placeholder="Click or tab to focus" />
                <small>Production focus and field treatment.</small>
              </div>
              <div className={sty.surfaceDemo}>
                <article>
                  <span>Card overlay</span>
                  <PretextText as="h3" measure="heading">
                    Raised card
                  </PretextText>
                  <PretextText measure="prose">Low-contrast border.</PretextText>
                </article>
                <article>
                  <span>Top divider only</span>
                  <PretextText as="h3" measure="heading">
                    Quiet group
                  </PretextText>
                  <PretextText measure="prose">Many sections need no surrounding card.</PretextText>
                </article>
              </div>
              <div className={sty.dividers}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sty.block} id="motion">
        <div className="lg-wrapper">
          <div className={sty.blockGrid} data-text-reveal-group="scrub">
            <header>
              <PretextText as="h2" measure="heading" reveal="heading">
                {section("motion")?.title ?? "Motion"}
              </PretextText>
              <PretextText measure="intro" reveal="copy">
                {section("motion")?.description}
              </PretextText>
            </header>
            <div className={sty.motionShowcase}>
              <article className={`${sty.motionSpecimen} ${sty.motionSpecimenFeatured}`}>
                <div className={sty.specimenMeta}>
                  <span>01 / Text reveal</span>
                  <span>SplitText + ScrollTrigger</span>
                </div>
                <div className={sty.textRevealDemo}>
                  <PretextText as="h3" measure="heading" reveal="copy">
                    Text enters by line.
                  </PretextText>
                </div>
                <div className={sty.specimenCopy}>
                  <strong>Applied globally</strong>
                  <p>
                    Route headings and section copy use the same staggered line and copy reveals.
                  </p>
                </div>
              </article>

              <article className={sty.motionSpecimen}>
                <div className={sty.specimenMeta}>
                  <span>02 / Project swap</span>
                  <span>Directional GSAP transition</span>
                </div>
                <DirectionalSwapSpecimen projects={motionProjects} />
                <div className={sty.specimenCopy}>
                  <strong>Featured carousel</strong>
                  <p>Copy exits and enters from the direction of navigation.</p>
                </div>
              </article>

              <article className={sty.motionSpecimen}>
                <div className={sty.specimenMeta}>
                  <span>03 / Image reveal</span>
                  <span>ASCII canvas + pointer</span>
                </div>
                {imageProject?.image ? (
                  <AsciiRevealImage
                    className={sty.motionAscii}
                    src={imageProject.image.src}
                    alt={imageProject.image.alt}
                  />
                ) : null}
                <div className={sty.specimenCopy}>
                  <strong>Featured media</strong>
                  <p>The cached ASCII raster resolves into the project image on pointer entry.</p>
                </div>
              </article>

              <article className={`${sty.motionSpecimen} ${sty.motionSpecimenWide}`}>
                <div className={sty.specimenMeta}>
                  <span>04 / Footer field</span>
                  <span>Canvas + pointer field</span>
                </div>
                <div className={sty.footerMotionStage}>
                  <PretextFooterCanvas text={footerMotionText} />
                </div>
                <div className={sty.specimenCopy}>
                  <strong>Ambient text field</strong>
                  <p>
                    The footer's live text field drifts continuously and responds to pointer
                    position.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
