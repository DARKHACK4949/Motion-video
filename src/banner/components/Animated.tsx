import React from "react";
import { useCurrentFrame } from "remotion";
import { Pose } from "../motion/pose";

export type TrailOptions = {
  /** Number of ghost samples. */
  samples?: number;
  /** Shutter length in frames (0.5 = 180° shutter). */
  shutter?: number;
  /** px/frame at which the trail starts to appear. */
  threshold?: number;
};

type Props = {
  /** Absolute pose sampler: x/y are the element's centre on the canvas. */
  poseAt: (frame: number) => Pose;
  w: number;
  h: number;
  zIndex?: number;
  filter?: string;
  trail?: TrailOptions | false;
  children: React.ReactNode;
};

const transformOf = (p: Pose, w: number, h: number) =>
  `translate3d(${(p.x - w / 2).toFixed(3)}px, ${(p.y - h / 2).toFixed(3)}px, 0) rotate(${p.rotate.toFixed(3)}deg) scale(${p.scale.toFixed(5)})`;

/**
 * Positions its children from a pure pose function. When `trail` is enabled and the object moves fast,
 * a few sub-frame samples are drawn behind it with falling opacity — a cheap directional motion blur
 * that only exists while the object is actually moving quickly.
 */
export const Animated: React.FC<Props> = ({ poseAt, w, h, zIndex, filter, trail, children }) => {
  const frame = useCurrentFrame();
  const p = poseAt(frame);
  if (p.opacity <= 0.001) return null;

  const base: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "50% 50%", willChange: "transform" };

  let ghosts: React.ReactNode[] = [];
  if (trail) {
    const { samples = 3, shutter = 0.6, threshold = 9 } = trail;
    const prev = poseAt(frame - 1);
    const speed = Math.hypot(p.x - prev.x, p.y - prev.y);
    const strength = Math.min(1, Math.max(0, (speed - threshold) / 25));
    if (strength > 0) {
      ghosts = Array.from({ length: samples }, (_, i) => {
        const k = (i + 1) / samples;
        const g = poseAt(frame - shutter * k);
        return (
          <div
            key={i}
            style={{
              ...base,
              transform: transformOf(g, w, h),
              opacity: g.opacity * strength * 0.42 * (1 - k * 0.7),
              filter: `${filter ?? ""} blur(${(1 + k * 2.5 * strength).toFixed(2)}px)`,
            }}
          >
            {children}
          </div>
        );
      }).reverse();
    }
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex, pointerEvents: "none" }}>
      {ghosts}
      <div style={{ ...base, transform: transformOf(p, w, h), opacity: p.opacity, filter }}>{children}</div>
    </div>
  );
};
