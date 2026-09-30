import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

export const browserExecutable = process.env.REMOTION_BROWSER ?? null;

export async function makeRenderer(compositionId) {
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
  const composition = await selectComposition({ serveUrl, id: compositionId, browserExecutable });
  return async (frame, output) => {
    await renderStill({ serveUrl, composition, frame, output, imageFormat: "png", overwrite: true, browserExecutable });
    return output;
  };
}
