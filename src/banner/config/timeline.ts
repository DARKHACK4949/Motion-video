import { sec } from "./canvas";

/**
 * Master timeline (frames @ 30 fps). Every animation reads its timing from here.
 * Beats follow the storyboard: 0.0 open · 0.5 elements · 1.0 headline · 1.6 heroes ·
 * 2.2 supporting products · 2.8 hero · 3.5 offer/CTA · 4.0 idle · 4.5 exit · 5.0 clear · 5.5 reset.
 */
export const T = {
  // 0.50–1.00 first medical elements
  strip: { in: sec(0.5), inDur: 20, out: sec(4.72), outDur: 17 },
  introCapsules: { in: sec(0.55), stagger: 4 },

  // 1.00–1.60 headline
  headline: { in: sec(1.0), lineStagger: 4, inDur: 18, out: sec(5.0), outStagger: 3, outDur: 14 },
  support: { in: sec(1.0) + 9, inDur: 18, out: sec(4.95), outDur: 13 },

  // 1.60–2.20 hero products
  dolo: { in: sec(1.6), inDur: 22, out: sec(4.5), outDur: 16 },
  cetirizine: { in: sec(1.6) + 5, inDur: 22, out: sec(4.5) + 3, outDur: 16 },

  // 2.20–2.80 supporting products
  vitaminD3: { in: sec(2.2), inDur: 20, out: sec(4.5) + 6, outDur: 16 },
  thermometer: { in: sec(2.2) + 5, inDur: 20, out: sec(4.5) + 8, outDur: 17 },
  heroDecor: { in: sec(2.2), stagger: 3, out: sec(4.5), outStagger: 2 },

  // 3.50–4.00 offer + CTA
  offer: { in: sec(3.5), inDur: 14, sheen: sec(3.5) + 16, out: sec(4.9), outDur: 10 },
  cta: { in: sec(3.5) + 5, inDur: 16, nudge: sec(3.5) + 22, out: sec(4.95), outDur: 13 },

  // Idle micro-motion ramps in after each object settles
  idleRamp: 14,
} as const;
