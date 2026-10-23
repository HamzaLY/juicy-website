"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { getProduct } from "@/content/products";
import { computeTotals, MAX_QTY, type CartLine, type CartTotals } from "@/lib/cart-math";
import { lineKey, normalizeSelection, type Selection } from "@/lib/pricing";

const STORAGE_KEY = "juicy-cart-v1";

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; productId: string; selection: Selection; quantity: number }
  | { type: "setQty"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const product = getProduct(action.productId);
      if (!product) return lines;
      const selection = normalizeSelection(product, action.selection);
      const key = lineKey(product.id, selection);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.quantity) } : l));
      }
      return [...lines, { key, productId: product.id, selection, quantity: Math.min(MAX_QTY, Math.max(1, action.quantity)) }];
    }
    case "setQty":
      if (action.quantity <= 0) return lines.filter((l) => l.key !== action.key);
      return lines.map((l) => (l.key === action.key ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l));
    case "remove":
      return lines.filter((l) => l.key !== action.key);
    case "clear":
      return [];
  }
}

/** Drop anything stale or malformed from storage (renamed products, old option ids). */
function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const item of raw) {
    const product = item && typeof item.productId === "string" ? getProduct(item.productId) : undefined;
    if (!product || typeof item.quantity !== "number" || !item.selection) continue;
    const selection = normalizeSelection(product, item.selection);
    const quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(item.quantity)));
    out.push({ key: lineKey(product.id, selection), productId: product.id, selection, quantity });
  }
  return out;
}

type CartContextValue = {
  lines: CartLine[];
  totals: CartTotals;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, selection: Selection, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Last added item, for the confirmation toast. */
  lastAdded: { name: string; at: number } | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null);

  // Restore the saved cart after hydration (the server render always starts empty, so markup matches).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "hydrate", lines: sanitize(JSON.parse(stored)) });
    } catch {
      // Storage can be unavailable (private mode, blocked site data). The cart still works for this visit.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage after hydration
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore: persistence is a convenience.
    }
  }, [lines, ready]);

  const add = useCallback((productId: string, selection: Selection, quantity = 1) => {
    dispatch({ type: "add", productId, selection, quantity });
    const product = getProduct(productId);
    if (product) setLastAdded({ name: product.name, at: Date.now() });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals: computeTotals(lines),
      ready,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity: (key, quantity) => dispatch({ type: "setQty", key, quantity }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      lastAdded,
    }),
    [lines, ready, isOpen, add, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
