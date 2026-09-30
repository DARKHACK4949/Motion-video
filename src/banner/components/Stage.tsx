import React from "react";
import { useCurrentFrame } from "remotion";
import { LAYOUT } from "../config/layout";
import { PRODUCTS } from "../config/products";
import { T } from "../config/timeline";
import { COLORS } from "../config/theme";
import { EASE, lerp, progress, SPRING, springProgress } from "../motion/easing";
import { DEPTH, parallax } from "../motion/parallax";

const S = LAYOUT.stage;
const P = LAYOUT.plinth;

/** Damped kick used when a product lands: 0 → peak → 0 over `len` frames. */
const impulse = (t: number, len = 12) => (t <= 0 || t >= len ? 0 : Math.sin((Math.PI * t) / len) * (1 - t / len));

const LANDINGS = PRODUCTS.map((p) => p.land).filter((x): x is number => x !== undefined);

/** Stage scale: spring in, tiny pulses on each touchdown, accelerate out. */
export const stageScale = (f: number) => {
  const inS = springProgress(f, T.stage.in, T.stage.inDur, SPRING.product);
  const out = progress(f, T.stage.out, T.stage.outDur, EASE.inCubic);
  const pulse = LANDINGS.reduce((acc, l) => acc + 0.016 * impulse(f - l), 0);
  return Math.max(0, inS * (1 - out) * (1 + pulse));
};

const Ripple: React.FC<{ start: number; from: number; to: number }> = ({ start, from, to }) => {
  const f = useCurrentFrame();
  const p = progress(f, start, 20, EASE.outCubic);
  if (f < start || p >= 1) return null;
  const r = lerp(from, to, p);
  return (
    <div
      style={{
        position: "absolute",
        left: S.x - r,
        top: S.y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `${lerp(10, 1, p)}px solid ${COLORS.brand}`,
        opacity: 0.45 * (1 - p),
      }}
    />
  );
};

/** Diagonal speed lines clipped inside the disc. */
const Streaks: React.FC<{ start: number; angle: number }> = ({ start, angle }) => {
  const f = useCurrentFrame();
  const lines = [
    { dy: -90, len: 220, d: 0 },
    { dy: 10, len: 300, d: 2 },
    { dy: 110, len: 180, d: 4 },
  ];
  return (
    <>
      {lines.map((l, i) => {
        const p = progress(f, start + l.d, 12, EASE.inOutCubic);
        if (f < start + l.d || p >= 1) return null;
        const travel = lerp(-420, 420, p);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: S.r - l.len / 2,
              top: S.r + l.dy,
              width: l.len,
              height: 5,
              borderRadius: 3,
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 70%, rgba(255,255,255,0.95) 100%)",
              opacity: Math.sin(Math.PI * p),
              transform: `rotate(${angle}deg) translateX(${travel.toFixed(2)}px)`,
            }}
          />
        );
      })}
    </>
  );
};

const SPARKLES = [
  { x: 770, y: 196, s: 26 },
  { x: 1128, y: 140, s: 20 },
  { x: 700, y: 404, s: 18 },
  { x: 940, y: 92, s: 22 },
  { x: 1190, y: 440, s: 18 },
];

const Sparkles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {T.sparkles.map((start, i) => {
        const sp = SPARKLES[i % SPARKLES.length];
        const t = (f - start) / 18;
        if (t <= 0 || t >= 1) return null;
        const s = Math.sin(Math.PI * t);
        return (
          <svg
            key={i}
            viewBox="0 0 100 100"
            width={sp.s}
            height={sp.s}
            style={{ position: "absolute", left: sp.x - sp.s / 2, top: sp.y - sp.s / 2, transform: `scale(${s.toFixed(4)}) rotate(${(t * 90).toFixed(2)}deg)`, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))" }}
          >
            <path d="M50 0C54 36 64 46 100 50C64 54 54 64 50 100C46 64 36 54 0 50C36 46 46 36 50 0Z" fill="#fff" />
          </svg>
        );
      })}
    </>
  );
};

