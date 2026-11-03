import { useMemo, useRef, type CSSProperties } from "react";
import { horizontalLoop } from "../animations/horizontalLoop";
import { useGSAP } from "../animations/gsap";
import { getProjectStackIcon, getProjectStackIconColor } from "./ProjectStackIcon";
import sty from "./SkillsMarquee.module.scss";

type SkillsMarqueeProps = {
  items: string[];
  ariaLabel: string;
};

export function SkillsMarquee({ items, ariaLabel }: SkillsMarqueeProps) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const sequenceItems = useMemo(() => items, [items]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const sequence = sequenceRef.current;
      if (!root || !track || !sequence) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let loop = horizontalLoop(track, sequence, { speed: 0.8 });
      const rebuild = () => {
        loop.kill();
        loop = horizontalLoop(track, sequence, { speed: 0.8 });
      };
      const resizeObserver = new ResizeObserver(rebuild);
      resizeObserver.observe(root);

      return () => {
        resizeObserver.disconnect();
        loop.kill();
      };
    },
    { scope: rootRef, dependencies: [sequenceItems], revertOnUpdate: true },
  );

  const renderSequence = (duplicate: boolean) => (
    <div ref={duplicate ? undefined : sequenceRef} className={sty.sequence} aria-hidden={duplicate}>
      {sequenceItems.map((item, index) => {
        const Icon = getProjectStackIcon(item);
        return (
          <span className={sty.item} key={`${item}-${index}`}>
            <span
              className={sty.iconBox}
              style={(() => {
                // SAFETY: React supports custom CSS properties although CSSProperties omits their index signature.
                return { "--icon-color": getProjectStackIconColor(item) } as CSSProperties;
              })()}
              aria-hidden="true"
            >
              <Icon />
            </span>
            <span className={sty.label}>{item}</span>
          </span>
        );
      })}
    </div>
  );

  return (
    <section ref={rootRef} className={sty.root} aria-label={ariaLabel}>
      <div className={sty.viewport} role="marquee" aria-live="off">
        <div ref={trackRef} className={sty.track}>
          {renderSequence(false)}
          {renderSequence(true)}
        </div>
      </div>
    </section>
  );
}
