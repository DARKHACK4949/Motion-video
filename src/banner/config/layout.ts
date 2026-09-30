/** Fixed UI positions (px on the 1280×540 canvas). Products & decor live in products.ts / decor.ts. */
export const LAYOUT = {
  /** Keep text & CTA inside this safe area (left column). */
  safe: { left: 72, top: 48, right: 1232, bottom: 492 },
  headline: { x: 72, y: 116, width: 520 },
  support: { x: 74, gap: 18 },
  cta: { x: 74, y: 388, w: 206, h: 58 },
  offer: { x: 1162, y: 96, w: 164, h: 106, rotate: -8 },
} as const;
