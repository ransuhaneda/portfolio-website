import { useRef } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import { renderAscii } from "./ascii/AsciiConverter";
import sty from "./AsciiRevealImage.module.scss";

type AsciiRevealImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const COLUMN_COUNT = 3;
const REVEAL_DURATION = 1.05;
const STAGGER_FRACTION = 0.285;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function ease(value: number) {
  return value * value * (3 - 2 * value);
}

function copyCanvas(source: HTMLCanvasElement, target: HTMLCanvasElement) {
  target.width = source.width;
  target.height = source.height;
  target.getContext("2d")?.drawImage(source, 0, 0);
}

export function AsciiRevealImage({ src, alt, className }: AsciiRevealImageProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const scope = scopeRef.current;
      const image = scope?.querySelector<HTMLImageElement>("[data-ascii-source]");
      const ascii = scope?.querySelector<HTMLCanvasElement>("[data-ascii-static]");
      const ribbons = Array.from(
        scope?.querySelectorAll<HTMLCanvasElement>("[data-ascii-motion]") ?? [],
      );
      const reveal = scope?.querySelector<HTMLCanvasElement>("[data-ascii-reveal]");
      if (!scope || !image || !ascii || ribbons.length !== 3 || !reveal) return;

      const progress = { value: 0 };
      let ready = false;
      let resizeFrame = 0;
      const safeCallback = (callback: () => void) =>
        contextSafe ? contextSafe(callback) : callback;

      const drawReveal = () => {
        if (!ready || !reveal || !image.naturalWidth || !image.naturalHeight) return;
        const width = scope.clientWidth;
        const height = scope.clientHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
        const canvasWidth = Math.max(1, Math.round(width * pixelRatio));
        const canvasHeight = Math.max(1, Math.round(height * pixelRatio));
        if (reveal.width !== canvasWidth || reveal.height !== canvasHeight) {
          reveal.width = canvasWidth;
          reveal.height = canvasHeight;
        }

        const value = clamp(progress.value);
        image.style.opacity = value >= 0.99999 ? "1" : "0";
        reveal.style.visibility = value <= 0.00001 || value >= 0.99999 ? "hidden" : "visible";
        const context = reveal.getContext("2d");
        if (!context) return;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        if (value <= 0.00001) return;
        if (value >= 0.99999) {
          context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          return;
        }

        const sourceWidth = image.naturalWidth;
        const sourceHeight = image.naturalHeight;
        for (let column = 0; column < COLUMN_COUNT; column += 1) {
          const delay = column * (STAGGER_FRACTION / (COLUMN_COUNT - 1));
          const local = clamp((value - delay) / (1 - STAGGER_FRACTION));
          if (local <= 0) continue;
          const revealHeight = Math.min(canvasHeight, Math.round(ease(local) * canvasHeight));
          const x = Math.round((canvasWidth * column) / COLUMN_COUNT);
          const nextX = Math.round((canvasWidth * (column + 1)) / COLUMN_COUNT);
          const columnWidth = nextX - x;
          if (!columnWidth || !revealHeight) continue;
          const sourceX = (sourceWidth * x) / canvasWidth;
          const sourceColumnWidth = (sourceWidth * columnWidth) / canvasWidth;
          const sourceY = sourceHeight * (1 - revealHeight / canvasHeight);
          const sourceHeightToDraw = sourceHeight * (revealHeight / canvasHeight);
          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceColumnWidth,
            sourceHeightToDraw,
            x,
            canvasHeight - revealHeight,
            columnWidth,
            revealHeight,
          );
        }
      };

      const paint = () => {
        if (!ready) return;
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          const width = scope.clientWidth;
          const height = scope.clientHeight;
          if (width < 4 || height < 4) return;
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
          const actionColor = getComputedStyle(scope)
            .getPropertyValue("--color-action-primary")
            .trim();
          renderAscii(image, ascii, width, height, pixelRatio, {
            color: actionColor || undefined,
          });
          ribbons.forEach((ribbon) => copyCanvas(ascii, ribbon));
          drawReveal();
        });
      };

      const initialize = () => {
        ready = true;
        paint();
      };

      const enter = safeCallback(() => {
        scope.dataset.revealed = "true";
        gsap.to(progress, {
          value: 1,
          duration: REVEAL_DURATION,
          ease: "none",
          overwrite: true,
          onUpdate: drawReveal,
          onComplete: drawReveal,
        });
      });

      const leave = safeCallback(() => {
        scope.dataset.revealed = "false";
        gsap.to(progress, {
          value: 0,
          duration: REVEAL_DURATION,
          ease: "none",
          overwrite: true,
          onUpdate: drawReveal,
          onComplete: drawReveal,
        });
      });

      const pauseWhenHidden = () => {
        scope.dataset.paused = String(document.hidden);
      };
      const resizeObserver = new ResizeObserver(() => paint());
      const onPointerEnter = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        enter();
      };
      const onPointerLeave = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        leave();
      };
      scope.addEventListener("pointerenter", onPointerEnter);
      scope.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", pauseWhenHidden, { passive: true });
      image.addEventListener("load", initialize);
      if (image.complete && image.naturalWidth) initialize();
      resizeObserver.observe(scope);
      pauseWhenHidden();

      return () => {
        cancelAnimationFrame(resizeFrame);
        resizeObserver?.disconnect();
        scope.removeEventListener("pointerenter", onPointerEnter);
        scope.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("visibilitychange", pauseWhenHidden);
        image.removeEventListener("load", initialize);
      };
    },
    { scope: scopeRef, dependencies: [src], revertOnUpdate: true },
  );

  return (
    <div
      ref={scopeRef}
      className={[sty.root, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={alt}
      data-revealed="false"
    >
      <canvas className={`${sty.canvas} ${sty.ascii}`} data-ascii-static aria-hidden="true" />
      <canvas
        className={`${sty.canvas} ${sty.motion} ${sty.motionA}`}
        data-ascii-motion
        aria-hidden="true"
      />
      <canvas
        className={`${sty.canvas} ${sty.motion} ${sty.motionB}`}
        data-ascii-motion
        aria-hidden="true"
      />
      <canvas
        className={`${sty.canvas} ${sty.motion} ${sty.motionC}`}
        data-ascii-motion
        aria-hidden="true"
      />
      <img className={sty.source} data-ascii-source src={src} alt="" draggable={false} />
      <canvas className={`${sty.canvas} ${sty.reveal}`} data-ascii-reveal aria-hidden="true" />
    </div>
  );
}
