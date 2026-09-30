import React from "react";
import { COLORS } from "../config/theme";
import { DECOR, DecorLayer, DecorSpec } from "../config/decor";
import { combine, pose } from "../motion/pose";
import { parallax } from "../motion/parallax";
import { Animated } from "./Animated";
import { Capsule, Cross, Leaf, Pill } from "./shapes/Shapes";

export const DECOR_Z: Record<DecorLayer, number> = { back: 2, mid: 5, storyBack: 15, storyFront: 60, front: 90 };

const dims = (d: DecorSpec) => (d.kind.startsWith("capsule") ? { w: d.size, h: d.size * 0.4 } : { w: d.size, h: d.size });

const shadowFor = (d: DecorSpec) =>
  d.kind === "cross" ? "drop-shadow(0 6px 12px rgba(60,110,220,0.35))" : "drop-shadow(0 8px 10px rgba(18,44,110,0.22))";

const Shape: React.FC<{ spec: DecorSpec }> = ({ spec }) => {
  switch (spec.kind) {
    case "cross":
      return <Cross id={spec.id} />;
    case "capsule-red":
      return <Capsule id={spec.id} color={COLORS.capsuleRed} />;
    case "capsule-blue":
      return <Capsule id={spec.id} color={COLORS.capsuleBlue} />;
    case "pill":
      return <Pill id={spec.id} />;
    case "leaf":
      return <Leaf id={spec.id} />;
  }
};

/** Renders every decor element that belongs to `layer`. Returns a fragment so z-indices interleave with products. */
export const MedicalDecor: React.FC<{ layer: DecorLayer }> = ({ layer }) => (
  <>
    {DECOR.filter((d) => d.layer === layer).map((d) => {
      const { w, h } = dims(d);
      const rest = pose({ x: d.x, y: d.y, rotate: d.rotate, opacity: d.opacity ?? 1 });
      const filter = `${shadowFor(d)}${d.blur ? ` blur(${d.blur}px)` : ""}`;
      return (
        <Animated
          key={d.id}
          w={w}
          h={h}
          zIndex={DECOR_Z[layer]}
          filter={filter}
          trail={d.trail ? { threshold: 10 } : false}
          poseAt={(f) => combine(rest, d.track(f), parallax(f, d.depth))}
        >
          <Shape spec={d} />
        </Animated>
      );
    })}
  </>
);
