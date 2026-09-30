/**
 * Master timeline (frames @ 30 fps). Every animation reads its timing from here.
 *
 *  0.00  clean opening (ambient only)
 *  0.10  STAGE pops in + ripple ring
 *  0.50  tablet strip is thrown in · capsules burst out of the stage
 *  1.00  headline: "Healthcare." rises · highlight bar wipes · "Delivered." punches in
 *  1.60  Dolo 650 + Cetirizine drop onto the plinth (thud · dust · stage pulse)
 *  2.20  Vitamin D3 drops in the back · thermometer slides in · leaves pop from behind
 *  2.80  hero hold — sparkles, ring rotation
 *  3.50  offer seal pops (0.8 → 1.05 → 1) · CTA rises, one shine sweep
 *  4.00  micro-motion idle
 *  4.50  exit wave with anticipation · speed streaks
 *  5.00  text/CTA/badge leave · stage collapses with ripple
 *  5.50  clean reset → identical to frame 0
 */
export const T = {
  stage: { in: 3, inDur: 18, ripple: 5, out: 152, outDur: 12, rippleOut: 158 },
  streaksIn: 4,

  strip: { in: 15, inDur: 20, out: 140, outDur: 13 },
  capsules: { in: 18, stagger: 3, dur: 20, out: 141, outStagger: 2, outDur: 14 },

  headline: { in: 30, lineStagger: 7, inDur: 18, out: 145, outStagger: 3, outDur: 10 },
  highlight: { in: 36, inDur: 14, out: 157, outDur: 10 },
  support: { in: 47, inDur: 16, out: 146, outDur: 12 },

  dolo: { in: 48, fall: 13, out: 136, outDur: 12 },
  cetirizine: { in: 53, fall: 13, out: 138, outDur: 12 },
  vitaminD3: { in: 66, fall: 12, out: 134, outDur: 12 },
  thermometer: { in: 70, inDur: 18, out: 139, outDur: 12 },

  leaves: { in: 78, stagger: 4, dur: 16, out: 136, outDur: 10 },
  sparkles: [92, 101, 112, 124, 131],

  offer: { in: 105, inDur: 14, out: 146, outDur: 10 },
  cta: { in: 110, inDur: 16, shine: 128, nudge: 130, out: 148, outDur: 12 },

  exitStreaks: 140,
  idleRamp: 14,
} as const;
