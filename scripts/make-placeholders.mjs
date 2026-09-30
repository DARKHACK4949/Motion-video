// Generates NEUTRAL, clearly-labelled placeholder packshots for any product file that is missing.
// They are generic shapes (no brand names, logos or real label artwork) so the composition can be
// previewed. Existing files in public/products/ are NEVER overwritten — drop the real transparent
// packshots in with the same filenames and re-render; no code changes needed.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/products");
fs.mkdirSync(dir, { recursive: true });

const tag = (cx, cy, file, w) => `
  <rect x="${cx - w / 2}" y="${cy - 34}" width="${w}" height="68" rx="10" fill="#FFFFFF" fill-opacity="0.94"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="22" fill="#3A4A6B" letter-spacing="3">PLACEHOLDER</text>
  <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="19" fill="#6A7894">${file}</text>`;

const bottle = ({ file, w, h, glass, glassDark, cap, capDark, band }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="${glassDark}"/><stop offset="0.28" stop-color="${glass}"/><stop offset="0.55" stop-color="${glass}"/><stop offset="1" stop-color="${glassDark}"/>
    </linearGradient>
    <linearGradient id="c" x1="0" x2="1">
      <stop offset="0" stop-color="${capDark}"/><stop offset="0.35" stop-color="${cap}"/><stop offset="0.6" stop-color="${cap}"/><stop offset="1" stop-color="${capDark}"/>
    </linearGradient>
    <linearGradient id="hl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <rect x="${w * 0.17}" y="${h * 0.01}" width="${w * 0.66}" height="${h * 0.17}" rx="14" fill="url(#c)"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${w * 0.19 + i * w * 0.045}" y="${h * 0.03}" width="${w * 0.018}" height="${h * 0.13}" rx="3" fill="#000" fill-opacity="0.10"/>`).join("")}
  <rect x="${w * 0.24}" y="${h * 0.17}" width="${w * 0.52}" height="${h * 0.05}" fill="${glassDark}"/>
  <path d="M${w * 0.24} ${h * 0.21} Q${w * 0.04} ${h * 0.25} ${w * 0.04} ${h * 0.34} L${w * 0.04} ${h * 0.92} Q${w * 0.04} ${h * 0.99} ${w * 0.14} ${h * 0.99} L${w * 0.86} ${h * 0.99} Q${w * 0.96} ${h * 0.99} ${w * 0.96} ${h * 0.92} L${w * 0.96} ${h * 0.34} Q${w * 0.96} ${h * 0.25} ${w * 0.76} ${h * 0.21} Z" fill="url(#g)"/>
  <rect x="${w * 0.04}" y="${h * 0.38}" width="${w * 0.92}" height="${h * 0.46}" fill="${band}"/>
  <rect x="${w * 0.04}" y="${h * 0.38}" width="${w * 0.92}" height="${h * 0.46}" fill="url(#g)" fill-opacity="0.25"/>
  <rect x="${w * 0.2}" y="${h * 0.26}" width="${w * 0.07}" height="${h * 0.66}" rx="${w * 0.035}" fill="url(#hl)"/>
  ${tag(w / 2, h * 0.61, file, w * 0.8)}
</svg>`;

const thermometer = (file, w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#EEF2F9"/><stop offset="1" stop-color="#C5D0E4"/></linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C86FF"/><stop offset="1" stop-color="#1A45C9"/></linearGradient>
  </defs>
  <path d="M${w * 0.02} ${h * 0.5} Q${w * 0.02} ${h * 0.4} ${w * 0.08} ${h * 0.4} L${w * 0.5} ${h * 0.3} L${w * 0.9} ${h * 0.12} Q${w * 0.99} ${h * 0.1} ${w * 0.99} ${h * 0.5} Q${w * 0.99} ${h * 0.9} ${w * 0.9} ${h * 0.88} L${w * 0.5} ${h * 0.7} L${w * 0.08} ${h * 0.6} Q${w * 0.02} ${h * 0.6} ${w * 0.02} ${h * 0.5}Z" fill="url(#t)"/>
  <rect x="${w * 0.005}" y="${h * 0.44}" width="${w * 0.05}" height="${h * 0.12}" rx="${h * 0.06}" fill="#B8C2D4"/>
  <path d="M${w * 0.78} ${h * 0.17} L${w * 0.9} ${h * 0.12} Q${w * 0.99} ${h * 0.1} ${w * 0.99} ${h * 0.5} Q${w * 0.99} ${h * 0.9} ${w * 0.9} ${h * 0.88} L${w * 0.78} ${h * 0.83}Z" fill="url(#b)"/>
  <circle cx="${w * 0.88}" cy="${h * 0.5}" r="${h * 0.12}" fill="#fff" fill-opacity="0.9"/>
  <rect x="${w * 0.52}" y="${h * 0.34}" width="${w * 0.22}" height="${h * 0.32}" rx="8" fill="#9FB2C9"/>
  <text x="${w * 0.29}" y="${h * 0.47}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="${h * 0.12}" fill="#3A4A6B" letter-spacing="3">PLACEHOLDER</text>
  <text x="${w * 0.29}" y="${h * 0.6}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="${h * 0.1}" fill="#6A7894">${file}</text>
</svg>`;

const strip = (file, w, h) => {
  const cells = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 5; c++) {
      const cx = w * (0.14 + c * 0.18), cy = h * (0.27 + r * 0.46);
      cells.push(`<ellipse cx="${cx}" cy="${cy + 4}" rx="${w * 0.07}" ry="${h * 0.14}" fill="#000" fill-opacity="0.08"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${w * 0.07}" ry="${h * 0.14}" fill="url(#pill)" stroke="#D9A9B8" stroke-width="2"/>
      <ellipse cx="${cx - w * 0.02}" cy="${cy - h * 0.05}" rx="${w * 0.02}" ry="${h * 0.035}" fill="#fff" fill-opacity="0.7"/>`);
    }
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F9FC"/><stop offset="0.5" stop-color="#D5DCE8"/><stop offset="1" stop-color="#EEF2F8"/></linearGradient>
    <radialGradient id="pill" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#FFE3EC"/><stop offset="1" stop-color="#F0A9C0"/></radialGradient>
  </defs>
  <rect x="${w * 0.02}" y="${h * 0.03}" width="${w * 0.96}" height="${h * 0.94}" rx="22" fill="url(#s)" stroke="#C3CCDB" stroke-width="3"/>
  ${cells.join("")}
  <rect x="${w * 0.16}" y="${h * 0.4}" width="${w * 0.68}" height="${h * 0.2}" rx="10" fill="#FFFFFF" fill-opacity="0.95"/>
  <text x="${w / 2}" y="${h * 0.49}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="${h * 0.075}" fill="#3A4A6B" letter-spacing="3">PLACEHOLDER</text>
  <text x="${w / 2}" y="${h * 0.565}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="${h * 0.06}" fill="#6A7894">${file}</text>
</svg>`;
};

const jobs = {
  "dolo-650.png": bottle({ file: "dolo-650.png", w: 380, h: 500, glass: "#8A4A1E", glassDark: "#4A2208", cap: "#E0303F", capDark: "#9E1220", band: "#F4F1EC" }),
  "cetirizine.png": bottle({ file: "cetirizine.png", w: 360, h: 480, glass: "#FFFFFF", glassDark: "#C8D2E4", cap: "#FFFFFF", capDark: "#C4CEE0", band: "#2F6BFF" }),
  "vitamin-d3.png": bottle({ file: "vitamin-d3.png", w: 360, h: 450, glass: "#FFFFFF", glassDark: "#C8D2E4", cap: "#FFFFFF", capDark: "#C4CEE0", band: "#F5C84A" }),
  "thermometer.png": thermometer("thermometer.png", 1000, 240),
  "tablet-strip.png": strip("tablet-strip.png", 900, 600),
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
