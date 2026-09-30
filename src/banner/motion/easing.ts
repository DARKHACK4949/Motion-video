import { Easing } from "remotion";

/** Named cubic-bezier curves. Different objects intentionally use different curves. */
export const EASE = {
  /** Fast, confident arrival with a long soft tail — typography. */
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  /** Directional entrances of decor/blister. */
  outQuint: Easing.bezier(0.22, 1, 0.36, 1),
  /** Softer arrival for supporting copy / CTA. */
  outCubic: Easing.bezier(0.33, 1, 0.68, 1),
  /** Exits: accelerate away (zero start velocity → no pop when leaving idle). */
  inCubic: Easing.bezier(0.55, 0, 0.85, 0.35),
  inQuart: Easing.bezier(0.6, 0, 0.9, 0.3),
  /** Symmetric moves. */
  inOutSine: Easing.bezier(0.37, 0, 0.63, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  /** Controlled overshoot (~6%) for small graphic pops. */
  outBackSoft: Easing.bezier(0.34, 1.45, 0.64, 1),
} as const;

export type EaseFn = (t: number) => number;

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** 0→1 progress over [start, start+duration] with easing. */
export const progress = (frame: number, start: number, duration: number, ease: EaseFn = (t) => t) =>
  ease(clamp01((frame - start) / duration));

export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type SpringFeel = {
  /** Damping ratio (0.6 ≈ 9% overshoot, 0.75 ≈ 3%, 1 = none). */
  damping: number;
};

export const SPRING = {
  /** Physical product settle: subtle overshoot, no wobble. */
  product: { damping: 0.68 },
  /** Heavier object — barely any overshoot. */
  heavy: { damping: 0.8 },
  /** UI element (CTA) — tight. */
  ui: { damping: 0.74 },
} as const;

/**
 * Analytic under-damped spring (closed form, so it can be sampled at fractional frames for motion blur).
 * Reaches exactly 1 at `start + duration` (residual oscillation is windowed out over the last 25%).
 */
export const springProgress = (frame: number, start: number, duration: number, feel: SpringFeel = SPRING.product) => {
  const t = frame - start;
  if (t <= 0) return 0;
  if (t >= duration) return 1;
  const z = Math.min(feel.damping, 0.999);
  const omega = 5.2 / (z * duration);
  const wd = omega * Math.sqrt(1 - z * z);
  const residual = Math.exp(-z * omega * t) * (Math.cos(wd * t) + ((z * omega) / wd) * Math.sin(wd * t));
  const window = 1 - smoothstep((t / duration - 0.75) / 0.25);
  return 1 - residual * window;
};
