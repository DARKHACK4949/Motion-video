// QA: renders frame 0 and frame 180 (loop point, via the 181-frame HealthcareBannerLoopCheck composition)
// plus frames 1 and 179, and checks the loop is seamless in position AND velocity.
import fs from "node:fs";
import sharp from "sharp";
import { makeRenderer } from "./qa-lib.mjs";

const out = "output/qa";
fs.mkdirSync(out, { recursive: true });
const render = await makeRenderer("HealthcareBannerLoopCheck");

const frames = [0, 1, 178, 179, 180];
const files = {};
for (const f of frames) files[f] = await render(f, `${out}/frame-${String(f).padStart(3, "0")}.png`);

const raw = async (file) => (await sharp(file).removeAlpha().raw().toBuffer());
const diff = async (a, b) => {
  const [A, B] = await Promise.all([raw(a), raw(b)]);
  let max = 0, sum = 0;
  for (let i = 0; i < A.length; i++) {
    const d = Math.abs(A[i] - B[i]);
    sum += d;
    if (d > max) max = d;
  }
  return { mean: sum / A.length, max };
};

const d0 = await diff(files[0], files[180]);
const step0 = await diff(files[0], files[1]);
const stepEnd = await diff(files[179], files[180]);
const stepPrev = await diff(files[178], files[179]);

console.log(`frame 0 vs frame 180   mean |Δ| = ${d0.mean.toFixed(4)}  max = ${d0.max}`);
console.log(`per-frame change 178→179 = ${stepPrev.mean.toFixed(4)}, 179→180(=0) = ${stepEnd.mean.toFixed(4)}, 0→1 = ${step0.mean.toFixed(4)}`);

const identical = d0.max <= 2;
// A seamless loop has no spike at the wrap: the 179→0 step should be similar to its neighbours.
const neighbours = (stepPrev.mean + step0.mean) / 2;
const smooth = stepEnd.mean <= neighbours * 1.5 + 0.05;
console.log(identical ? "PASS frame 180 matches frame 0" : "FAIL frame 180 differs from frame 0");
console.log(smooth ? "PASS no velocity spike at the loop point" : "FAIL velocity spike at the loop point");
process.exit(identical && smooth ? 0 : 1);
