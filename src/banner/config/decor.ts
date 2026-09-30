import { EASE } from "../motion/easing";
import { DEPTH } from "../motion/parallax";
import { stack, Track } from "../motion/pose";
import { ambientFloat, burstFrom, exitTo, growIn, microRotate, shrinkOut, subtleFloat } from "../motion/presets";
import { LAYOUT } from "./layout";
import { T } from "./timeline";

export type DecorKind = "cross" | "capsule-red" | "capsule-blue" | "pill" | "leaf";

/**
 * Stacking slots (back → front):
 *   back       – large soft crosses in the atmosphere (loop-periodic)
 *   mid        – small ambient crosses (loop-periodic)
 *   storyBack  – story elements between the stage and the products (capsule burst, leaf garnish)
 *   storyFront – story elements in front of the products
 *   front      – blurred foreground elements at the frame edges (loop-periodic)
 */
export type DecorLayer = "back" | "mid" | "storyBack" | "storyFront" | "front";

export type DecorSpec = {
  id: string;
  kind: DecorKind;
  layer: DecorLayer;
  /** Resting centre (px) + rotation (deg). */
  x: number;
  y: number;
  rotate: number;
  /** Longest dimension in px. */
  size: number;
  depth: number;
  /** Depth-of-field blur (px). */
  blur?: number;
  opacity?: number;
  track: Track;
  /** Draw velocity-based motion trail (fast movers only). */
  trail?: boolean;
};

const S = LAYOUT.stage;

/**
 * Capsule that bursts out of the stage centre to an orbit slot, bobs, then is flung outward
 * (radially, away from the stage) during the exit wave.
 */
const orbit = (id: string, kind: DecorKind, x: number, y: number, rotate: number, size: number, i: number, phase: number): DecorSpec => {
  const dx = x - S.x;
  const dy = y - S.y;
  const len = Math.hypot(dx, dy) || 1;
  const start = T.capsules.in + i * T.capsules.stagger;
  return {
    id,
    kind,
    layer: "storyBack",
    x,
    y,
    rotate,
    size,
    depth: DEPTH.products,
    trail: true,
    track: stack(
      burstFrom({ start, duration: T.capsules.dur, origin: { x: -dx, y: -dy }, spin: 240 * (i % 2 ? -1 : 1) }),
      subtleFloat({ amplitude: 5, cycles: 3, phase, start: start + T.capsules.dur - 4, ramp: 16 }),
      exitTo({
        start: T.capsules.out + i * T.capsules.outStagger,
        duration: T.capsules.outDur,
        to: { x: (dx / len) * 520, y: (dy / len) * 520, rotate: 160 },
        ease: EASE.inCubic,
        fadeAt: 1,
      }),
    ),
  };
};

/** Leaf tucked behind the product group — grows out like a garnish. */
const garnish = (id: string, x: number, y: number, rotate: number, size: number, i: number): DecorSpec => ({
  id,
  kind: "leaf",
  layer: "storyBack",
  x,
  y,
  rotate,
  size,
  depth: DEPTH.products,
  track: stack(
    growIn({ start: T.leaves.in + i * T.leaves.stagger, duration: T.leaves.dur, rotateFrom: -35 }),
    microRotate({ amplitude: 3, cycles: 2, phase: i * 1.3, start: T.leaves.in + i * T.leaves.stagger + T.leaves.dur, ramp: 12 }),
    shrinkOut({ start: T.leaves.out + i * 2, duration: T.leaves.outDur, rotateTo: 40 }),
  ),
});

export const DECOR: DecorSpec[] = [
  /* ---------------- back: big soft crosses ---------------- */
  { id: "bx1", kind: "cross", layer: "back", x: 150, y: 88, rotate: 8, size: 92, depth: DEPTH.background, blur: 5, opacity: 0.8, track: ambientFloat({ ax: 4, ay: 5, ar: 3, phase: 0.2 }) },
  { id: "bx2", kind: "cross", layer: "back", x: 548, y: 470, rotate: -10, size: 76, depth: DEPTH.background, blur: 4, opacity: 0.75, track: ambientFloat({ ax: 5, ay: 4, ar: 4, phase: 1.9 }) },
  { id: "bx3", kind: "cross", layer: "back", x: 612, y: 58, rotate: 16, size: 48, depth: DEPTH.atmosphere, blur: 2.5, opacity: 0.8, track: ambientFloat({ ax: 4, ay: 4, ar: 5, phase: 5.3 }) },
  { id: "bx4", kind: "cross", layer: "back", x: 1236, y: 504, rotate: -6, size: 90, depth: DEPTH.background, blur: 5, opacity: 0.7, track: ambientFloat({ ax: 5, ay: 4, ar: 2, phase: 4.2 }) },

  /* ---------------- mid: small crisp crosses ---------------- */
  { id: "mx1", kind: "cross", layer: "mid", x: 330, y: 486, rotate: 10, size: 24, depth: DEPTH.decor, track: ambientFloat({ ax: 3, ay: 5, ar: 8, phase: 0.7 }) },
  { id: "mx2", kind: "cross", layer: "mid", x: 44, y: 300, rotate: 6, size: 22, depth: DEPTH.decor, track: ambientFloat({ ax: 3, ay: 6, ar: 6, phase: 3.9 }) },
  { id: "mx3", kind: "cross", layer: "mid", x: 262, y: 40, rotate: 14, size: 18, depth: DEPTH.decor, track: ambientFloat({ ax: 4, ay: 3, ar: 9, phase: 1.5 }) },

  /* ---------------- 0.6 s: capsules burst out of the stage ---------------- */
  orbit("c1", "capsule-red", 740, 112, 38, 66, 0, 0.4),
  orbit("c2", "capsule-blue", 1240, 208, -32, 64, 1, 2.0),
  orbit("c3", "pill", 700, 322, 0, 36, 2, 3.1),
  orbit("c4", "capsule-red", 1034, 60, 20, 44, 3, 1.2),
  orbit("c5", "pill", 1246, 392, 0, 30, 4, 4.4),

  /* ---------------- 2.6 s: leaf garnish behind the products ---------------- */
  garnish("l1", 790, 196, -48, 112, 0),
  garnish("l2", 1226, 268, 52, 104, 1),
  garnish("l3", 1008, 178, 8, 86, 2),

  /* ---------------- front: blurred edge elements (loop-periodic) ---------------- */
  { id: "fl1", kind: "leaf", layer: "front", x: 30, y: 36, rotate: 32, size: 112, depth: DEPTH.foreground, blur: 3, opacity: 0.95, track: ambientFloat({ ax: 4, ay: 5, ar: 3, phase: 0.9 }) },
  { id: "fl2", kind: "capsule-blue", layer: "front", x: 26, y: 512, rotate: -30, size: 70, depth: DEPTH.foreground, blur: 2.5, track: ambientFloat({ ax: 4, ay: 4, ar: 4, phase: 3.4 }) },
];
