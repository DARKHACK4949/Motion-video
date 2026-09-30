// Prepares supplied packshots for the banner WITHOUT altering the artwork:
//  - trims fully transparent padding (so layout boxes hug the product)
//  - uniform downscale to a sensible max size (aspect ratio locked)
//  - lossless PNG output
// Source files live in assets-source/<name>.(png|webp); output goes to public/products/<name>.png
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets-source");
const OUT = path.resolve("public/products");
const MAX = 900;
fs.mkdirSync(OUT, { recursive: true });

for (const file of fs.readdirSync(SRC)) {
  const name = path.parse(file).name;
  const trimmed = await sharp(path.join(SRC, file)).ensureAlpha().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  const scale = Math.min(1, MAX / Math.max(width, height));
  const out = path.join(OUT, `${name}.png`);
  await sharp(trimmed.data)
    .resize({ width: Math.round(width * scale), height: Math.round(height * scale), fit: "inside", kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log(`${name}.png  ${m.width}x${m.height}  aspect ${(m.width / m.height).toFixed(3)}`);
}
