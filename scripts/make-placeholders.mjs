// Generates NEUTRAL, clearly-labelled placeholder packshots for any product file that is missing.
// Real packshots in public/products/ are never overwritten. Replace placeholders with the real
// transparent PNGs (same filenames) and re-render — no code changes needed.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/products");
fs.mkdirSync(dir, { recursive: true });

const label = (cx, cy, file, color = "#5B6B8C") => `
  <text x="${cx}" y="${cy - 14}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="40" fill="${color}" letter-spacing="3">PLACEHOLDER</text>
  <text x="${cx}" y="${cy + 34}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="30" fill="${color}">${file}</text>`;

const bottle = (file, w, h, cap) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#E4E9F2"/><stop offset="0.35" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9D2E2"/></linearGradient>
    <linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="${cap}" stop-opacity="0.75"/><stop offset="0.4" stop-color="${cap}"/><stop offset="1" stop-color="${cap}" stop-opacity="0.8"/></linearGradient>
  </defs>
  <rect x="${w * 0.2}" y="${h * 0.02}" width="${w * 0.6}" height="${h * 0.16}" rx="18" fill="url(#c)"/>
  <rect x="${w * 0.26}" y="${h * 0.16}" width="${w * 0.48}" height="${h * 0.06}" fill="#D8DFEB"/>
  <rect x="${w * 0.06}" y="${h * 0.2}" width="${w * 0.88}" height="${h * 0.78}" rx="${w * 0.12}" fill="url(#b)"/>
  <rect x="${w * 0.1}" y="${h * 0.36}" width="${w * 0.8}" height="${h * 0.42}" rx="14" fill="none" stroke="#9AA8C2" stroke-width="5" stroke-dasharray="18 12"/>
  ${label(w / 2, h * 0.57, file)}
</svg>`;

const thermometer = (file, w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CDD6E6"/></linearGradient></defs>
  <rect x="${w * 0.02}" y="${h * 0.3}" width="${w * 0.96}" height="${h * 0.4}" rx="${h * 0.2}" fill="url(#t)"/>
  <rect x="${w * 0.62}" y="${h * 0.12}" width="${w * 0.34}" height="${h * 0.76}" rx="${h * 0.3}" fill="#A9B6CE"/>
  <rect x="${w * 0.08}" y="${h * 0.34}" width="${w * 0.5}" height="${h * 0.32}" rx="10" fill="none" stroke="#9AA8C2" stroke-width="4" stroke-dasharray="14 10"/>
  <text x="${w * 0.33}" y="${h * 0.47}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="30" fill="#5B6B8C" letter-spacing="3">PLACEHOLDER</text>
  <text x="${w * 0.33}" y="${h * 0.62}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="26" fill="#5B6B8C">${file}</text>
</svg>`;

const strip = (file, w, h) => {
  const cells = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 4; c++)
      cells.push(`<circle cx="${w * (0.2 + c * 0.2)}" cy="${h * (0.3 + r * 0.4)}" r="${h * 0.13}" fill="#EEF2F8" stroke="#B7C2D6" stroke-width="4"/>`);
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6FA"/><stop offset="1" stop-color="#C6CFDE"/></linearGradient></defs>
  <rect x="${w * 0.03}" y="${h * 0.04}" width="${w * 0.94}" height="${h * 0.92}" rx="26" fill="url(#s)"/>
  ${cells.join("")}
  <rect x="${w * 0.12}" y="${h * 0.38}" width="${w * 0.76}" height="${h * 0.24}" rx="12" fill="#FFFFFF" fill-opacity="0.92"/>
  <text x="${w / 2}" y="${h * 0.49}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="34" fill="#5B6B8C" letter-spacing="3">PLACEHOLDER</text>
  <text x="${w / 2}" y="${h * 0.58}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="26" fill="#5B6B8C">${file}</text>
</svg>`;
};

const jobs = {
  "dolo-650.png": bottle("dolo-650.png", 520, 700, "#8A9BB8"),
  "cetirizine.png": bottle("cetirizine.png", 500, 700, "#7F9FC4"),
  "vitamin-d3.png": bottle("vitamin-d3.png", 520, 640, "#9CA9BE"),
  "thermometer.png": thermometer("thermometer.png", 1200, 300),
  "tablet-strip.png": strip("tablet-strip.png", 880, 580),
};

for (const [file, svg] of Object.entries(jobs)) {
  const out = path.join(dir, file);
  if (fs.existsSync(out)) {
    console.log(`keep   ${file} (already present — never overwritten)`);
    continue;
  }
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`create ${file} (placeholder)`);
}
