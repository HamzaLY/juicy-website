// Customization options and the rules that keep every combination valid.
// Price changes are in US dollars relative to a Regular drink.

import type { DrinkKind } from "./products";

export type SizeId = "small" | "regular" | "large";
export type IceId = "none" | "light" | "regular" | "side";
export type SweetId = "none" | "half" | "full";
export type AddInId = "chia" | "ginger" | "mint" | "coconut-water" | "oat-milk" | "double-fruit";

export const sizes: { id: SizeId; label: string; volume: string; delta: number }[] = [
  { id: "small", label: "Small", volume: "12 oz", delta: -0.75 },
  { id: "regular", label: "Regular", volume: "16 oz", delta: 0 },
  { id: "large", label: "Large", volume: "24 oz", delta: 1.5 },
];

export const iceLevels: { id: IceId; label: string }[] = [
  { id: "none", label: "No ice" },
  { id: "light", label: "Light ice" },
  { id: "regular", label: "Regular ice" },
  { id: "side", label: "Ice on the side" },
];

export const sweetLevels: { id: SweetId; label: string; note: string }[] = [
  { id: "none", label: "Not sweetened", note: "Just the fruit" },
  { id: "half", label: "Half sweet", note: "A little agave" },
  { id: "full", label: "Full sweet", note: "The house recipe" },
];

export const addIns: { id: AddInId; label: string; price: number; kinds: DrinkKind[] }[] = [
  { id: "ginger", label: "Fresh ginger", price: 0.6, kinds: ["pressed", "smoothie", "refresher"] },
  { id: "mint", label: "Extra mint", price: 0.4, kinds: ["pressed", "smoothie", "refresher"] },
  { id: "chia", label: "Chia seeds", price: 0.75, kinds: ["pressed", "smoothie", "refresher"] },
  { id: "double-fruit", label: "Double fruit", price: 1.25, kinds: ["smoothie"] },
  { id: "oat-milk", label: "Extra oat milk", price: 0.8, kinds: ["smoothie"] },
  { id: "coconut-water", label: "Coconut water splash", price: 1.0, kinds: ["pressed", "refresher"] },
];

export const MAX_ADD_INS = 3;

/** Which choices each kind of drink allows. */
export const rules: Record<DrinkKind, { ice: IceId[] | null; sweet: SweetId[] | null; defaultIce: IceId | null; defaultSweet: SweetId | null; iceNote?: string; sweetNote?: string }> = {
  // Pressed juices are never sweetened, and you choose the ice.
  pressed: {
    ice: ["none", "light", "regular", "side"],
    sweet: null,
    defaultIce: "light",
    defaultSweet: null,
    sweetNote: "Pressed juices are never sweetened. It's just fruit.",
  },
  // Smoothies are blended with frozen fruit, so there is no separate ice choice.
  smoothie: {
    ice: null,
    sweet: ["none", "half", "full"],
    defaultIce: null,
    defaultSweet: "none",
    iceNote: "Smoothies are blended thick with frozen fruit, so there's no ice to add.",
  },
  refresher: {
    ice: ["light", "regular", "side"],
    sweet: ["none", "half", "full"],
    defaultIce: "regular",
    defaultSweet: "half",
  },
};
