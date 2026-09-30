import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { T } from "../config/timeline";
import { COLORS, COPY, TYPE } from "../config/theme";
import { EASE, lerp, progress, SPRING, springProgress } from "../motion/easing";

export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { x, y, w, h } = LAYOUT.cta;
  const p = springProgress(f, T.cta.in, T.cta.inDur, SPRING.ui);
  const fade = progress(f, T.cta.in, 8, EASE.outCubic);
  const q = progress(f, T.cta.out, T.cta.outDur, EASE.inCubic);
  const opacity = fade * (1 - q);
  if (opacity <= 0.001) return null;

  // One tactile arrow nudge after landing — no continuous pulsing.
  const n = progress(f, T.cta.nudge, 14, (t) => t);
  const nudge = 5 * Math.sin(Math.PI * n) * (1 - n * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: 80,
        opacity,
        transform: `translate3d(0, ${(lerp(24, 0, p) + q * 14).toFixed(3)}px, 0) scale(${lerp(0.96, 1, p).toFixed(4)})`,
        transformOrigin: "0% 50%",
        borderRadius: h / 2,
        background: `linear-gradient(180deg, ${COLORS.ctaFrom} 0%, ${COLORS.ctaTo} 100%)`,
        boxShadow: "0 14px 26px rgba(31,91,255,0.32), inset 0 1px 0 rgba(255,255,255,0.28)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontSize: TYPE.cta.size,
        fontWeight: TYPE.cta.weight,
        letterSpacing: TYPE.cta.tracking,
      }}
    >
      <span>{COPY.cta}</span>
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: `translateX(${nudge.toFixed(3)}px)` }}>
        <path d="M4 12h15M13 5.5 19.5 12 13 18.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
