import React from "react";
import { Img } from "remotion";
import { ProductConfig } from "../config/products";
import { combine, pose } from "../motion/pose";
import { parallax } from "../motion/parallax";
import { Animated } from "./Animated";

/**
 * A real product packshot. The image is only ever positioned, rotated, uniformly scaled and faded.
 * `object-fit: contain` guarantees the original aspect ratio — packaging is never stretched or redrawn.
 */
export const Product: React.FC<{ product: ProductConfig }> = ({ product }) => {
  const { box, rest, shadow } = product;
  const restPose = pose({ x: rest.x, y: rest.y, rotate: rest.rotate, scale: rest.scale });

  return (
    <Animated
      w={box.w}
      h={box.h}
      zIndex={product.zIndex}
      trail={{ threshold: 14, samples: 3, shutter: 0.55 }}
      poseAt={(f) => combine(restPose, product.enter(f), ...product.idle.map((t) => t(f)), product.exit(f), parallax(f, product.depth))}
    >
      {/* soft contact shadow */}
      <div
        style={{
          position: "absolute",
          left: box.w / 2 - shadow.contact.w / 2,
          top: box.h / 2 + shadow.contact.dy - shadow.contact.h / 2,
          width: shadow.contact.w,
          height: shadow.contact.h,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(18,44,110,0.9), rgba(18,44,110,0))",
          opacity: shadow.contact.opacity,
        }}
      />
      <Img
        src={product.src}
        alt={product.alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: shadow.drop }}
      />
    </Animated>
  );
};
