// The whole menu lives here. Edit names, prices, colors and copy in this one file.
// Prices are demonstration values for a fictional brand.

export type CategoryId = "fresh-juices" | "smoothies" | "tropical" | "refreshers" | "seasonal";

/** Drives which customization options apply (see content/options.ts). */
export type DrinkKind = "pressed" | "smoothie" | "refresher";

export type FlavorProfile = {
  /** 1 to 5 */
  sweet: number;
  tart: number;
  fresh: number;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  kind: DrinkKind;
  tagline: string;
  description: string;
  ingredients: string[];
  /** Price of a Regular (16 oz) drink in US dollars. */
  basePrice: number;
  /** The drink's own color. Every surface that shows this drink is tinted from it. */
  color: string;
  /** A deeper shade of the same hue, used for text on tinted surfaces. */
  deep: string;
  flavor: FlavorProfile;
  badges?: ("signature" | "new" | "limited" | "favorite")[];
  /** Path under /public. Leave undefined to show the illustrated glass instead. */
  image?: string;
  imageAlt?: string;
};

export const categories: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "fresh-juices", label: "Fresh Juices", blurb: "Pressed when you order. Nothing added." },
  { id: "smoothies", label: "Smoothies", blurb: "Blended thick with whole fruit." },
  { id: "tropical", label: "Tropical Blends", blurb: "Big fruit, bright color, sunshine energy." },
  { id: "refreshers", label: "Refreshers", blurb: "Light, cold and made for thirst." },
  { id: "seasonal", label: "Seasonal Specials", blurb: "Here for a short run, then gone." },
];

