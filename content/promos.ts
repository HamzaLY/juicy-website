// Seasonal feature and bundle. Change the drink, copy, dates or offer here.
// Offers are demonstration content for a fictional brand.

export const seasonal = {
  productId: "blood-orange-ember",
  kicker: "Seasonal special",
  title: "Blood Orange Ember",
  body: "Ruby blood oranges only show up for a few months a year, so we press them with fresh ginger and a sprig of rosemary while they're here.",
  availability: "Available while blood oranges are in season",
  image: "/media/images/sections/seasonal-blood-orange.webp" as string | undefined,
  imageAlt: "A tall glass of ruby blood orange juice with rosemary, surrounded by halved blood oranges and fresh ginger",
};

export const bundle = {
  id: "color-flight",
  title: "The Color Flight",
  body: "Any three small drinks for one price. Build a rainbow, or get three of the same. We won't judge.",
  price: 15,
  /** Shown next to the offer. */
  label: "Demo offer",
  size: "small" as const,
  count: 3,
  image: "/media/images/sections/promo-flight.webp" as string | undefined,
  imageAlt: "Three small glasses of orange juice, pink watermelon juice and lemon mint refresher in a row",
};
