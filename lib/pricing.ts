// The single pricing model for the menu, the customizer and the cart.

import { addIns, MAX_ADD_INS, rules, sizes, type AddInId, type IceId, type SizeId, type SweetId } from "@/content/options";
import type { Product } from "@/content/products";

export type Selection = {
  size: SizeId;
  ice: IceId | null;
  sweet: SweetId | null;
  addIns: AddInId[];
};

export function defaultSelection(product: Product): Selection {
  const r = rules[product.kind];
  return { size: "regular", ice: r.defaultIce, sweet: r.defaultSweet, addIns: [] };
}

export function allowedAddIns(product: Product) {
  return addIns.filter((a) => a.kinds.includes(product.kind));
}

/** Coerce any selection into a valid one for this product (drops anything the drink doesn't allow). */
export function normalizeSelection(product: Product, s: Selection): Selection {
  const r = rules[product.kind];
  const allowed = new Set(allowedAddIns(product).map((a) => a.id));
  const unique = [...new Set(s.addIns)].filter((id) => allowed.has(id)).slice(0, MAX_ADD_INS);
  return {
    size: sizes.some((x) => x.id === s.size) ? s.size : "regular",
    ice: r.ice ? (s.ice && r.ice.includes(s.ice) ? s.ice : r.defaultIce) : null,
    sweet: r.sweet ? (s.sweet && r.sweet.includes(s.sweet) ? s.sweet : r.defaultSweet) : null,
    addIns: unique.sort(),
  };
}

/** Price of one drink with its options, rounded to the cent. */
export function unitPrice(product: Product, s: Selection): number {
  const sel = normalizeSelection(product, s);
  const size = sizes.find((x) => x.id === sel.size)?.delta ?? 0;
  const extras = sel.addIns.reduce((sum, id) => sum + (addIns.find((a) => a.id === id)?.price ?? 0), 0);
  return Math.round((product.basePrice + size + extras) * 100) / 100;
}

/** Starting price shown on menu cards (the smallest size, no extras). */
export function fromPrice(product: Product): number {
  return unitPrice(product, { ...defaultSelection(product), size: "small" });
}

/** Stable key so identical drinks merge into one cart line. */
export function lineKey(productId: string, s: Selection): string {
  return [productId, s.size, s.ice ?? "-", s.sweet ?? "-", [...s.addIns].sort().join("+") || "-"].join("|");
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const formatPrice = (n: number) => usd.format(n);

export function describeSelection(s: Selection): string {
  const parts: string[] = [sizes.find((x) => x.id === s.size)?.label ?? ""];
  if (s.ice) parts.push({ none: "No ice", light: "Light ice", regular: "Regular ice", side: "Ice on the side" }[s.ice]);
  if (s.sweet) parts.push({ none: "Not sweetened", half: "Half sweet", full: "Full sweet" }[s.sweet]);
  for (const id of s.addIns) parts.push("+ " + (addIns.find((a) => a.id === id)?.label ?? id));
  return parts.filter(Boolean).join(" · ");
}
