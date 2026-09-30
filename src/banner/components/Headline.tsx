import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { T } from "../config/timeline";
import { COLORS, COPY, TYPE } from "../config/theme";
import { EASE, lerp, progress } from "../motion/easing";

const LINE_H = Math.round(TYPE.headline.size * TYPE.headline.lineHeight);

const textStyle: React.CSSProperties = {
  fontSize: TYPE.headline.size,
  fontWeight: TYPE.headline.weight,
  letterSpacing: TYPE.headline.tracking,
  lineHeight: `${LINE_H}px`,
  whiteSpace: "nowrap",
};

/** Optical kerning: pull a trailing period in slightly. Text stays plain editable strings. */
const Kerned: React.FC<{ text: string }> = ({ text }) =>
  text.endsWith(".") ? (
    <>
      {text.slice(0, -1)}
      <span style={{ marginLeft: "-0.04em" }}>.</span>
    </>
  ) : (
    <>{text}</>
  );

/** Line 1: rises out of a mask — fast, confident, no bounce. */
const MaskLine: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const p = progress(f, T.headline.in, T.headline.inDur, EASE.outExpo);
  const fade = progress(f, T.headline.in, 6);
  const q = progress(f, T.headline.out, T.headline.outDur, EASE.inCubic);
  const y = lerp(LINE_H, 0, p) - q * LINE_H;
  return (
    <div style={{ height: LINE_H + 8, overflow: "hidden", paddingRight: 12 }}>
      <div style={{ ...textStyle, color: COLORS.ink, opacity: fade * (1 - q * 0.6), transform: `translate3d(0, ${y.toFixed(3)}px, 0) scale(${lerp(0.97, 1, p).toFixed(4)})`, transformOrigin: "0% 100%" }}>
        <Kerned text={text} />
      </div>
    </div>
  );
};

/** Line 2: a brand highlight bar wipes in, then the word punches up inside it. */
const HighlightLine: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const bar = progress(f, T.highlight.in, T.highlight.inDur, EASE.outExpo);
  const barOut = progress(f, T.highlight.out, T.highlight.outDur, EASE.inCubic);
  const wordStart = T.headline.in + T.headline.lineStagger + 4;
  const p = progress(f, wordStart, T.headline.inDur, EASE.outExpo);
  const q = progress(f, T.headline.out + T.headline.outStagger, T.headline.outDur, EASE.inCubic);
  const scaleX = bar * (1 - barOut);
  if (scaleX <= 0.001 && p <= 0) return <div style={{ height: LINE_H + 12 }} />;

  return (
    <div style={{ position: "relative", display: "inline-block", height: LINE_H + 12, padding: "0 20px 0 16px", marginLeft: -16, marginTop: 4, overflow: "hidden", borderRadius: 18 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: `linear-gradient(100deg, ${COLORS.brand} 0%, ${COLORS.brandLight} 100%)`,
          boxShadow: "0 12px 26px rgba(31,91,255,0.30)",
          transform: `scaleX(${scaleX.toFixed(5)})`,
          transformOrigin: barOut > 0 ? "100% 50%" : "0% 50%",
        }}
      />
      <div
        style={{
          ...textStyle,
          position: "relative",
          color: "#fff",
          paddingTop: 6,
          transform: `translate3d(0, ${(lerp(LINE_H + 10, 0, p) - q * (LINE_H + 12)).toFixed(3)}px, 0)`,
        }}
      >
        <Kerned text={text} />
      </div>
    </div>
  );
};

const SupportLine: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const f = useCurrentFrame();
  const start = T.support.in + index * 3;
  const p = progress(f, start, T.support.inDur, EASE.outCubic);
  const q = progress(f, T.support.out + index * 2, T.support.outDur, EASE.inCubic);
  return <div style={{ opacity: p * (1 - q), transform: `translate3d(0, ${(lerp(14, 0, p) - q * 10).toFixed(3)}px, 0)` }}>{text}</div>;
};

export const Headline: React.FC = () => (
  <div style={{ position: "absolute", left: LAYOUT.headline.x, top: LAYOUT.headline.y, width: LAYOUT.headline.width, zIndex: 70 }}>
    <MaskLine text={COPY.headline[0]} />
    <HighlightLine text={COPY.headline[1]} />
    <div
      style={{
        marginTop: LAYOUT.support.gap,
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
