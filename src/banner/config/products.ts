import { staticFile } from "remotion";
import { EASE } from "../motion/easing";
import { DEPTH } from "../motion/parallax";
import { Track } from "../motion/pose";
import { anticipateExit, arcIn, breathe, dropIn, enterFrom, microRotate, subtleDrift } from "../motion/presets";
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
  /** Resting pose on the plinth (centre point, degrees, scale). */
  rest: { x: number; y: number; rotate: number; scale: number };
  /** Rotate/scale pivot. Standing products pivot on their base so idle motion stays grounded. */
  origin: string;
  zIndex: number;
  depth: number;
  /**
   * Grounding shadows (relative to the resting centre):
   *  - contact ellipse `w`×`h` at `dy` (where the product touches the plinth)
   *  - `cast`: a silhouette of the packshot projected onto the plinth, away from the key light
   *    ("standing" = squashed + skewed behind the product, "lying" = offset beneath it)
   */
  shadow: { w: number; h: number; dy: number; opacity: number; cast: "standing" | "lying" };
  drop: string;
  /** Frame of touchdown on the plinth (drives dust + stage pulse). */
  land?: number;
  enter: Track;
  idle: Track[];
  exit: Track;
};

/** Tight edge shadow only — the grounding comes from the contact + cast shadows. */
const DROP = "drop-shadow(0 2px 3px rgba(10,30,90,0.28))";
const BASE = "50% 100%";

export const PRODUCTS: ProductConfig[] = [
  {
    id: "vitamin-d3",
    src: staticFile("products/vitamin-d3.png"),
    alt: "Vitamin D3",
    box: { w: 222, h: 256 },
    rest: { x: 1146, y: 308, rotate: 0, scale: 1 },
    origin: BASE,
    zIndex: 20,
    depth: DEPTH.products,
    shadow: { w: 196, h: 16, dy: 126, opacity: 0.7, cast: "standing" },
    drop: DROP,
    land: T.vitaminD3.in + T.vitaminD3.fall,
    enter: dropIn({ start: T.vitaminD3.in, fall: T.vitaminD3.fall, from: { x: 30, y: -420, rotate: 10 }, bounce: 5 }),
    idle: [breathe({ amplitude: 0.01, cycles: 4, phase: 0.8, start: T.vitaminD3.in + T.vitaminD3.fall + 10, ramp: T.idleRamp })],
    exit: anticipateExit({ start: T.vitaminD3.out, duration: T.vitaminD3.outDur, counter: { x: -6, y: 5 }, to: { x: 480, y: -40, rotate: 20 } }),
  },
  {
    id: "cetirizine",
    src: staticFile("products/cetirizine.png"),
    alt: "Cetirizine",
    box: { w: 200, h: 254 },
    rest: { x: 900, y: 305, rotate: 0, scale: 1 },
    origin: BASE,
    zIndex: 22,
    depth: DEPTH.products,
    shadow: { w: 184, h: 16, dy: 125, opacity: 0.7, cast: "standing" },
    drop: DROP,
    land: T.cetirizine.in + T.cetirizine.fall,
    enter: dropIn({ start: T.cetirizine.in, fall: T.cetirizine.fall, from: { x: 300, y: -440, rotate: 14, scale: 0.9 }, bounce: 6 }),
    idle: [microRotate({ amplitude: 0.7, cycles: 3, phase: 1.9, start: T.cetirizine.in + T.cetirizine.fall + 10, ramp: T.idleRamp })],
    exit: anticipateExit({ start: T.cetirizine.out, duration: T.cetirizine.outDur, counter: { y: 7 }, to: { x: 160, y: -560, rotate: 10 } }),
  },
  {
    id: "dolo-650",
    src: staticFile("products/dolo-650.png"),
    alt: "Dolo 650",
    box: { w: 300, h: 185 },
    rest: { x: 950, y: 414, rotate: 0, scale: 1 },
    origin: BASE,
    zIndex: 34,
    depth: DEPTH.products,
    shadow: { w: 270, h: 16, dy: 90, opacity: 0.7, cast: "standing" },
    drop: DROP,
    land: T.dolo.in + T.dolo.fall,
    enter: dropIn({ start: T.dolo.in, fall: T.dolo.fall, from: { x: -300, y: -460, rotate: -16, scale: 0.88 }, bounce: 8 }),
    idle: [microRotate({ amplitude: 1, cycles: 3, phase: 0, start: T.dolo.in + T.dolo.fall + 10, ramp: T.idleRamp })],
    exit: anticipateExit({ start: T.dolo.out, duration: T.dolo.outDur, counter: { x: -4, y: 8, rotate: -2 }, to: { x: 380, y: -580, rotate: 16 } }),
  },
  {
    id: "tablet-strip",
    src: staticFile("products/tablet-strip.png"),
    alt: "Tablet blister strip",
    box: { w: 216, h: 137 },
    rest: { x: 728, y: 464, rotate: -6, scale: 1 },
    origin: "50% 50%",
    zIndex: 30,
    depth: DEPTH.products,
    shadow: { w: 196, h: 16, dy: 60, opacity: 0.5, cast: "lying" },
    drop: DROP,
    enter: arcIn({ start: T.strip.in, duration: T.strip.inDur, from: { x: -900, y: 40, rotate: -200, scale: 0.9 }, lift: 160 }),
    idle: [subtleDrift({ amplitude: 2.5, cycles: 2, phase: 0.3, start: T.strip.in + T.strip.inDur, ramp: T.idleRamp })],
    exit: anticipateExit({ start: T.strip.out, duration: T.strip.outDur, counter: { x: 8, y: -4 }, to: { x: -360, y: 260, rotate: -40 }, ease: EASE.inCubic }),
  },
  {
    id: "thermometer",
    src: staticFile("products/thermometer.png"),
    alt: "Digital thermometer",
    box: { w: 262, h: 115 },
    rest: { x: 1128, y: 488, rotate: 14, scale: 1 },
    origin: "50% 50%",
    zIndex: 40,
    depth: DEPTH.products,
    shadow: { w: 220, h: 12, dy: 34, opacity: 0.45, cast: "lying" },
    drop: DROP,
    enter: enterFrom({ start: T.thermometer.in, duration: T.thermometer.inDur, from: { x: 520, y: 30, rotate: -24 }, motion: { ease: EASE.outQuint }, fade: 0 }),
    idle: [microRotate({ amplitude: 1.2, cycles: 2, phase: 2.1, start: T.thermometer.in + T.thermometer.inDur, ramp: T.idleRamp })],
    exit: anticipateExit({ start: T.thermometer.out, duration: T.thermometer.outDur, counter: { x: -10 }, to: { x: 460, y: 180, rotate: 12 }, ease: EASE.inCubic }),
  },
];
