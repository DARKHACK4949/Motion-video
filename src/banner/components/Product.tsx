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

/** 0 when the product is high in the air, 1 when it sits on the plinth. */
const groundedness = (product: ProductConfig, p: Pose, f: number, falloff: number) => {
  const cam = parallax(f, product.depth);
  const lift = Math.abs(product.rest.y + cam.y - p.y) + Math.abs(product.rest.x + cam.x - p.x) * 0.35;
  return { near: Math.max(0, 1 - lift / falloff), cam };
};

/**
 * Key light sits top-left (matches the highlight on the stage disc), so shadows fall to the right.
 *
 *  1. Ambient occlusion — a wide, very soft pool under the product.
 *  2. Contact line     — a tight, dark ellipse exactly where it touches the plinth.
 * Both shrink / fade with height, so they tighten on touchdown.
 */
const ContactShadow: React.FC<{ product: ProductConfig; at: (f: number) => Pose }> = ({ product, at }) => {
  const f = useCurrentFrame();
  const p = at(f);
  const { near, cam } = groundedness(product, p, f, 260);
  const k = near * near * p.opacity;
  if (k < 0.01) return null;
  const { w, h, dy, opacity } = product.shadow;
  const floorY = product.rest.y + cam.y + dy + 3;
  const cx = p.x + 8;
  const layer = (lw: number, lh: number, blur: number, o: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: cx - lw / 2,
        top: floorY - lh / 2,
        width: lw,
        height: lh,
        zIndex: product.zIndex - 1,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(6,18,64,1), rgba(6,18,64,0))",
        opacity: o * k,
        transform: `scale(${lerp(0.5, 1, near).toFixed(4)})`,
        filter: `blur(${lerp(10, blur, near).toFixed(2)}px)`,
      }}
    />
  );
  return (
    <>
      {layer(w * 1.35, h * 3.2, 10, opacity * 0.55, "ao")}
      {layer(w * 1.02, h * 1.3, 3, opacity * 0.85, "mid")}
      {layer(w * 0.9, h * 0.55, 1.2, opacity, "contact")}
    </>
  );
};

/**
 * Cast shadow: the packshot's own silhouette (rendered black, blurred) projected onto the plinth.
 * This is a separate shadow layer — the product image itself is never altered.
 */
const CastShadow: React.FC<{ product: ProductConfig; at: (f: number) => Pose }> = ({ product, at }) => {
  const f = useCurrentFrame();
  const p = at(f);
  const { near } = groundedness(product, p, f, 120);
  const k = near * near * near * p.opacity;
  if (k < 0.01) return null;
  const { box, shadow } = product;
  const standing = shadow.cast === "standing";
  const outer = `translate3d(${(p.x - box.w / 2).toFixed(3)}px, ${(p.y - box.h / 2).toFixed(3)}px, 0) rotate(${p.rotate.toFixed(3)}deg) scale(${p.scale.toFixed(5)})`;
  // standing: squash onto the floor and lean away from the light; lying: offset down-right on the surface
  const project = standing ? "translate(6px, 2px) skewX(-58deg) scaleY(0.3)" : "translate(11px, 12px)";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: box.w,
        height: box.h,
        zIndex: product.zIndex - 1,
        transform: outer,
        transformOrigin: product.origin,
        pointerEvents: "none",
      }}
    >
      <Img
        src={product.src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: project,
          transformOrigin: "50% 100%",
          filter: `brightness(0) blur(${standing ? 4 : 5}px)`,
          opacity: (standing ? 0.5 : 0.42) * k,
        }}
      />
    </div>
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
      <CastShadow product={product} at={at} />
      <ContactShadow product={product} at={at} />
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
