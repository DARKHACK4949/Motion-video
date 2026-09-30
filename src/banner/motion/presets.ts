import { EASE, EaseFn, lerp, progress, smoothstep, SPRING, SpringFeel, springProgress } from "./easing";
import { loopSin } from "./loop";
import { pose, Pose, Track } from "./pose";

/* ------------------------------------------------------------------ */
/* Entrances                                                           */
/* ------------------------------------------------------------------ */

export type FromPose = { x?: number; y?: number; rotate?: number; scale?: number };

export type EnterOptions = {
  start: number;
  duration: number;
  /** Pose offset the object starts from (relative to its resting pose). */
  from: FromPose;
  /** Either a spring feel (physical objects) or a bezier curve. */
  motion?: { spring: SpringFeel } | { ease: EaseFn };
  /** Frames to fade in over (0 = appear instantly, e.g. when entering from off-canvas). */
  fade?: number;
};

export const enterFrom =
  ({ start, duration, from, motion = { ease: EASE.outQuint }, fade = 8 }: EnterOptions): Track =>
  (f) => {
    const p = "spring" in motion ? springProgress(f, start, duration, motion.spring) : progress(f, start, duration, motion.ease);
    const inv = 1 - p;
    const opacity = f < start ? 0 : fade <= 0 ? 1 : progress(f, start, fade, EASE.outCubic);
    return pose({
      x: (from.x ?? 0) * inv,
      y: (from.y ?? 0) * inv,
      rotate: (from.rotate ?? 0) * inv,
      scale: lerp(from.scale ?? 1, 1, p),
      opacity,
    });
  };

type DirectionalEnter = Omit<EnterOptions, "from"> & {
  distance: number;
  /** Cross-axis offset (e.g. a slight diagonal). */
  offset?: number;
  rotateFrom?: number;
  scaleFrom?: number;
};

export const enterFromLeft = ({ distance, offset = 0, rotateFrom, scaleFrom, ...o }: DirectionalEnter) =>
  enterFrom({ ...o, from: { x: -distance, y: offset, rotate: rotateFrom, scale: scaleFrom } });

export const enterFromRight = ({ distance, offset = 0, rotateFrom, scaleFrom, ...o }: DirectionalEnter) =>
  enterFrom({ ...o, from: { x: distance, y: offset, rotate: rotateFrom, scale: scaleFrom } });

export const enterFromTop = ({ distance, offset = 0, rotateFrom, scaleFrom, ...o }: DirectionalEnter) =>
  enterFrom({ ...o, from: { x: offset, y: -distance, rotate: rotateFrom, scale: scaleFrom } });

export const enterFromBottom = ({ distance, offset = 0, rotateFrom, scaleFrom, ...o }: DirectionalEnter) =>
  enterFrom({ ...o, from: { x: offset, y: distance, rotate: rotateFrom, scale: scaleFrom } });

/** Spring-driven settle from an arbitrary offset pose (products). */
export const settleSpring = (o: Omit<EnterOptions, "motion"> & { feel?: SpringFeel }) =>
  enterFrom({ ...o, motion: { spring: o.feel ?? SPRING.product } });

/** Controlled scale entrance: from → peak → 1 (e.g. 0.8 → 1.05 → 1). */
export const softPop =
  ({ start, duration, from = 0.8, peak = 1.05, split = 0.55 }: { start: number; duration: number; from?: number; peak?: number; split?: number }): Track =>
  (f) => {
    if (f < start) return pose({ scale: from, opacity: 0 });
    const t = Math.min(1, (f - start) / duration);
    const scale = t < split ? lerp(from, peak, EASE.outCubic(t / split)) : lerp(peak, 1, EASE.inOutSine((t - split) / (1 - split)));
    return pose({ scale, opacity: progress(f, start, duration * 0.35, EASE.outCubic) });
  };

/* ------------------------------------------------------------------ */
/* Exits                                                               */
/* ------------------------------------------------------------------ */

export type ExitOptions = {
  start: number;
  duration: number;
  to: FromPose;
  ease?: EaseFn;
  /** Normalised time at which the fade-out begins (1 = never fade, rely on leaving the canvas). */
  fadeAt?: number;
};

