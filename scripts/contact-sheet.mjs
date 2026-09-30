// QA: renders storyboard beats and tiles them into output/qa/contact-sheet.png for visual review.
import fs from "node:fs";
import sharp from "sharp";
import { makeRenderer } from "./qa-lib.mjs";

const out = "output/qa";
fs.mkdirSync(`${out}/beats`, { recursive: true });
const frames = (process.argv[2] ?? "0,15,24,36,44,52,60,68,76,90,108,114,125,136,142,148,154,160,168,179").split(",").map(Number);
const render = await makeRenderer("HealthcareBanner");

const W = 640, H = 270, COLS = 4;
const tiles = [];
for (const f of frames) {
  const file = await render(f, `${out}/beats/f${String(f).padStart(3, "0")}.png`);
  const label = Buffer.from(`<svg width="${W}" height="${H}"><rect x="6" y="6" width="150" height="30" rx="6" fill="rgba(10,30,74,0.85)"/><text x="16" y="28" font-family="DejaVu Sans Mono" font-size="17" fill="#fff">f${f} ${(f / 30).toFixed(2)}s</text></svg>`);
  tiles.push(await sharp(file).resize(W, H).composite([{ input: label }]).png().toBuffer());
}
const rows = Math.ceil(tiles.length / COLS);
await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: "#ffffff" } })
  .composite(tiles.map((input, i) => ({ input, left: (i % COLS) * W, top: Math.floor(i / COLS) * H })))
  .png()
  .toFile(`${out}/contact-sheet.png`);
console.log(`wrote ${out}/contact-sheet.png`);
