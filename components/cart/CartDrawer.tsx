"use client";

import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { getProduct } from "@/content/products";
import { bundle } from "@/content/promos";
import { lineTotal, MAX_QTY } from "@/lib/cart-math";
import { describeSelection, formatPrice } from "@/lib/pricing";
import { useDialog } from "@/lib/use-dialog";
import { Glass } from "@/components/visual/Glass";
import { DrinkVisual } from "@/components/visual/DrinkVisual";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { isOpen, close } = useCart();
  return <AnimatePresence>{isOpen && <Drawer onClose={close} />}</AnimatePresence>;
}

function Drawer({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useDialog(true, panel, onClose);
  const { lines, totals, setQuantity, remove } = useCart();

  return (
    <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" tabIndex={-1} aria-label="Close your order" className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="absolute right-0 top-0 flex h-dvh w-full max-w-[440px] flex-col bg-pulp shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-pulp-line px-6 py-4">
          <h2 id="cart-title" className="font-display text-3xl font-extrabold">
            Your order
          </h2>
          <button type="button" onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-pulp-deep hover:bg-pulp-line" aria-label="Close your order" data-autofocus>
            <X aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Glass color="#FFC21A" deep="#7A5200" fill={0.08} ice={false} className="h-40 w-auto" />
            <p className="mt-6 font-display text-2xl font-bold">Your cup is empty.</p>
            <p className="mt-2 max-w-[28ch] text-ink-soft">Pick a drink, set it up your way, and it lands here.</p>
            <Link href="/#menu" onClick={onClose} className="btn btn-primary mt-6">
              Explore Our Drinks
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-pulp-line overflow-y-auto overscroll-contain px-6" aria-label="Items in your order">
              <AnimatePresence initial={false}>
                {lines.map((line) => {
                  const product = getProduct(line.productId);
                  if (!product) return null;
                  return (
                    <motion.li key={line.key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex gap-4 py-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl" style={{ background: `color-mix(in oklab, ${product.color} 24%, var(--pulp))` }}>
                          <DrinkVisual product={product} sizes="80px" glassClassName="h-16 w-auto" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold leading-tight">{product.name}</p>
                            <p className="font-mono text-sm">{formatPrice(lineTotal(line))}</p>
                          </div>
                          <p className="mt-1 text-sm leading-snug text-ink-soft">{describeSelection(line.selection)}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-pulp-line" role="group" aria-label={`Quantity of ${product.name}`}>
                              <button type="button" className="grid h-10 w-10 place-items-center rounded-full" onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label={line.quantity === 1 ? `Remove ${product.name}` : `One fewer ${product.name}`}>
                                <Minus className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <span className="w-6 text-center font-mono text-sm" aria-live="polite">
                                {line.quantity}
                              </span>
                              <button type="button" className="grid h-10 w-10 place-items-center rounded-full disabled:opacity-35" onClick={() => setQuantity(line.key, line.quantity + 1)} disabled={line.quantity >= MAX_QTY} aria-label={`One more ${product.name}`}>
                                <Plus className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                            <button type="button" onClick={() => remove(line.key)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm text-ink-soft hover:bg-pulp-deep hover:text-ink">
                              <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className="border-t border-pulp-line px-6 py-5">
              <dl className="space-y-1.5 text-[0.95rem]">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-mono">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.bundleDiscount > 0 && (
                  <div className="flex justify-between text-orange-deep">
                    <dt>
                      {bundle.title} × {totals.bundlesApplied}
                    </dt>
                    <dd className="font-mono">−{formatPrice(totals.bundleDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-lg font-semibold">
                  <dt>Total</dt>
                  <dd className="font-mono">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              {totals.bundleDiscount === 0 && (
                <p className="mt-2 text-sm text-ink-soft">Tip: any three small drinks cost {formatPrice(bundle.price)} together ({bundle.title}).</p>
              )}
              <Link href="/checkout" onClick={onClose} className="btn btn-primary mt-4 w-full">
                Go to checkout
              </Link>
              <p className="mt-2 text-center font-mono text-xs text-ink-soft">Demo store. No payment is taken.</p>
            </div>
          </>
        )}
      </motion.aside>
    </motion.div>
  );
}
