import { bundle } from "@/content/promos";
import { getProduct } from "@/content/products";
import { fromPrice, unitPrice, type Selection } from "./pricing";

export type CartLine = {
  key: string;
  productId: string;
  selection: Selection;
  quantity: number;
};

export const MAX_QTY = 20;

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  bundleDiscount: number;
  bundlesApplied: number;
  total: number;
};

export function lineTotal(line: CartLine): number {
  const product = getProduct(line.productId);
  if (!product) return 0;
  return Math.round(unitPrice(product, line.selection) * line.quantity * 100) / 100;
}

/**
 * The Color Flight: every three small drinks cost the bundle price (plus any add-ins).
 * Groups the most expensive small drinks first so the customer always gets the best deal.
 */
export function computeTotals(lines: CartLine[]): CartTotals {
  let itemCount = 0;
  let subtotal = 0;
  const smallBases: number[] = [];

  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product) continue;
    itemCount += line.quantity;
    subtotal += unitPrice(product, line.selection) * line.quantity;
    if (line.selection.size === bundle.size) {
      for (let i = 0; i < line.quantity; i++) smallBases.push(fromPrice(product));
    }
  }

  smallBases.sort((a, b) => b - a);
  const bundlesApplied = Math.floor(smallBases.length / bundle.count);
  let bundleDiscount = 0;
  for (let b = 0; b < bundlesApplied; b++) {
    const group = smallBases.slice(b * bundle.count, (b + 1) * bundle.count);
    const sum = group.reduce((s, n) => s + n, 0);
    bundleDiscount += Math.max(0, sum - bundle.price);
  }

  subtotal = Math.round(subtotal * 100) / 100;
  bundleDiscount = Math.round(bundleDiscount * 100) / 100;
  return { itemCount, subtotal, bundleDiscount, bundlesApplied, total: Math.round((subtotal - bundleDiscount) * 100) / 100 };
}
