import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { ProductConfig } from "../config/products";
import { EASE, lerp, progress } from "../motion/easing";
import { combine, pose, Pose } from "../motion/pose";
import { parallax } from "../motion/parallax";
import { Animated } from "./Animated";

const poseFn = (product: ProductConfig) => {
  const { rest } = product;
  const restPose = pose({ x: rest.x, y: rest.y, rotate: rest.rotate, scale: rest.scale });
  return (f: number): Pose => combine(restPose, product.enter(f), ...product.idle.map((t) => t(f)), product.exit(f), parallax(f, product.depth));
};

/**
 * Floor contact shadow. It stays on the plinth (never rotates with the product) and tightens /
 * darkens as the product approaches the surface — this is what makes the products feel grounded.
 */
const FloorShadow: React.FC<{ product: ProductConfig; at: (f: number) => Pose }> = ({ product, at }) => {
  const f = useCurrentFrame();
  const p = at(f);
  const cam = parallax(f, product.depth);
  const lift = Math.max(0, product.rest.y + cam.y - p.y);
  const near = Math.max(0, 1 - lift / 260);
  const opacity = product.shadow.opacity * near * near * p.opacity;
  if (opacity < 0.01) return null;
  const { w, h, dy } = product.shadow;
  const sx = lerp(0.45, 1, near) * p.scale;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - w / 2,
        top: product.rest.y + cam.y + dy - h / 2,
        width: w,
        height: h,
        zIndex: product.zIndex - 1,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(8,24,80,0.85), rgba(8,24,80,0))",
        opacity,
        transform: `scale(${sx.toFixed(4)})`,
        filter: `blur(${lerp(6, 1.5, near).toFixed(2)}px)`,
      }}
    />
  );
};

/** Two little puffs that spread along the plinth at touchdown. */
const Dust: React.FC<{ product: ProductConfig }> = ({ product }) => {
  const f = useCurrentFrame();
  if (product.land === undefined) return null;
  const t = progress(f, product.land, 14, EASE.outCubic);
  if (f < product.land || t >= 1) return null;
  const floor = product.rest.y + product.shadow.dy;
  return (
    <>
      {[-1, 1].map((dir) => (
        <div
          key={dir}
          style={{
            position: "absolute",
            left: product.rest.x + dir * lerp(product.shadow.w * 0.3, product.shadow.w * 0.62, t) - 22,
            top: floor - lerp(6, 14, t) - 9,
            width: 44,
            height: 18,
            zIndex: product.zIndex + 1,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            opacity: (1 - t) * 0.9,
            transform: `scale(${lerp(0.6, 1.4, t).toFixed(3)})`,
          }}
        />
      ))}
    </>
  );
};

/**
 * A real product packshot. The image is only ever positioned, rotated, uniformly scaled and faded.
 * `object-fit: contain` guarantees the original aspect ratio — packaging is never stretched or redrawn.
 */
export const Product: React.FC<{ product: ProductConfig }> = ({ product }) => {
  const at = poseFn(product);
  return (
    <>
      <FloorShadow product={product} at={at} />
      <Animated w={product.box.w} h={product.box.h} zIndex={product.zIndex} origin={product.origin} trail={{ threshold: 14, samples: 3, shutter: 0.55 }} poseAt={at}>
        <Img
          src={product.src}
          alt={product.alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: product.drop }}
        />
      </Animated>
      <Dust product={product} />
    </>
  );
};
