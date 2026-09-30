import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

export const COLORS = {
  bgTop: "#F7FAFF",
  bgBottom: "#D4E4FD",
  atmosphereBlue: "rgba(92, 150, 255, 0.30)",
  atmosphereCyan: "rgba(120, 214, 255, 0.28)",
  atmosphereWhite: "rgba(255, 255, 255, 0.85)",
  wave1: "rgba(255, 255, 255, 0.70)",
  wave2: "rgba(214, 229, 255, 0.75)",
  cross: "#FFFFFF",
  crossTint: "#B9D0FF",

  ink: "#0A1E4A",
  inkSoft: "#3B4B6E",
  brand: "#1F5BFF",
  brandLight: "#4C8DFF",

  capsuleRed: "#E23A4E",
  capsuleBlue: "#2563EB",
  capsuleWhite: "#F8FAFF",
  leafLight: "#7BD37A",
  leafDark: "#2E9E4F",

  offerFrom: "#FF3D6E",
  offerTo: "#E0165A",
  ctaFrom: "#2E6BFF",
  ctaTo: "#1846D6",

  productShadow: "rgba(18, 44, 110, 0.28)",
} as const;

export const TYPE = {
  family: "'Plus Jakarta Sans', 'Liberation Sans', Arial, sans-serif",
  headline: { size: 70, weight: 800, lineHeight: 1.02, tracking: -2.2 },
  support: { size: 21, weight: 500, lineHeight: 1.38, tracking: -0.1 },
  cta: { size: 20, weight: 700, tracking: -0.2 },
  offerSmall: { size: 19, weight: 800, tracking: 1.5 },
  offerBig: { size: 40, weight: 800, tracking: -1.2 },
} as const;

/** Editable copy. */
export const COPY = {
  headline: ["Healthcare.", "Delivered."],
  support: ["Medicines & medical essentials,", "when you need them."],
  cta: "Order Now",
  offer: { top: "FLAT", value: "20%", suffix: "OFF" },
} as const;
