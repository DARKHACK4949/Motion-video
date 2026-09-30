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

  // One tactile arrow nudge + one shine sweep after landing — no continuous pulsing.
  const n = progress(f, T.cta.nudge, 14);
  const nudge = 5 * Math.sin(Math.PI * n) * (1 - n * 0.3);
  const shine = progress(f, T.cta.shine, 16, EASE.inOutCubic);

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
        transform: `translate3d(0, ${(lerp(26, 0, p) + q * 16).toFixed(3)}px, 0)`,
        borderRadius: h / 2,
        background: `linear-gradient(180deg, ${COLORS.ctaFrom} 0%, ${COLORS.ctaTo} 100%)`,
        boxShadow: "0 14px 26px rgba(10,30,74,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 7px 0 28px",
        fontSize: TYPE.cta.size,
        fontWeight: TYPE.cta.weight,
        letterSpacing: TYPE.cta.tracking,
        overflow: "hidden",
      }}
    >
      <span>{COPY.cta}</span>
      <div style={{ width: h - 14, height: h - 14, borderRadius: "50%", background: COLORS.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: `translateX(${nudge.toFixed(3)}px)` }}>
          <path d="M4 12h15M13 5.5 19.5 12 13 18.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: -10,
          bottom: -10,
          width: 40,
          left: lerp(-60, w + 20, shine),
          transform: "skewX(-20deg)",
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
          opacity: shine > 0 && shine < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};