export const exitTo =
  ({ start, duration, to, ease = EASE.inCubic, fadeAt = 0.6 }: ExitOptions): Track =>
  (f) => {
    const p = progress(f, start, duration, ease);
    const t = Math.min(1, Math.max(0, (f - start) / duration));
    const opacity = fadeAt >= 1 ? (t >= 1 ? 0 : 1) : 1 - smoothstep((t - fadeAt) / (1 - fadeAt));
    return pose({
      x: (to.x ?? 0) * p,
      y: (to.y ?? 0) * p,
      rotate: (to.rotate ?? 0) * p,
      scale: lerp(1, to.scale ?? 1, p),
      opacity,
    });
  };

type DirectionalExit = Omit<ExitOptions, "to"> & { distance: number; offset?: number; rotateTo?: number; scaleTo?: number };

export const exitToLeft = ({ distance, offset = 0, rotateTo, scaleTo, ...o }: DirectionalExit) =>
  exitTo({ ...o, to: { x: -distance, y: offset, rotate: rotateTo, scale: scaleTo } });
export const exitToRight = ({ distance, offset = 0, rotateTo, scaleTo, ...o }: DirectionalExit) =>
  exitTo({ ...o, to: { x: distance, y: offset, rotate: rotateTo, scale: scaleTo } });
export const exitToTop = ({ distance, offset = 0, rotateTo, scaleTo, ...o }: DirectionalExit) =>
  exitTo({ ...o, to: { x: offset, y: -distance, rotate: rotateTo, scale: scaleTo } });
export const exitToBottom = ({ distance, offset = 0, rotateTo, scaleTo, ...o }: DirectionalExit) =>
  exitTo({ ...o, to: { x: offset, y: distance, rotate: rotateTo, scale: scaleTo } });

/* ------------------------------------------------------------------ */
/* Secondary / idle motion                                             */
/* ------------------------------------------------------------------ */

export type OscillateOptions = {
  amplitude: number;
  /** Integer cycles per 6 s loop (keeps ambient motion seamless). */
  cycles: number;
  phase?: number;
  /** If set, the motion ramps in from zero amplitude AND zero velocity starting here. */
  start?: number;
  ramp?: number;
};

const envelope = (f: number, start?: number, ramp = 14) => (start === undefined ? 1 : smoothstep((f - start) / ramp));

const oscillate =
  (prop: "x" | "y" | "rotate" | "scale", o: OscillateOptions): Track =>
  (f) => {
    const v = o.amplitude * loopSin(f, o.cycles, o.phase ?? 0) * envelope(f, o.start, o.ramp);
    return prop === "scale" ? pose({ scale: 1 + v }) : pose({ [prop]: v });
  };

/** Vertical hover. */
export const subtleFloat = (o: OscillateOptions) => oscillate("y", o);
/** Rotational sway (degrees). */
export const microRotate = (o: OscillateOptions) => oscillate("rotate", o);
/** Horizontal drift. */
export const subtleDrift = (o: OscillateOptions) => oscillate("x", o);
/** Scale breathing (amplitude as a fraction, e.g. 0.012). */
export const breathe = (o: OscillateOptions) => oscillate("scale", o);

/** Convenience: a loop-safe 2D float used by ambient decor. */
export const ambientFloat =
  ({ ax, ay, ar = 0, cycles = 1, phase = 0 }: { ax: number; ay: number; ar?: number; cycles?: number; phase?: number }): Track =>
  (f) =>
    pose({
      x: ax * loopSin(f, cycles, phase),
      y: ay * loopSin(f, cycles * 2, phase * 1.7 + 0.5),
      rotate: ar * loopSin(f, cycles, phase + 1.2),
    });

/**
 * A straight fly-through between two points (decor passing across the frame).
 * Hidden outside [start, start+duration].
 */
export const flyThrough =
  ({ start, duration, from, to, ease = EASE.inOutSine, rotate = 0 }: { start: number; duration: number; from: [number, number]; to: [number, number]; ease?: EaseFn; rotate?: number }): Track =>
  (f) => {
    const p = progress(f, start, duration, ease);
    const visible = f >= start && f <= start + duration;
    return pose({ x: lerp(from[0], to[0], p), y: lerp(from[1], to[1], p), rotate: rotate * p, opacity: visible ? 1 : 0 });
  };

export type { Pose };
