import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CANVAS } from "../config/canvas";
import { COLORS } from "../config/theme";
import { loopSin } from "../motion/loop";
import { DEPTH, parallax } from "../motion/parallax";

/** A soft radial light blob. Positions are loop-periodic so frame 180 ≡ frame 0. */
const Glow: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle at 50% 50%, ${color} 0%, rgba(255,255,255,0) 70%)`,
    }}
  />
);

const WAVE_W = 1700;

/** Layered abstract waves, each drifting horizontally at its own depth-dependent speed. */
const Wave: React.FC<{ d: string; fill: string; shift: number; y: number }> = ({ d, fill, shift, y }) => (
  <svg
    width={WAVE_W}
    height={CANVAS.height}
    viewBox={`0 0 ${WAVE_W} ${CANVAS.height}`}
    style={{ position: "absolute", left: -(WAVE_W - CANVAS.width) / 2, top: 0, transform: `translate3d(${shift.toFixed(3)}px, ${y.toFixed(3)}px, 0)` }}
  >
    <path d={d} fill={fill} />
  </svg>
);

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const cam = parallax(f, DEPTH.background);
  const atm = parallax(f, DEPTH.atmosphere);

  return (
    <AbsoluteFill style={{ zIndex: 0, background: `linear-gradient(160deg, ${COLORS.bgTop} 0%, #EAF2FF 45%, ${COLORS.bgBottom} 100%)` }}>
      {/* Atmospheric gradients */}
      <AbsoluteFill style={{ transform: `translate3d(${atm.x}px, ${atm.y}px, 0)` }}>
        <Glow x={980 + 40 * loopSin(f, 1, 0.3)} y={250 + 20 * loopSin(f, 1, 1.9)} r={420} color={COLORS.atmosphereBlue} />
        <Glow x={260 + 30 * loopSin(f, 1, 2.4)} y={120 + 18 * loopSin(f, 1, 0.7)} r={360} color={COLORS.atmosphereWhite} />
        <Glow x={1180 + 24 * loopSin(f, 1, 4.1)} y={40 + 16 * loopSin(f, 2, 0.2)} r={300} color={COLORS.atmosphereCyan} />
        <Glow x={640 + 36 * loopSin(f, 1, 5.2)} y={560 + 12 * loopSin(f, 1, 3.3)} r={380} color={COLORS.atmosphereWhite} />
      </AbsoluteFill>

      {/* Abstract waves */}
      <Wave
        d="M0 330 C 260 260, 520 400, 820 330 S 1380 250, 1700 320 L 1700 540 L 0 540 Z"
        fill={COLORS.wave2}
        shift={cam.x + 26 * loopSin(f, 1, 0)}
        y={cam.y + 6 * loopSin(f, 1, 1.4)}
      />
      <Wave
        d="M0 410 C 300 350, 560 470, 900 400 S 1420 330, 1700 400 L 1700 540 L 0 540 Z"
        fill={COLORS.wave1}
        shift={cam.x * 1.6 - 34 * loopSin(f, 1, 0.9)}
        y={cam.y + 5 * loopSin(f, 1, 2.6)}
      />
      <Wave
        d="M0 470 C 340 440, 640 520, 980 470 S 1460 430, 1700 470 L 1700 540 L 0 540 Z"
        fill="rgba(255,255,255,0.55)"
        shift={cam.x * 2.2 + 20 * loopSin(f, 2, 2.1)}
        y={cam.y}
      />

      {/* Top light sweep for a premium, airy feel */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%)" }} />
    </AbsoluteFill>
  );
};
