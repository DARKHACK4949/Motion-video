import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { T } from "../config/timeline";
import { COLORS, COPY } from "../config/theme";
import { EASE, lerp, progress } from "../motion/easing";
import { softPop } from "../motion/presets";

const pop = softPop({ start: T.offer.in, duration: T.offer.inDur, from: 0.8, peak: 1.05 });

const starPath = (points: number, outer: number, inner: number) => {
  const d: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    d.push(`${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${d.join("L")}Z`;
};
const STAR = starPath(18, 50, 45);

/** Sticker seal: controlled 0.8 → 1.05 → 1 pop, the scalloped edge keeps turning slowly. */
export const OfferBadge: React.FC = () => {
  const f = useCurrentFrame();
  const { size, x, y, rotate } = LAYOUT.offer;
  const p = pop(f);
  const settle = progress(f, T.offer.in, T.offer.inDur + 4, EASE.outCubic);
  const q = progress(f, T.offer.out, T.offer.outDur, EASE.inCubic);
  const opacity = p.opacity * (q >= 1 ? 0 : 1);
  if (opacity <= 0.001) return null;

  const scale = p.scale * (1 - q);
  const rot = lerp(rotate - 30, rotate, settle) + q * 40;
  const edgeSpin = (f - T.offer.in) * 0.6;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        zIndex: 75,
        opacity,
        transform: `rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`,
        filter: "drop-shadow(0 12px 18px rgba(224,22,90,0.35))",
      }}
    >
      <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ position: "absolute", inset: 0, transform: `rotate(${edgeSpin.toFixed(2)}deg)` }}>
        <defs>
          <linearGradient id="offer-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.offerFrom} />
            <stop offset="1" stopColor={COLORS.offerTo} />
          </linearGradient>
        </defs>
        <path d={STAR} fill="url(#offer-g)" />
        <circle r="38" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 3" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          lineHeight: 1,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 15, letterSpacing: 2.5 }}>{COPY.offer.top}</div>
        <div style={{ fontSize: 40, letterSpacing: -1.5, margin: "3px 0 1px" }}>{COPY.offer.value}</div>
        <div style={{ fontSize: 17, letterSpacing: 2 }}>{COPY.offer.suffix}</div>
      </div>
    </div>
  );
};
