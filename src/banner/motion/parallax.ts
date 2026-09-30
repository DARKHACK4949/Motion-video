import { loopSin } from "./loop";
import { pose, Pose } from "./pose";

/** Depth layers. Higher = closer to the viewer = more parallax travel. */
export const DEPTH = {
  background: 0.15,
  atmosphere: 0.3,
  decor: 0.55,
  text: 0.12,
  products: 1,
  foreground: 1.5,
} as const;

/**
 * A slow, loop-safe virtual "camera drift". Each layer is displaced proportionally to its depth,
 * which creates parallax without any 3D rendering.
 */
export const parallax = (frame: number, depth: number): Pose =>
  pose({
    x: depth * 9 * loopSin(frame, 1, 0.4),
    y: depth * 3.5 * loopSin(frame, 2, 1.1),
  });
