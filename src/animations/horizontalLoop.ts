import { gsap } from "./gsap";

export interface HorizontalLoopConfig {
  paused?: boolean;
  repeat?: number;
  speed?: number;
}

/**
 * Creates a seamless loop by moving a track exactly one sequence width.
 * The next identical sequence is already in place when the tween repeats.
 */
export function horizontalLoop(
  track: HTMLElement,
  sequence: HTMLElement,
  config: HorizontalLoopConfig = {},
): gsap.core.Tween {
  const distance = sequence.getBoundingClientRect().width;
  const pixelsPerSecond = (config.speed ?? 1) * 100;

  return gsap.to(track, {
    x: -distance,
    duration: distance / pixelsPerSecond,
    ease: "none",
    paused: config.paused,
    repeat: config.repeat ?? -1,
  });
}
