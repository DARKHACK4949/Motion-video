import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { TYPE } from "./config/theme";
import { Background } from "./components/Background";
import { CTA } from "./components/CTA";
import { Headline } from "./components/Headline";
import { MedicalDecor } from "./components/MedicalDecor";
import { OfferBadge } from "./components/OfferBadge";
import { ProductGroup } from "./components/ProductGroup";
import { Stage } from "./components/Stage";

const useFonts = () => {
  const [handle] = useState(() => delayRender("Loading Plus Jakarta Sans"));
  useEffect(() => {
    Promise.all([500, 600, 700, 800].map((w) => document.fonts.load(`${w} 20px "Plus Jakarta Sans"`)))
      .catch(() => undefined)
      .finally(() => continueRender(handle));
  }, [handle]);
};

/**
 * Layer order (back → front):
 *  1 Background (gradient, atmosphere, waves)   z 0
 *  2 MedicalDecor back / mid                     z 2–5
 *  3 Stage (disc, rings, plinth, sparkles)       z 10
 *    Story decor behind products                 z 15
 *  4 Product packshots                           z 20–50
 *  5 Story decor in front of products            z 60
 *  6 Headline + supporting copy                  z 70
 *  7 Offer badge                                 z 75
 *  8 CTA                                         z 80
 *  9 Foreground decor                            z 90
 */
export const HealthcareBanner: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TYPE.family, WebkitFontSmoothing: "antialiased" }}>
      <Background />
      <MedicalDecor layer="back" />
      <MedicalDecor layer="mid" />
      <Stage />
      <MedicalDecor layer="storyBack" />
      <ProductGroup />
      <MedicalDecor layer="storyFront" />
      <Headline />
      <OfferBadge />
      <CTA />
      <MedicalDecor layer="front" />
    </AbsoluteFill>
  );
};
