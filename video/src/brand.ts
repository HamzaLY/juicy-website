import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same tokens as the website (app/globals.css), so films and site read as one world.
export const C = {
  pulp: "#FFF5EA",
  pulpDeep: "#FBE7D3",
  rind: "#0F2A1F",
  ink: "#1E140E",
  cream: "#FBF1E4",
  orange: "#FF7A1A",
  mango: "#FFC21A",
};

export const FONT_DISPLAY = "Bricolage";
export const FONT_BODY = "Instrument";
export const FONT_MONO = "DMMono";

loadFont({ family: FONT_DISPLAY, url: staticFile("fonts/bricolage.woff2"), weight: "200 800" });
loadFont({ family: FONT_BODY, url: staticFile("fonts/instrument-500.woff2"), weight: "500" });
loadFont({ family: FONT_MONO, url: staticFile("fonts/dm-mono-500.woff2"), weight: "500" });

export type Drink = { id: string; name: string; tagline: string; color: string; deep: string; from: string };

// Mirrors content/products.ts on the site (demo prices).
export const showcaseDrinks: Drink[] = [
  { id: "sunrise-press", name: "Sunrise Press", tagline: "Fresh orange, pressed to order", color: "#FF8A1F", deep: "#8A3A00", from: "$5.75" },
  { id: "melon-hour", name: "Melon Hour", tagline: "Watermelon and a squeeze of lime", color: "#FF5A5F", deep: "#8E1B22", from: "$5.75" },
  { id: "mango-monsoon", name: "Mango Monsoon", tagline: "Mango, banana and oat milk", color: "#FFC21A", deep: "#7A5200", from: "$6.75" },
  { id: "lagoon-drift", name: "Lagoon Drift", tagline: "Pineapple, coconut, blue spirulina", color: "#19C3B1", deep: "#05544C", from: "$7.20" },
  { id: "green-rush", name: "Green Rush", tagline: "Apple, cucumber, spinach, ginger", color: "#7CC243", deep: "#2F5A12", from: "$6.50" },
];

export const img = (path: string) => staticFile(`images/${path}`);
