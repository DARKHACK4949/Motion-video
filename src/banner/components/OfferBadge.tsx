import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { T } from "../config/timeline";
import { COLORS, COPY, TYPE } from "../config/theme";
import { EASE, lerp, progress } from "../motion/easing";
import { loopSin } from "../motion/loop";
import { softPop } from "../motion/presets";

const pop = softPop({ start: T.offer.in, duration: T.offer.inDur, from: 0.8, peak: 1.05 });

export const OfferBadge: React.FC = () => {
  const f = useCurrentFrame();
  const { w, h, x, y, rotate } = LAYOUT.offer;
  const p = pop(f);
  const settle = progress(f, T.offer.in, T.offer.inDur, EASE.outCubic);
  const q = progress(f, T.offer.out, T.offer.outDur, EASE.inCubic);
  const opacity = p.opacity * (1 - q);
  if (opacity <= 0.001) return null;

  const idle = 1.5 * loopSin(f, 3, 0.6) * progress(f, T.offer.in + T.offer.inDur, 12, EASE.inOutSine);
  const scale = p.scale * lerp(1, 0.86, q);
  const rot = lerp(rotate - 9, rotate, settle) + q * 6;
  const sheen = progress(f, T.offer.sheen, 16, EASE.inOutCubic);

  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2 + idle,
        width: w,
        height: h,
        zIndex: 75,
        opacity,
        transform: `rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`,
        borderRadius: 28,
        background: `linear-gradient(135deg, ${COLORS.offerFrom} 0%, ${COLORS.offerTo} 100%)`,
        boxShadow: "0 16px 30px rgba(224,22,90,0.30), inset 0 1px 0 rgba(255,255,255,0.35)",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: TYPE.offerSmall.size, fontWeight: TYPE.offerSmall.weight, letterSpacing: TYPE.offerSmall.tracking, lineHeight: 1 }}>{COPY.offer.top}</div>
      <div style={{ display: "flex", alignItems: "baseline", marginTop: 4 }}>
        <span style={{ fontSize: TYPE.offerBig.size, fontWeight: TYPE.offerBig.weight, letterSpacing: TYPE.offerBig.tracking, lineHeight: 1 }}>{COPY.offer.value}</span>
        <span style={{ fontSize: 17, fontWeight: 800, marginLeft: 4, letterSpacing: 0.5 }}>{COPY.offer.suffix}</span>
      </div>
      {/* single light sweep after the pop */}
      <div
        style={{
          position: "absolute",
          top: -20,
          bottom: -20,
          width: 46,
          left: lerp(-80, w + 40, sheen),
          transform: "skewX(-20deg)",
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
          opacity: sheen > 0 && sheen < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};
