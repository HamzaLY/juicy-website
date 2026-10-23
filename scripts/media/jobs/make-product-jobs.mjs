// Builds products.json: one studio photo per drink in a single consistent art direction.
//   node scripts/media/jobs/make-product-jobs.mjs
import { writeFileSync } from "node:fs";

const drinks = [
  ["sunrise-press", "freshly squeezed orange juice with clear ice", "an orange wheel on the rim", "halved oranges", "pale apricot"],
  ["melon-hour", "bright pink watermelon juice with clear ice", "a lime wheel on the rim", "a small watermelon wedge and a halved lime", "soft blush pink"],
  ["green-rush", "vivid green apple, cucumber and spinach juice with clear ice", "a thin cucumber ribbon inside the glass", "a green apple half, cucumber slices and a knob of ginger", "pale celery green"],
  ["carrot-gold", "golden carrot, orange and ginger juice with clear ice", "an orange slice on the rim", "two small carrots with leafy tops and an orange half", "soft marigold"],
  ["mango-monsoon", "thick creamy mango and banana smoothie", "a few mango cubes on top", "a halved ripe mango and a banana", "warm butter yellow"],
  ["berry-banana-bloom", "thick creamy pink strawberry banana smoothie", "a whole strawberry on the rim", "fresh strawberries and a banana", "soft rose pink"],
  ["lagoon-drift", "thick creamy turquoise blue pineapple coconut smoothie", "a pineapple wedge on the rim", "pineapple chunks and a halved coconut", "pale aqua"],
  ["passion-pine", "golden pineapple and passionfruit juice with black passionfruit seeds swirling through it and clear ice", "a pineapple leaf", "a halved passionfruit and pineapple chunks", "light honey yellow"],
  ["guava-wave", "coral pink guava and pineapple juice with clear ice", "a lime wheel on the rim", "halved pink guavas and a lime", "soft coral pink"],
  ["tropic-parade", "sunset orange tropical mango, pineapple and passionfruit juice with clear ice", "a pineapple wedge on the rim", "mango, pineapple and a halved passionfruit", "warm tangerine"],
  ["mint-condition", "pale sparkling lemonade with fresh mint leaves, bubbles and clear ice", "a lemon wheel and a mint sprig", "halved lemons and mint sprigs", "pale lemon chiffon"],
  ["cucumber-cooler", "pale green cucumber, lime and mint juice with clear ice", "a cucumber slice and mint sprig", "cucumber slices and a halved lime", "soft mint green"],
  ["hibiscus-hush", "deep magenta iced hibiscus tea with raspberries and clear ice", "a lemon wheel on the rim", "fresh raspberries and dried hibiscus flowers", "dusty magenta pink"],
  ["blood-orange-ember", "ruby red blood orange juice with clear ice", "a rosemary sprig and a blood orange wheel", "halved blood oranges and fresh ginger", "deep wine red"],
  ["pomegranate-frost", "jewel red pomegranate and apple juice with clear ice", "a sprinkle of pomegranate seeds on top", "a split pomegranate and a green apple slice", "deep berry red"],
];

const jobs = drinks.map(([id, liquid, garnish, props, backdrop], i) => ({
  id: `product-${id}`,
  model: "klein",
  seed: 4100 + i,
  width: 1024,
  height: 1024,
  prompt:
    `Studio beverage advertising photograph. One tall clear straight-sided highball glass filled right to the top with ${liquid}, garnished with ${garnish}, ` +
    `standing dead center on a seamless ${backdrop} paper backdrop that curves into a matching ${backdrop} tabletop. ${props[0].toUpperCase() + props.slice(1)} rest low beside the glass. ` +
    `The glass fills the middle sixty percent of the frame height with generous empty space above and below it. ` +
    `Glossy cold condensation droplets on the glass. Soft directional daylight from the upper left, one crisp natural shadow falling to the right, ` +
    `clean minimal set, color-blocked editorial style, photorealistic, sharp focus.`,
}));

writeFileSync(new URL("./products.json", import.meta.url), JSON.stringify(jobs, null, 2));
console.log(`${jobs.length} jobs written`);
