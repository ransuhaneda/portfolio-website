import { useId, type CSSProperties } from "react";
import { getProjectStackIcon, getProjectStackIconColor } from "./ProjectStackIcon";
import sty from "./ProjectStack.module.scss";

type ProjectStackProps = {
  items: string[];
  ariaLabel: string;
  reverseFlow?: boolean;
  variant?: "icons" | "grid";
};

export function ProjectStack({
  items,
  ariaLabel,
  reverseFlow = false,
  variant = "icons",
}: ProjectStackProps) {
  const instanceId = useId();
  const orderedItems = reverseFlow ? [...items].reverse() : items;
  const rootClassName = variant === "grid" ? `${sty.root} ${sty.grid}` : sty.root;
  return (
    <ul className={rootClassName} aria-label={ariaLabel}>
      {orderedItems.map((item, index) => {
        const Icon = getProjectStackIcon(item);
        const tooltipId = `${instanceId}-project-stack-tooltip-${index}`;
        return (
          <li
            key={item}
            aria-label={variant === "icons" ? item : undefined}
            aria-describedby={variant === "icons" ? tooltipId : undefined}
          >
            <div
              className={sty.iconBox}
              style={(() => {
                // SAFETY: Object.hasOwn proves item is a key of the closed color registry.
                const color = getProjectStackIconColor(item);
                // SAFETY: React supports custom CSS properties although CSSProperties omits their index signature.
                return { "--icon-color": color } as CSSProperties;
              })()}
            >
              <Icon aria-hidden="true" focusable="false" />
            </div>
            {variant === "grid" ? (
              <span className={sty.label}>{item}</span>
            ) : (
              <span className={sty.tooltip} id={tooltipId} role="tooltip">
                {item}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
