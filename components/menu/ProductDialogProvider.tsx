"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { getProduct } from "@/content/products";
import { ProductDialog } from "./ProductDialog";

const Ctx = createContext<{ openProduct: (id: string) => void } | null>(null);

export function ProductDialogProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<string | null>(null);
  const openProduct = useCallback((id: string) => setProductId(id), []);
  const product = productId ? getProduct(productId) : undefined;

  return (
    <Ctx.Provider value={{ openProduct }}>
      {children}
      <AnimatePresence>{product && <ProductDialog key={product.id} product={product} onClose={() => setProductId(null)} />}</AnimatePresence>
    </Ctx.Provider>
  );
}

export function useProductDialog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProductDialog must be used inside <ProductDialogProvider>");
  return ctx;
}
