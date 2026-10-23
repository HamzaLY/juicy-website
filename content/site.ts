// Brand, contact and page copy. Rename the brand or change business details here.
// Everything marked SAMPLE is placeholder content for a fictional business: replace it before launch.

export const brand = {
  name: "JUICY",
  tagline: "Freshness in full color",
  description: "Fresh-pressed juices, smoothies and refreshers, made to order and filled to the line.",
  /** Set to false once this is a real business with real photos. */
  fictional: true,
  copyrightYear: 2026,
};

export const nav = [
  { label: "Home", href: "/#top" },
  { label: "Our Drinks", href: "/#menu" },
  { label: "Our Story", href: "/#story" },
  { label: "Seasonal Specials", href: "/#seasonal" },
  { label: "Contact", href: "/#visit" },
];

export const contact = {
  sample: true, // SAMPLE: replace with the real business details
  addressLines: ["123 Sample Street", "Your City, ST 00000"],
  phone: "(555) 010-0199",
  phoneHref: "tel:+15550100199",
  email: "hello@example.com",
  mapQuery: "", // e.g. "JUICY juice bar, Your City" to enable the directions link
  hours: [
    { days: "Monday to Friday", time: "7:00 am to 7:00 pm" },
    { days: "Saturday", time: "8:00 am to 7:00 pm" },
    { days: "Sunday", time: "9:00 am to 5:00 pm" },
  ],
};

/** Add real profile URLs to show social links. Empty entries are hidden. */
export const socials: { label: string; href: string }[] = [
  // { label: "Instagram", href: "https://instagram.com/your-handle" },
];

/** The four promises behind "filled to the line". */
export const promises = [
  { title: "Filled to the line", body: "Every cup is poured to the top line. No half-empty cups, ever." },
  { title: "Pressed when you order", body: "Nothing sits in a fridge. Your juice is pressed while you wait." },
  { title: "You set the sweetness", body: "Smoothies and refreshers come in three sweetness levels. Pressed juice is never sweetened." },
  { title: "Ice your way", body: "Light ice by default, or ice on the side, so your drink is never watered down." },
];
