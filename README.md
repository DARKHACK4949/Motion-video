# Healthcare. Delivered. — Motion Banner

A deterministic motion-graphics banner for a medical quick-commerce app, built with **React + Remotion + TypeScript**.

| Spec | Value |
| --- | --- |
| Canvas | 1280 × 540 |
| Frame rate | 30 fps |
| Duration | 6 s / 180 frames, seamless loop (frame 180 ≡ frame 0) |
| Outputs | `output/healthcare-banner.mp4` (H.264, yuv420p) · `output/healthcare-banner.webm` (VP9) |

## Creative concept

The products are the hero, and they are **grounded**. A brand-blue stage disc pops in with a ripple
and a 3D plinth rises under it. Products are thrown or dropped onto the plinth with real weight: a
gravity fall, one small rebound, dust puffs, a contact shadow that tightens on touchdown, and a stage
pulse on every impact. The headline lands like a quick-commerce banner: "Healthcare." rises out of a
mask, then a highlight bar wipes in and "Delivered." punches up inside it. Capsules burst out of the
stage into orbit and sparkles twinkle. The offer is a
sticker seal (0.8 → 1.05 → 1) and the CTA gets one shine sweep. The exit is an anticipation wave:
each product dips, then whips out with speed streaks and motion trails. The stage then collapses with
a ripple back to the clean opening frame.

## Product assets

Drop the real transparent packshots into `public/products/` using these exact names:

```
dolo-650.png  cetirizine.png  vitamin-d3.png  thermometer.png  tablet-strip.png
```

The supplied originals are kept in `assets-source/`. `npm run assets` (scripts/prepare-assets.mjs)
exports them to `public/products/`. It only trims the fully transparent padding and applies a uniform,
aspect-locked downscale to 900 px max. The artwork itself is untouched. To replace a product, drop the
new file into `assets-source/` with the same name, run `npm run assets`, and adjust `box`/`rest` in
`src/banner/config/products.ts` if its shape differs a lot.
(`npm run placeholders` can still generate labelled stand-ins for any missing file.)

Packshots are drawn with `object-fit: contain` inside a layout box, so any aspect ratio is preserved.
Only **position, rotation, uniform scale and opacity** animate. The artwork is never redrawn or distorted.

## Commands

```bash
npm install
npm run studio          # live preview / scrubbing
npm run render          # → output/healthcare-banner.mp4 + .webm
npm run verify:loop     # renders frames 0,1,178,179,180 and checks the loop seam
node scripts/contact-sheet.mjs   # storyboard-beat contact sheet → output/qa/contact-sheet.png
```

If Remotion can't download its own headless Chrome, point it at a local one:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render`.

## Architecture

```
src/banner/
  HealthcareBanner.tsx      layer stack (background → foreground)
  config/
    canvas.ts               size, fps, duration, sec()
    timeline.ts             ALL timings (storyboard beats) in frames
    products.ts             per-product src, box, rest pose, depth, z, enter/idle/exit motion
    decor.ts                capsules, pills, leaves, crosses (layer, depth, blur, motion)
    layout.ts               text / CTA / offer positions + safe area
    theme.ts                colours, typography, editable COPY
  motion/
    pose.ts                 Pose / Track primitives (pure functions of frame)
    easing.ts               named cubic-beziers + analytic spring (sub-frame sampleable)
    presets.ts              enterFromLeft/Right/Top/Bottom, settleSpring, softPop, exitTo*, dropIn, arcIn,
                            anticipateExit, burstFrom, growIn, shrinkOut,
                            subtleFloat, microRotate, subtleDrift, breathe, ambientFloat, flyThrough
    loop.ts                 loopSin — integer cycles only, guarantees seamless ambient motion
    parallax.ts             depth layers + loop-safe camera drift
  components/
    Background, Stage (disc, rings, plinth, ripples, streaks, sparkles), MedicalDecor,
    Product (+ floor shadow, landing dust), ProductGroup, Headline, OfferBadge, CTA,
    Animated (pose renderer + velocity-based motion trail), shapes/
```

### Loop guarantee

* Everything that is on screen at frame 0 (background, waves, ambient decor) uses `loopSin` with integer
  cycles per 180 frames, so both position **and velocity** match at the wrap.
* Story elements (products, text, badge, CTA, entering decor) are fully off-canvas or at 0 opacity
  before 0.5 s and after 5.5 s.
* `npm run verify:loop` confirms frame 180 is pixel-identical to frame 0 and that the 179→0 step
  shows no velocity spike.

### Motion blur

`Animated` samples the pose at sub-frame times and draws a few faint trailing copies only while an
object moves faster than a threshold. This gives directional blur on fast entrances and exits without
the cost of full multi-sample rendering.
