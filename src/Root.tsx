import React from "react";
import { Composition } from "remotion";
import { HealthcareBanner } from "./banner/HealthcareBanner";
import { CANVAS } from "./banner/config/canvas";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HealthcareBanner"
      component={HealthcareBanner}
      width={CANVAS.width}
      height={CANVAS.height}
      fps={CANVAS.fps}
      durationInFrames={CANVAS.durationInFrames}
    />
    {/* QA only: one extra frame so frame 180 (the loop point) can be rendered and compared to frame 0. */}
    <Composition
      id="HealthcareBannerLoopCheck"
      component={HealthcareBanner}
      width={CANVAS.width}
      height={CANVAS.height}
      fps={CANVAS.fps}
      durationInFrames={CANVAS.durationInFrames + 1}
    />
  </>
);
