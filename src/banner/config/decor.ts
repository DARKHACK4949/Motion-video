import { EASE } from "../motion/easing";
import { DEPTH } from "../motion/parallax";
import { stack, Track } from "../motion/pose";
import { ambientFloat, enterFrom, exitTo, flyThrough, microRotate, subtleFloat } from "../motion/presets";
import { T } from "./timeline";

export type DecorKind = "cross" | "capsule-red" | "capsule-blue" | "pill" | "leaf";

/**
 * Stacking slots (back → front):
 *   back       – large soft crosses inside the atmosphere
 *   mid        – ambient crosses / floating pills (always present → must be loop-periodic)
 *   storyBack  – story elements that sit BEHIND the products
 *   storyFront – story elements that sit IN FRONT of the products
 *   front      – blurred foreground elements at the frame edges
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

/** Story element: enter → gentle idle → leave with the exit wave. */
const story = (enter: Track, exit: Track, ...idle: Track[]) => stack(enter, ...idle, exit);

const WAVE_EXIT = { x: 620, y: -440, rotate: 60 };

export const DECOR: DecorSpec[] = [
  /* ---------------- back: big soft crosses ---------------- */
  { id: "bx1", kind: "cross", layer: "back", x: 150, y: 92, rotate: 8, size: 96, depth: DEPTH.background, blur: 5, opacity: 0.75, track: ambientFloat({ ax: 5, ay: 6, ar: 3, phase: 0.2 }) },
  { id: "bx2", kind: "cross", layer: "back", x: 560, y: 478, rotate: -10, size: 72, depth: DEPTH.background, blur: 4, opacity: 0.7, track: ambientFloat({ ax: 6, ay: 4, ar: 4, phase: 1.9 }) },
  { id: "bx3", kind: "cross", layer: "back", x: 872, y: 88, rotate: 12, size: 60, depth: DEPTH.atmosphere, blur: 3, opacity: 0.7, track: ambientFloat({ ax: 4, ay: 5, ar: 3, phase: 3.1 }) },
  { id: "bx4", kind: "cross", layer: "back", x: 1100, y: 500, rotate: -6, size: 116, depth: DEPTH.background, blur: 6, opacity: 0.7, track: ambientFloat({ ax: 7, ay: 5, ar: 2, phase: 4.2 }) },
  { id: "bx5", kind: "cross", layer: "back", x: 400, y: 42, rotate: 20, size: 44, depth: DEPTH.atmosphere, blur: 2, opacity: 0.65, track: ambientFloat({ ax: 4, ay: 4, ar: 5, phase: 5.3 }) },
  { id: "bx6", kind: "cross", layer: "back", x: 1216, y: 70, rotate: -14, size: 84, depth: DEPTH.background, blur: 5, opacity: 0.6, track: ambientFloat({ ax: 5, ay: 5, ar: 3, phase: 2.6 }) },

  /* ---------------- mid: ambient crosses + floating elements (loop-periodic) ---------------- */
  { id: "mx1", kind: "cross", layer: "mid", x: 322, y: 482, rotate: 10, size: 28, depth: DEPTH.decor, opacity: 0.9, track: ambientFloat({ ax: 4, ay: 6, ar: 8, phase: 0.7 }) },
  { id: "mx2", kind: "cross", layer: "mid", x: 612, y: 70, rotate: -8, size: 22, depth: DEPTH.decor, opacity: 0.9, track: ambientFloat({ ax: 5, ay: 4, ar: 10, phase: 2.2 }) },
  { id: "mx3", kind: "cross", layer: "mid", x: 44, y: 300, rotate: 6, size: 24, depth: DEPTH.decor, opacity: 0.85, track: ambientFloat({ ax: 3, ay: 7, ar: 6, phase: 3.9 }) },
  { id: "mx4", kind: "cross", layer: "mid", x: 760, y: 522, rotate: -12, size: 20, depth: DEPTH.decor, opacity: 0.85, track: ambientFloat({ ax: 5, ay: 3, ar: 8, phase: 5.0 }) },
  { id: "mx5", kind: "cross", layer: "mid", x: 236, y: 36, rotate: 14, size: 18, depth: DEPTH.decor, opacity: 0.9, track: ambientFloat({ ax: 4, ay: 3, ar: 9, phase: 1.5 }) },
  { id: "mx6", kind: "cross", layer: "mid", x: 1000, y: 516, rotate: -4, size: 26, depth: DEPTH.decor, opacity: 0.85, track: ambientFloat({ ax: 5, ay: 4, ar: 7, phase: 2.9 }) },
  { id: "ma1", kind: "capsule-red", layer: "mid", x: 1034, y: 40, rotate: -35, size: 46, depth: DEPTH.decor, track: ambientFloat({ ax: 6, ay: 5, ar: 10, phase: 1.1 }) },
  { id: "ma2", kind: "pill", layer: "mid", x: 468, y: 506, rotate: 0, size: 30, depth: DEPTH.decor, track: ambientFloat({ ax: 5, ay: 4, ar: 20, phase: 4.4 }) },

  /* ---------------- 0.5 s: first medical elements (staggered, different depths & speeds) ---------------- */
  {
    id: "sc1", kind: "capsule-red", layer: "storyBack", x: 622, y: 186, rotate: 38, size: 66, depth: DEPTH.decor * 1.2,
    track: story(
      enterFrom({ start: T.introCapsules.in, duration: 24, from: { x: 320, y: -280, rotate: 110, scale: 0.8 }, motion: { ease: EASE.outQuint }, fade: 6 }),
      exitTo({ start: T.heroDecor.out + 2, duration: 18, to: WAVE_EXIT, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 5, cycles: 2, phase: 0.4, start: T.introCapsules.in + 24 }),
    ),
    trail: true,
  },
  {
    id: "sc2", kind: "capsule-blue", layer: "storyFront", x: 1232, y: 478, rotate: -28, size: 72, depth: DEPTH.foreground,
    track: story(
      enterFrom({ start: T.introCapsules.in + T.introCapsules.stagger, duration: 26, from: { x: 220, y: 170, rotate: -120, scale: 0.85 }, motion: { ease: EASE.outExpo }, fade: 6 }),
      exitTo({ start: T.heroDecor.out + 10, duration: 16, to: { x: 260, y: 160, rotate: -60 }, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 4, cycles: 3, phase: 2.0, start: T.introCapsules.in + 30 }),
    ),
    trail: true,
  },
  {
    id: "sp1", kind: "pill", layer: "storyFront", x: 572, y: 350, rotate: 0, size: 34, depth: DEPTH.decor,
    track: story(
      enterFrom({ start: T.introCapsules.in + T.introCapsules.stagger * 2, duration: 22, from: { x: -240, y: 70, rotate: -140 }, motion: { ease: EASE.outQuint }, fade: 6 }),
      exitTo({ start: T.strip.out + 2, duration: 16, to: { x: -220, y: 260, rotate: -90 }, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 3, cycles: 2, phase: 3.0, start: T.introCapsules.in + 32 }),
    ),
  },
  {
    id: "sp2", kind: "pill", layer: "storyBack", x: 902, y: 70, rotate: 0, size: 28, depth: DEPTH.atmosphere, blur: 1,
    track: story(
      enterFrom({ start: T.introCapsules.in + T.introCapsules.stagger * 3, duration: 28, from: { x: 140, y: -170, rotate: 90 }, motion: { ease: EASE.outCubic }, fade: 8 }),
      exitTo({ start: T.heroDecor.out, duration: 20, to: WAVE_EXIT, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 4, cycles: 2, phase: 1.0, start: T.introCapsules.in + 40 }),
    ),
  },

  /* ---------------- 2.2 s: hero decor (leaves tucked behind the products) ---------------- */
  {
    id: "hl1", kind: "leaf", layer: "storyBack", x: 714, y: 160, rotate: -42, size: 104, depth: DEPTH.decor,
    track: story(
      enterFrom({ start: T.heroDecor.in, duration: 22, from: { x: 60, y: 50, rotate: -40, scale: 0.4 }, motion: { ease: EASE.outQuint }, fade: 8 }),
      exitTo({ start: T.heroDecor.out, duration: 18, to: WAVE_EXIT, ease: EASE.inCubic, fadeAt: 0.8 }),
      microRotate({ amplitude: 4, cycles: 2, phase: 0.5, start: T.heroDecor.in + 20 }),
    ),
  },
  {
    id: "hl2", kind: "leaf", layer: "storyBack", x: 1236, y: 290, rotate: 64, size: 112, depth: DEPTH.decor,
    track: story(
      enterFrom({ start: T.heroDecor.in + T.heroDecor.stagger, duration: 22, from: { x: -40, y: 40, rotate: 50, scale: 0.4 }, motion: { ease: EASE.outQuint }, fade: 8 }),
      exitTo({ start: T.heroDecor.out + T.heroDecor.outStagger * 3, duration: 18, to: { x: 420, y: -120, rotate: 40 }, ease: EASE.inCubic, fadeAt: 0.8 }),
      microRotate({ amplitude: 5, cycles: 3, phase: 1.7, start: T.heroDecor.in + 24 }),
    ),
  },
  {
    id: "hl3", kind: "leaf", layer: "storyBack", x: 900, y: 402, rotate: 150, size: 86, depth: DEPTH.decor,
    track: story(
      enterFrom({ start: T.heroDecor.in + T.heroDecor.stagger * 2, duration: 22, from: { x: 0, y: 60, rotate: 40, scale: 0.4 }, motion: { ease: EASE.outQuint }, fade: 8 }),
      exitTo({ start: T.heroDecor.out + T.heroDecor.outStagger, duration: 18, to: { x: 300, y: 300, rotate: 60 }, ease: EASE.inCubic, fadeAt: 0.8 }),
      microRotate({ amplitude: 4, cycles: 2, phase: 2.6, start: T.heroDecor.in + 26 }),
    ),
  },
  {
    id: "hc1", kind: "capsule-red", layer: "storyBack", x: 1088, y: 146, rotate: 24, size: 48, depth: DEPTH.decor * 1.1,
    track: story(
      enterFrom({ start: T.heroDecor.in + T.heroDecor.stagger * 3, duration: 20, from: { x: 180, y: -160, rotate: 120 }, motion: { ease: EASE.outQuint }, fade: 5 }),
      exitTo({ start: T.heroDecor.out + T.heroDecor.outStagger * 2, duration: 16, to: WAVE_EXIT, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 4, cycles: 3, phase: 0.9, start: T.heroDecor.in + 30 }),
    ),
    trail: true,
  },
  {
    id: "hp1", kind: "pill", layer: "storyFront", x: 764, y: 484, rotate: 0, size: 36, depth: DEPTH.foreground * 0.8,
    track: story(
      enterFrom({ start: T.heroDecor.in + T.heroDecor.stagger * 4, duration: 20, from: { x: 120, y: 120, rotate: 160 }, motion: { ease: EASE.outQuint }, fade: 5 }),
      exitTo({ start: T.strip.out + 4, duration: 16, to: { x: -260, y: 200, rotate: -120 }, ease: EASE.inCubic, fadeAt: 1 }),
      subtleFloat({ amplitude: 3, cycles: 3, phase: 2.4, start: T.heroDecor.in + 34 }),
    ),
  },

  /* ---------------- exit: capsules keep travelling through the frame ---------------- */
  { id: "fx1", kind: "capsule-red", layer: "front", x: 0, y: 0, rotate: 30, size: 62, depth: DEPTH.foreground, trail: true,
    track: flyThrough({ start: T.dolo.out + 3, duration: 24, from: [640, 620], to: [1420, -90], rotate: 200, ease: EASE.inOutCubic }) },
  { id: "fx2", kind: "capsule-blue", layer: "front", x: 0, y: 0, rotate: -20, size: 56, depth: DEPTH.foreground, blur: 1, trail: true,
    track: flyThrough({ start: T.dolo.out + 11, duration: 22, from: [820, 630], to: [1430, 120], rotate: -160, ease: EASE.inOutCubic }) },
  { id: "fx3", kind: "pill", layer: "storyFront", x: 0, y: 0, rotate: 0, size: 30, depth: DEPTH.decor, trail: true,
    track: flyThrough({ start: T.dolo.out + 16, duration: 20, from: [700, 590], to: [1120, -60], rotate: 180, ease: EASE.inOutSine }) },

  /* ---------------- front: blurred edge elements (loop-periodic) ---------------- */
  { id: "fl1", kind: "leaf", layer: "front", x: 34, y: 40, rotate: 32, size: 118, depth: DEPTH.foreground, blur: 3, opacity: 0.95, track: ambientFloat({ ax: 5, ay: 6, ar: 4, phase: 0.9 }) },
  { id: "fl2", kind: "leaf", layer: "front", x: 1250, y: 520, rotate: -138, size: 86, depth: DEPTH.foreground, blur: 2, track: ambientFloat({ ax: 6, ay: 4, ar: 5, phase: 3.4 }) },
  { id: "fc1", kind: "capsule-blue", layer: "front", x: 1264, y: 214, rotate: 52, size: 66, depth: DEPTH.foreground, blur: 2.5, track: ambientFloat({ ax: 5, ay: 7, ar: 6, phase: 2.0 }) },
];
