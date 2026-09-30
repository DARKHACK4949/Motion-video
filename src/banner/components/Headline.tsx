import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { T } from "../config/timeline";
import { COLORS, COPY, TYPE } from "../config/theme";
import { EASE, lerp, progress } from "../motion/easing";

const LINE_H = Math.round(TYPE.headline.size * TYPE.headline.lineHeight);
const MASK_PAD = 10;

/** Headline lines rise out of a mask — fast and confident, no bounce. */
const HeadlineLine: React.FC<{ text: string; index: number; accent?: boolean }> = ({ text, index, accent }) => {
  const f = useCurrentFrame();
  const start = T.headline.in + index * T.headline.lineStagger;
  const p = progress(f, start, T.headline.inDur, EASE.outExpo);
  const fadeIn = progress(f, start, 8, EASE.outCubic);
  const q = progress(f, T.headline.out + index * T.headline.outStagger, T.headline.outDur, EASE.inCubic);

  const y = lerp(LINE_H * 0.9, 0, p) - q * LINE_H * 0.7;
  const scale = lerp(0.965, 1, p);
  const opacity = fadeIn * (1 - q);

  return (
    <div style={{ height: LINE_H + MASK_PAD * 2, marginTop: index === 0 ? 0 : -MASK_PAD * 2, overflow: "hidden", padding: `${MASK_PAD}px 12px ${MASK_PAD}px 0` }}>
      <div
        style={{
          transform: `translate3d(0, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(4)})`,
          transformOrigin: "0% 100%",
          opacity,
          fontSize: TYPE.headline.size,
          fontWeight: TYPE.headline.weight,
          letterSpacing: TYPE.headline.tracking,
          lineHeight: `${LINE_H}px`,
          whiteSpace: "nowrap",
          ...(accent
            ? { background: `linear-gradient(95deg, ${COLORS.brand} 0%, ${COLORS.brandLight} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
            : { color: COLORS.ink }),
        }}
      >
        {text.endsWith(".") ? (
          <>
            {text.slice(0, -1)}
            <span style={{ marginLeft: "-0.05em" }}>.</span>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

/** Short speed-line accent under the headline — a quiet nod to "fast delivery". */
const SpeedLine: React.FC = () => {
  const f = useCurrentFrame();
  const inStart = T.headline.in + T.headline.lineStagger + 8;
  const grow = progress(f, inStart, 16, EASE.outExpo);
  const shrink = progress(f, T.headline.out, 12, EASE.inCubic);
  return (
    <div style={{ display: "flex", gap: 8, height: 5, marginTop: 4, marginLeft: 2 }}>
      {[64, 22, 10].map((w, i) => {
        const g = progress(f, inStart + i * 3, 14, EASE.outExpo);
        return (
          <div
            key={i}
            style={{
              width: w,
              height: 5,
              borderRadius: 3,
              background: i === 0 ? COLORS.brand : COLORS.brandLight,
              opacity: (i === 0 ? 1 : 0.55) * grow * (1 - shrink),
              transform: `scaleX(${(g * (1 - shrink)).toFixed(4)})`,
              transformOrigin: shrink > 0 ? "100% 50%" : "0% 50%",
            }}
          />
        );
      })}
    </div>
  );
};

const SupportLine: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const f = useCurrentFrame();
  const start = T.support.in + index * 3;
  const p = progress(f, start, T.support.inDur, EASE.outCubic);
  const q = progress(f, T.support.out + index * 2, T.support.outDur, EASE.inCubic);
  return (
    <div style={{ opacity: p * (1 - q), transform: `translate3d(0, ${(lerp(14, 0, p) - q * 10).toFixed(3)}px, 0)` }}>{text}</div>
  );
};

export const Headline: React.FC = () => (
  <div style={{ position: "absolute", left: LAYOUT.headline.x, top: LAYOUT.headline.y - MASK_PAD, width: LAYOUT.headline.width, zIndex: 70 }}>
    {COPY.headline.map((line, i) => (
      <HeadlineLine key={line} text={line} index={i} accent={i === 1} />
    ))}
    <SpeedLine />
    <div
      style={{
        marginTop: LAYOUT.support.gap,
        marginLeft: LAYOUT.support.x - LAYOUT.headline.x,
        fontSize: TYPE.support.size,
        fontWeight: TYPE.support.weight,
        lineHeight: TYPE.support.lineHeight,
        letterSpacing: TYPE.support.tracking,
        color: COLORS.inkSoft,
      }}
    >
      {COPY.support.map((line, i) => (
        <SupportLine key={line} text={line} index={i} />
      ))}
    </div>
  </div>
);