/** Blue hero disc + rotating rings + 3D plinth. Products stand on the plinth. */
export const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const cam = parallax(f, DEPTH.products);
  const scale = stageScale(f);
  const plinthIn = springProgress(f, T.stage.in + 5, 16, SPRING.heavy);
  const plinthOut = progress(f, T.stage.out + 3, T.stage.outDur, EASE.inCubic);
  const plinth = Math.max(0, plinthIn * (1 - plinthOut));
  const spin = f * 0.35;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, transform: `translate3d(${cam.x}px, ${cam.y}px, 0)` }}>
      <Ripple start={T.stage.ripple} from={S.r * 0.6} to={S.r * 1.35} />
      <Ripple start={T.stage.rippleOut} from={S.r * 0.2} to={S.r * 1.2} />

      {scale > 0.001 && (
        <div style={{ position: "absolute", left: S.x - S.r, top: S.y - S.r, width: S.r * 2, height: S.r * 2, transform: `scale(${scale.toFixed(5)})` }}>
          {/* outer rings */}
          <svg viewBox="-300 -300 600 600" width={S.r * 2 + 110} height={S.r * 2 + 110} style={{ position: "absolute", left: -55, top: -55, transform: `rotate(${spin}deg)` }}>
            <circle r="292" fill="none" stroke={COLORS.brand} strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="3 10" />
            <circle r="270" fill="none" stroke={COLORS.brand} strokeOpacity="0.14" strokeWidth="2" />
            <circle r="270" fill="none" stroke={COLORS.brand} strokeOpacity="0.55" strokeWidth="3.5" strokeDasharray="60 1636" strokeLinecap="round" />
          </svg>

          {/* disc */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              background: `radial-gradient(circle at 38% 30%, ${COLORS.stageHi} 0%, ${COLORS.stageMid} 45%, ${COLORS.stageLo} 100%)`,
              boxShadow: "0 30px 60px rgba(20,60,200,0.30), inset 0 -18px 40px rgba(5,20,90,0.35), inset 0 10px 30px rgba(255,255,255,0.25)",
            }}
          >
            {/* halftone texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1.6px, transparent 1.8px)",
                backgroundSize: "18px 18px",
                WebkitMaskImage: "radial-gradient(circle at 70% 25%, #000 0%, transparent 60%)",
                maskImage: "radial-gradient(circle at 70% 25%, #000 0%, transparent 60%)",
                transform: `translate(${(f * 0.08).toFixed(3)}px, 0)`,
              }}
            />
            {/* big soft cross watermark */}
            <svg viewBox="0 0 100 100" width="300" height="300" style={{ position: "absolute", left: S.r - 150, top: S.r - 190, opacity: 0.08 }}>
              <path d="M38 8h24a6 6 0 0 1 6 6v18h18a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H68v18a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V68H14a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6h18V14a6 6 0 0 1 6-6z" fill="#fff" />
            </svg>
            <Streaks start={T.streaksIn} angle={-28} />
            <Streaks start={T.exitStreaks} angle={-50} />
          </div>
        </div>
      )}

      {/* plinth (cylinder) */}
      {plinth > 0.001 && (
        <svg
          width={P.rx * 2 + 20}
          height={P.ry * 2 + P.depth + 30}
          viewBox={`${-P.rx - 10} ${-P.ry - 10} ${P.rx * 2 + 20} ${P.ry * 2 + P.depth + 30}`}
          style={{
            position: "absolute",
            left: P.x - P.rx - 10,
            top: P.y - P.ry - 10,
            transform: `scale(${plinth.toFixed(5)}, ${Math.min(1, plinth * 1.1).toFixed(5)})`,
            transformOrigin: `${P.rx + 10}px ${P.ry + 10}px`,
            overflow: "visible",
          }}
        >
          <defs>
            <linearGradient id="plinth-side" x1="0" x2="1">
              <stop offset="0" stopColor="#C9D8F5" />
              <stop offset="0.45" stopColor="#F4F8FF" />
              <stop offset="1" stopColor="#B7C9EE" />
            </linearGradient>
            <radialGradient id="plinth-top" cx="0.45" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E3ECFB" />
            </radialGradient>
          </defs>
          <ellipse cx="0" cy={P.depth + 8} rx={P.rx} ry={P.ry} fill="rgba(10,30,100,0.25)" style={{ filter: "blur(8px)" }} />
          <path d={`M${-P.rx} 0 L${-P.rx} ${P.depth} A${P.rx} ${P.ry} 0 0 0 ${P.rx} ${P.depth} L${P.rx} 0 Z`} fill="url(#plinth-side)" />
          <ellipse cx="0" cy="0" rx={P.rx} ry={P.ry} fill="url(#plinth-top)" />
          <ellipse cx="0" cy="0" rx={P.rx - 2} ry={P.ry - 2} fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
      )}

      <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
        <Sparkles />
      </div>
    </div>
  );
};
