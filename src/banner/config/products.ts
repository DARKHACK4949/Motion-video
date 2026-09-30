import { staticFile } from "remotion";
import { EASE, SPRING } from "../motion/easing";
import { DEPTH } from "../motion/parallax";
import { Track } from "../motion/pose";
import {
  breathe,
  enterFromLeft,
  exitTo,
  exitToBottom,
  microRotate,
  settleSpring,
  subtleDrift,
  subtleFloat,
} from "../motion/presets";
import { T } from "./timeline";

/**
 * PRODUCT CONFIGURATION
 * ---------------------
 * To swap a product: drop a new transparent PNG/WebP into /public/products and change `src`.
 * The packshot is drawn with `object-fit: contain` inside `box`, so ANY aspect ratio is preserved —
 * the artwork itself is never re-drawn, stretched or recoloured. Only its pose animates.
 */
export type ProductConfig = {
  id: string;
  src: string;
  alt: string;
  /** Layout box (px). The image is contained inside, centred on `rest.x/y`. */
  box: { w: number; h: number };
  /** Resting pose in the hero composition (centre point, degrees, scale). */
  rest: { x: number; y: number; rotate: number; scale: number };
  zIndex: number;
  depth: number;
  shadow: { drop: string; contact: { w: number; h: number; dy: number; opacity: number } };
  enter: Track;
  idle: Track[];
  exit: Track;
};

export const PRODUCTS: ProductConfig[] = [
  {
    id: "tablet-strip",
    src: staticFile("products/tablet-strip.png"),
    alt: "Tablet blister strip",
    box: { w: 250, h: 170 },
    rest: { x: 672, y: 416, rotate: -14, scale: 1 },
    zIndex: 22,
    depth: DEPTH.products * 0.9,
    shadow: { drop: "drop-shadow(0 10px 12px rgba(18,44,110,0.20))", contact: { w: 200, h: 26, dy: 70, opacity: 0.35 } },
    enter: enterFromLeft({ start: T.strip.in, duration: T.strip.inDur, distance: 820, offset: 40, rotateFrom: -34, scaleFrom: 0.94, fade: 0, motion: { ease: EASE.outQuint } }),
    idle: [subtleDrift({ amplitude: 3, cycles: 2, phase: 0.3, start: T.strip.in + T.strip.inDur, ramp: T.idleRamp })],
    exit: exitTo({ start: T.strip.out, duration: T.strip.outDur, to: { x: -300, y: 330, rotate: -22 }, ease: EASE.inCubic, fadeAt: 0.7 }),
  },
  {
    id: "dolo-650",
    src: staticFile("products/dolo-650.png"),
    alt: "Dolo 650",
    box: { w: 230, h: 300 },
    rest: { x: 800, y: 286, rotate: -5, scale: 1 },
    zIndex: 40,
    depth: DEPTH.products,
    shadow: { drop: "drop-shadow(0 20px 22px rgba(18,44,110,0.26))", contact: { w: 190, h: 30, dy: 148, opacity: 0.45 } },
    enter: settleSpring({ start: T.dolo.in, duration: T.dolo.inDur, from: { x: -360, y: 250, rotate: -16, scale: 0.88 }, fade: 5, feel: SPRING.product }),
    idle: [microRotate({ amplitude: 1, cycles: 3, phase: 0, start: T.dolo.in + T.dolo.inDur, ramp: T.idleRamp })],
    exit: exitTo({ start: T.dolo.out, duration: T.dolo.outDur, to: { x: 360, y: -560, rotate: 16, scale: 0.96 }, ease: EASE.inQuart, fadeAt: 1 }),
  },
  {
    id: "cetirizine",
    src: staticFile("products/cetirizine.png"),
    alt: "Cetirizine",
    box: { w: 220, h: 290 },
    rest: { x: 990, y: 262, rotate: 4, scale: 1 },
    zIndex: 32,
    depth: DEPTH.products * 0.95,
    shadow: { drop: "drop-shadow(0 18px 20px rgba(18,44,110,0.24))", contact: { w: 180, h: 28, dy: 142, opacity: 0.42 } },
    enter: settleSpring({ start: T.cetirizine.in, duration: T.cetirizine.inDur, from: { x: 560, y: -24, rotate: 14, scale: 0.9 }, fade: 3, feel: SPRING.heavy }),
    idle: [subtleFloat({ amplitude: 4, cycles: 3, phase: 1.3, start: T.cetirizine.in + T.cetirizine.inDur, ramp: T.idleRamp })],
    exit: exitTo({ start: T.cetirizine.out, duration: T.cetirizine.outDur, to: { x: 200, y: -560, rotate: 12, scale: 0.96 }, ease: EASE.inQuart, fadeAt: 1 }),
  },
  {
    id: "vitamin-d3",
    src: staticFile("products/vitamin-d3.png"),
    alt: "Vitamin D3",
    box: { w: 190, h: 232 },
    rest: { x: 1150, y: 304, rotate: 7, scale: 1 },
    zIndex: 26,
    depth: DEPTH.products * 0.8,
    shadow: { drop: "drop-shadow(0 16px 18px rgba(18,44,110,0.22))", contact: { w: 160, h: 24, dy: 114, opacity: 0.38 } },
    enter: settleSpring({ start: T.vitaminD3.in, duration: T.vitaminD3.inDur, from: { x: 280, y: -400, rotate: 22, scale: 0.9 }, fade: 3, feel: SPRING.product }),
    idle: [breathe({ amplitude: 0.012, cycles: 4, phase: 0.8, start: T.vitaminD3.in + T.vitaminD3.inDur, ramp: T.idleRamp })],
    exit: exitTo({ start: T.vitaminD3.out, duration: T.vitaminD3.outDur, to: { x: 520, y: -70, rotate: 18 }, ease: EASE.inCubic, fadeAt: 1 }),
  },
  {
    id: "thermometer",
    src: staticFile("products/thermometer.png"),
    alt: "Digital thermometer",
    box: { w: 350, h: 92 },
    rest: { x: 1012, y: 452, rotate: -9, scale: 1 },
    zIndex: 50,
    depth: DEPTH.products * 1.1,
    shadow: { drop: "drop-shadow(0 10px 10px rgba(18,44,110,0.24))", contact: { w: 280, h: 18, dy: 40, opacity: 0.3 } },
    enter: settleSpring({ start: T.thermometer.in, duration: T.thermometer.inDur, from: { x: 420, y: 220, rotate: -26, scale: 0.94 }, fade: 3, feel: SPRING.heavy }),
    idle: [microRotate({ amplitude: 1.3, cycles: 2, phase: 2.1, start: T.thermometer.in + T.thermometer.inDur, ramp: T.idleRamp })],
    exit: exitToBottom({ start: T.thermometer.out, duration: T.thermometer.outDur, distance: 260, offset: 440, rotateTo: 10, ease: EASE.inCubic, fadeAt: 1 }),
  },
];