const menu: Product[] = [
  {
    id: "sunrise-press",
    name: "Sunrise Press",
    category: "fresh-juices",
    kind: "pressed",
    tagline: "Fresh orange, pressed to order",
    description: "Whole oranges pressed the moment you order. Bright, sweet and a little sharp, like the first sip of morning.",
    ingredients: ["Orange"],
    basePrice: 6.5,
    color: "#FF8A1F",
    deep: "#8A3A00",
    flavor: { sweet: 4, tart: 2, fresh: 4 },
    badges: ["signature", "favorite"],
  },
  {
    id: "melon-hour",
    name: "Melon Hour",
    category: "fresh-juices",
    kind: "pressed",
    tagline: "Watermelon and a squeeze of lime",
    description: "Cold-pressed watermelon with fresh lime. Light, pink and gone in about four sips.",
    ingredients: ["Watermelon", "Lime"],
    basePrice: 6.5,
    color: "#FF5A5F",
    deep: "#8E1B22",
    flavor: { sweet: 3, tart: 2, fresh: 5 },
    badges: ["signature"],
  },
  {
    id: "green-rush",
    name: "Green Rush",
    category: "fresh-juices",
    kind: "pressed",
    tagline: "Green apple, cucumber, spinach, lime, ginger",
    description: "Crisp green apple up front, cool cucumber in the middle and a ginger kick at the end.",
    ingredients: ["Green apple", "Cucumber", "Spinach", "Lime", "Ginger"],
    basePrice: 7.25,
    color: "#7CC243",
    deep: "#2F5A12",
    flavor: { sweet: 2, tart: 3, fresh: 5 },
    badges: ["favorite"],
  },
  {
    id: "carrot-gold",
    name: "Carrot Gold",
    category: "fresh-juices",
    kind: "pressed",
    tagline: "Carrot, orange and fresh ginger",
    description: "Sweet carrot and orange, warmed up with fresh ginger. Smooth, golden and very easy to like.",
    ingredients: ["Carrot", "Orange", "Ginger"],
    basePrice: 6.75,
    color: "#FF9F1C",
    deep: "#8A4A00",
    flavor: { sweet: 3, tart: 1, fresh: 3 },
  },
  {
    id: "mango-monsoon",
    name: "Mango Monsoon",
    category: "smoothies",
    kind: "smoothie",
    tagline: "Mango, banana and oat milk",
    description: "Ripe mango and banana blended thick with oat milk. Sunny, creamy and spoon-thick at the bottom.",
    ingredients: ["Mango", "Banana", "Oat milk"],
    basePrice: 7.5,
    color: "#FFC21A",
    deep: "#7A5200",
    flavor: { sweet: 4, tart: 1, fresh: 3 },
    badges: ["signature", "favorite"],
  },
  {
    id: "berry-banana-bloom",
    name: "Berry Banana Bloom",
    category: "smoothies",
    kind: "smoothie",
    tagline: "Strawberry, banana and a little apple",
    description: "The classic, done properly: a big handful of strawberries, ripe banana and fresh apple juice.",
    ingredients: ["Strawberry", "Banana", "Apple"],
    basePrice: 7.5,
    color: "#E8414F",
    deep: "#7E1420",
    flavor: { sweet: 4, tart: 2, fresh: 3 },
    badges: ["signature"],
  },
  {
    id: "lagoon-drift",
    name: "Lagoon Drift",
    category: "smoothies",
    kind: "smoothie",
    tagline: "Pineapple, coconut, banana, blue spirulina",
    description: "Pineapple and coconut blended with banana. The ocean color comes from blue spirulina.",
    ingredients: ["Pineapple", "Coconut milk", "Banana", "Blue spirulina"],
    basePrice: 7.95,
    color: "#19C3B1",
    deep: "#05544C",
    flavor: { sweet: 3, tart: 1, fresh: 4 },
    badges: ["new"],
  },
  {
    id: "passion-pine",
    name: "Passion Pine",
    category: "tropical",
    kind: "pressed",
    tagline: "Pineapple and passionfruit",
    description: "Fresh pineapple with tangy passionfruit seeds swirled through. Sweet, sharp and loud in the best way.",
    ingredients: ["Pineapple", "Passionfruit"],
    basePrice: 7.25,
    color: "#F9B934",
    deep: "#6E4A00",
    flavor: { sweet: 4, tart: 4, fresh: 4 },
    badges: ["signature"],
  },
  {
    id: "guava-wave",
    name: "Guava Wave",
    category: "tropical",
    kind: "pressed",
    tagline: "Pink guava, pineapple and lime",
    description: "Floral pink guava with pineapple and lime. Tastes like a holiday you didn't have to book.",
    ingredients: ["Pink guava", "Pineapple", "Lime"],
    basePrice: 7.25,
    color: "#FF7A8A",
    deep: "#8A1F33",
    flavor: { sweet: 4, tart: 2, fresh: 4 },
  },
  {
    id: "tropic-parade",
    name: "Tropic Parade",
    category: "tropical",
    kind: "pressed",
    tagline: "Mango, pineapple, orange, passionfruit",
    description: "Four tropical fruits in one glass. Our busiest blend on a hot afternoon.",
    ingredients: ["Mango", "Pineapple", "Orange", "Passionfruit"],
    basePrice: 7.5,
    color: "#FFA62B",
    deep: "#7F4500",
    flavor: { sweet: 5, tart: 2, fresh: 4 },
    badges: ["favorite"],
  },
  {
    id: "mint-condition",
    name: "Mint Condition",
    category: "refreshers",
    kind: "refresher",
    tagline: "Fresh lemon, mint and sparkling water",
    description: "Hand-squeezed lemon, torn mint and cold sparkling water. Sweeten it a little, a lot or not at all.",
    ingredients: ["Lemon", "Mint", "Sparkling water"],
    basePrice: 5.75,
    color: "#D9EE6A",
    deep: "#4D5A00",
    flavor: { sweet: 2, tart: 4, fresh: 5 },
    badges: ["signature"],
  },
  {
    id: "cucumber-cooler",
    name: "Cucumber Cooler",
    category: "refreshers",
    kind: "refresher",
    tagline: "Cucumber, lime and mint",
    description: "Pressed cucumber with lime and mint over ice. The coldest-tasting thing on the menu.",
    ingredients: ["Cucumber", "Lime", "Mint"],
    basePrice: 5.75,
    color: "#A8DB8A",
    deep: "#2E5B1E",
    flavor: { sweet: 1, tart: 3, fresh: 5 },
  },
  {
    id: "hibiscus-hush",
    name: "Hibiscus Hush",
    category: "refreshers",
    kind: "refresher",
    tagline: "Hibiscus, raspberry and lemon",
    description: "Chilled hibiscus tea shaken with raspberry and lemon. Deep magenta, gently tart.",
    ingredients: ["Hibiscus tea", "Raspberry", "Lemon"],
    basePrice: 5.95,
    color: "#C2185B",
    deep: "#5E0A2A",
    flavor: { sweet: 2, tart: 4, fresh: 4 },
    badges: ["new"],
  },
  {
    id: "blood-orange-ember",
    name: "Blood Orange Ember",
    category: "seasonal",
    kind: "pressed",
    tagline: "Blood orange, ginger and a sprig of rosemary",
    description: "Ruby blood oranges pressed with fresh ginger and finished with rosemary. Here for the cold months only.",
    ingredients: ["Blood orange", "Ginger", "Rosemary"],
    basePrice: 7.5,
    color: "#D7263D",
    deep: "#6A0F1C",
    flavor: { sweet: 3, tart: 3, fresh: 4 },
    badges: ["limited"],
  },
  {
    id: "pomegranate-frost",
    name: "Pomegranate Frost",
    category: "seasonal",
    kind: "pressed",
    tagline: "Pomegranate, apple and lime",
    description: "Tart pomegranate pressed with crisp apple and lime. Jewel-red and properly cold.",
    ingredients: ["Pomegranate", "Apple", "Lime"],
    basePrice: 7.75,
    color: "#B5174A",
    deep: "#560824",
    flavor: { sweet: 3, tart: 4, fresh: 4 },
    badges: ["limited"],
  },
];

/** Every drink uses its studio photo from public/media/images/products/<id>.webp unless an entry sets its own. */
export const products: Product[] = menu.map((p) => ({
  ...p,
  image: p.image ?? `/media/images/products/${p.id}.webp`,
  imageAlt: p.imageAlt ?? `A tall glass of ${p.name}, ${p.tagline.charAt(0).toLowerCase() + p.tagline.slice(1)}, with fresh fruit beside it`,
}));

export const featuredIds =["sunrise-press", "mango-monsoon", "melon-hour", "passion-pine", "berry-banana-bloom", "mint-condition"];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
