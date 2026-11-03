import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LuArrowLeft, LuArrowRight, LuExternalLink } from "react-icons/lu";
import {
  useDirectionalContentSwap,
  type SwapDirection,
} from "../animations/useDirectionalContentSwap";
import { getPreferredProjectLink, type Project } from "../content/siteContent";
import sty from "./FeaturedProjectCarousel.module.scss";
import { AsciiRevealImage } from "./AsciiRevealImage";
import { preloadImage } from "./ascii/preloadImage";
import { ProjectStack } from "./ProjectStack";
import { PretextText } from "./PretextText";

type FeaturedProjectCarouselProps = {
  projects: Project[];
  slugs: string[];
  title: string;
  stackAriaTemplate?: string;
};

function getWrappedIndex(index: number, length: number) {
  return (index + length) % length;
}

export function FeaturedProjectCarousel({
  projects,
  slugs,
  title,
  stackAriaTemplate,
}: FeaturedProjectCarouselProps) {
  const navigate = useNavigate();
  const featuredProjects = useMemo(
    () =>
      slugs
        .map((slug) => projects.find((project) => project.slug === slug))
        .filter((project): project is Project => Boolean(project)),
    [projects, slugs],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const interactionLock = useRef(false);
  const scopeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { swap, isAnimating } = useDirectionalContentSwap({
    scope: scopeRef,
    copy: copyRef,
  });

  const activeProject = featuredProjects[activeIndex];
  const totalProjects = featuredProjects.length;
  const isBusy = isPreparing || isAnimating;

  // Warm both neighbours so navigation rarely waits on the network.
  useEffect(() => {
    if (totalProjects < 2) return;
    for (const offset of [-1, 1]) {
      const src =
        featuredProjects[getWrappedIndex(activeIndex + offset, totalProjects)]?.image?.src;
      if (src) preloadImage(src).catch(() => {});
    }
  }, [activeIndex, featuredProjects, totalProjects]);

  const handleNavigate = useCallback(
    async (direction: SwapDirection) => {
      if (!activeProject || totalProjects < 2 || interactionLock.current || isBusy) return;

      const nextIndex = getWrappedIndex(activeIndex + direction, totalProjects);
      const nextProject = featuredProjects[nextIndex];
      if (!nextProject) return;

      interactionLock.current = true;

      try {
        // Decode the next image before the swap so its ASCII can paint on commit.
        if (nextProject.image) {
          setIsPreparing(true);
          await preloadImage(nextProject.image.src).catch(() => {});
          setIsPreparing(false);
        }
        await swap(direction, () => setActiveIndex(nextIndex));
      } finally {
        interactionLock.current = false;
      }
    },
    [activeIndex, activeProject, featuredProjects, isBusy, swap, totalProjects],
  );

  if (!activeProject || !totalProjects) return null;

  const previousProject = featuredProjects[getWrappedIndex(activeIndex - 1, totalProjects)];
  const nextProject = featuredProjects[getWrappedIndex(activeIndex + 1, totalProjects)];
  const position = String(activeIndex + 1).padStart(2, "0");
  const total = String(totalProjects).padStart(2, "0");
  const stackLabel = (stackAriaTemplate ?? "{title} tools").replace("{title}", activeProject.title);
  const projectPath = `/projects/${activeProject.slug}`;
  const projectLink = getPreferredProjectLink(activeProject);

  const openProject = () => navigate(projectPath, { state: { from: "/" } });
  const handleGridClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // SAFETY: React dispatches this handler from an Element, which supports closest().
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    void openProject();
  };
  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    void openProject();
  };

  return (
    <div className={sty.featuredCarousel} data-text-reveal="copy" aria-busy={isBusy}>
      <div className={sty.featuredHeading}>
        <p className="kicker">{title}</p>
        <div className={sty.featuredHeaderActions}>
          <p className={sty.meta}>
            {position} / {total}
          </p>
          <nav className={sty.carouselControls} aria-label="Featured project navigation">
            <button
              type="button"
              className={sty.carouselButton}
              aria-label={`Previous project: ${previousProject.title}`}
              aria-disabled={isBusy}
              onClick={() => void handleNavigate(-1)}
            >
              <LuArrowLeft aria-hidden="true" focusable="false" />
            </button>
            <button
              type="button"
              className={sty.carouselButton}
              aria-label={`Next project: ${nextProject.title}`}
              aria-disabled={isBusy}
              onClick={() => void handleNavigate(1)}
            >
              <LuArrowRight aria-hidden="true" focusable="false" />
            </button>
          </nav>
        </div>
      </div>

      <div
        ref={scopeRef}
        className={sty.featuredGrid}
        role="link"
        tabIndex={0}
        aria-label={`Open ${activeProject.title} case study`}
        onClick={handleGridClick}
        onKeyDown={handleGridKeyDown}
      >
        <span className={sty.featuredIndex}>{position}</span>
        <div ref={copyRef} className={sty.featuredCopy}>
          <div className={sty.featuredOverview}>
            <div>
              <PretextText as="h2" measure="heading">
                {activeProject.title}
              </PretextText>
              <PretextText measure="prose">{activeProject.summary}</PretextText>
            </div>

            <div className="">
              <ProjectStack items={activeProject.stack} ariaLabel={stackLabel} />
              <dl className={sty.projectMeta}>
                <div>
                  <dt>Client</dt>
                  <dd>{activeProject.client}</dd>
                </div>
                {projectLink ? (
                  <div>
                    <dt>
                      {new URL(projectLink.href).hostname === "github.com" ? "GitHub" : "Website"}
                    </dt>
                    <dd>
                      <a
                        className={sty.projectLink}
                        href={projectLink.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {projectLink.label}
                        <LuExternalLink aria-hidden="true" focusable="false" />
                      </a>
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt>Role</dt>
                    <dd>{activeProject.role}</dd>
                  </div>
                )}
                <div>
                  <dt>Year</dt>
                  <dd>{activeProject.year}</dd>
                </div>
              </dl>

              <div className={sty.featuredLinks}>
                <Link to={`/projects/${activeProject.slug}`} state={{ from: "/" }}>
                  Read the case study
                  <LuExternalLink aria-hidden="true" focusable="false" />
                </Link>
                <Link to="/projects">
                  All projects
                  <LuArrowRight aria-hidden="true" focusable="false" />
                </Link>
              </div>
            </div>
          </div>

          <div className={sty.featuredData}>
            {activeProject.image ? (
              <AsciiRevealImage
                className={sty.featuredMedia}
                src={activeProject.image.src}
                alt={activeProject.image.alt}
              />
            ) : null}
          </div>
        </div>
      </div>

      <p className={sty.visuallyHidden} aria-live="polite">
        Project {activeIndex + 1} of {totalProjects}: {activeProject.title}
      </p>
    </div>
  );
}
