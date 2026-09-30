/** Fixed positions (px on the 1280×540 canvas). */
export const LAYOUT = {
  /** Keep text & CTA inside this safe area (left column). */
  safe: { left: 72, top: 48, right: 1232, bottom: 492 },
  headline: { x: 72, y: 112, width: 560 },
  support: { gap: 20 },
  cta: { x: 74, y: 382, w: 214, h: 58 },
  offer: { x: 1186, y: 98, size: 138, rotate: -12 },
  stage: { x: 962, y: 276, r: 246 },
  plinth: { x: 952, y: 456, rx: 286, ry: 40, depth: 26 },
} as const;
