import { useEffect, useRef } from "react";
import { renderAscii } from "./ascii/AsciiConverter";
import sty from "./AsciiRevealImage.module.scss";

type AsciiRevealImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const PANEL_CLASSES = [sty.panel0, sty.panel1, sty.panel2];
const PAINT_DEBOUNCE_MS = 65;

/**
 * Keyed by source so a new image never reuses the previous project's painted
 * canvas or panel images; the fresh stage stays hidden until its ASCII is drawn.
 */
export function AsciiRevealImage(props: AsciiRevealImageProps) {
  return <AsciiRevealStage key={props.src} {...props} />;
}

function AsciiRevealStage({ src, alt, className }: AsciiRevealImageProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    const ascii = asciiRef.current;
    const image = imageRef.current;
    if (!scope || !ascii || !image) return;

    let loaded = image.complete && image.naturalWidth > 0;
    let near = false;
    let drawnWidth = -1;
    let drawnHeight = -1;
    let paintTimer = 0;

    const paint = () => {
      if (!loaded || !near) return;
      const width = Math.round(scope.clientWidth);
      const height = Math.round(scope.clientHeight);
      if (width < 4 || height < 4) return;
      if (drawnWidth === width && drawnHeight === height) return;
      drawnWidth = width;
      drawnHeight = height;
      const color = getComputedStyle(scope).getPropertyValue("--color-action-primary").trim();
      renderAscii(image, ascii, width, height, Math.min(window.devicePixelRatio || 1, 1.5), {
        color: color || undefined,
      });
      scope.dataset.ready = "true";
    };

    // The first paint runs immediately; only later resizes are debounced.
    const schedulePaint = () => {
      if (!loaded || !near) return;
      window.clearTimeout(paintTimer);
      if (drawnWidth < 0) paint();
      else paintTimer = window.setTimeout(paint, PAINT_DEBOUNCE_MS);
    };

    const onLoad = () => {
      loaded = true;
      schedulePaint();
    };

    // Only mouse and pen hover reveal; touch never activates or pins it.
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        scope.dataset.revealed = "true";
      }
    };
    const onPointerLeave = () => {
      scope.dataset.revealed = "false";
    };
    const onVisibilityChange = () => {
      scope.dataset.paused = String(document.hidden);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry?.isIntersecting ?? false;
        scope.dataset.offscreen = String(!near);
        schedulePaint();
      },
      { rootMargin: "220px 0px" },
    );
    const resizeObserver = new ResizeObserver(schedulePaint);

    image.addEventListener("load", onLoad);
    scope.addEventListener("pointerenter", onPointerEnter);
    scope.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });
    intersectionObserver.observe(scope);
    resizeObserver.observe(scope);
    onVisibilityChange();

    return () => {
      window.clearTimeout(paintTimer);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      image.removeEventListener("load", onLoad);
      scope.removeEventListener("pointerenter", onPointerEnter);
      scope.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scope.dataset.revealed = "false";
    };
  }, [src]);

  return (
    <div
      ref={scopeRef}
      className={[sty.root, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={alt}
      data-revealed="false"
      data-ready="false"
    >
      <canvas ref={asciiRef} className={sty.ascii} aria-hidden="true" />
      {PANEL_CLASSES.map((panelClass, index) => (
        <img
          key={index}
          ref={index === 0 ? imageRef : undefined}
          className={`${sty.panel} ${panelClass}`}
          src={src}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}
