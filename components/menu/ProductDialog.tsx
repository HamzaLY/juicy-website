"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, X } from "lucide-react";
import type { Product } from "@/content/products";
import { iceLevels, MAX_ADD_INS, rules, sizes, sweetLevels, type AddInId } from "@/content/options";
import { allowedAddIns, defaultSelection, formatPrice, unitPrice, type Selection } from "@/lib/pricing";
import { MAX_QTY } from "@/lib/cart-math";
import { useDialog } from "@/lib/use-dialog";
import { useCart } from "@/components/cart/CartProvider";
import { DrinkVisual } from "@/components/visual/DrinkVisual";
import { FlavorMeters } from "./FlavorMeters";

export function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useDialog(true, panel, onClose);
  const { add, open: openCart } = useCart();
  const [sel, setSel] = useState<Selection>(() => defaultSelection(product));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const r = rules[product.kind];
  const extras = allowedAddIns(product);
  const price = useMemo(() => unitPrice(product, sel), [product, sel]);
  const tint = `color-mix(in oklab, ${product.color} 22%, var(--pulp))`;
  const titleId = `dlg-${product.id}`;

  const toggleAddIn = (id: AddInId) =>
    setSel((s) => {
      if (s.addIns.includes(id)) return { ...s, addIns: s.addIns.filter((x) => x !== id) };
      if (s.addIns.length >= MAX_ADD_INS) return s;
      return { ...s, addIns: [...s.addIns, id] };
    });

  const onAdd = () => {
    add(product.id, sel, qty);
    setAdded(true);
    setTimeout(() => {
      onClose();
      openCart();
    }, 650);
  };

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close" tabIndex={-1} className="absolute inset-0 bg-ink/55 backdrop-blur-[3px]" onClick={onClose} />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="relative grid max-h-[94dvh] w-full max-w-[1000px] overflow-hidden rounded-t-[32px] bg-pulp shadow-2xl sm:rounded-[32px] md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative hidden min-h-[520px] md:block" style={{ background: tint }}>
          <DrinkVisual product={product} sizes="440px" glassClassName="h-[70%] w-auto" />
          <div className="absolute bottom-5 left-5 rounded-full bg-pulp/85 px-3 py-1.5 font-mono text-xs text-ink backdrop-blur" aria-hidden="true">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: product.color }} />
            {product.color.toUpperCase()}
          </div>
        </div>

        <div className="flex max-h-[94dvh] flex-col">
          <div className="overflow-y-auto overscroll-contain px-6 pb-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker" style={{ color: product.deep }}>
                  {product.tagline}
                </p>
                <h2 id={titleId} className="mt-2 font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl">
                  {product.name}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pulp-deep transition-colors hover:bg-pulp-line" aria-label="Close drink details">
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="relative mt-5 h-48 overflow-hidden rounded-3xl md:hidden" style={{ background: tint }}>
              <DrinkVisual product={product} sizes="90vw" glassClassName="h-[86%] w-auto" />
            </div>

            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{product.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Ingredients">
              {product.ingredients.map((i) => (
                <li key={i} className="rounded-full border border-pulp-line px-3 py-1 text-sm">
                  {i}
                </li>
              ))}
            </ul>
            <FlavorMeters flavor={product.flavor} color={product.deep} className="mt-5" />

            <fieldset className="mt-7">
              <legend className="kicker text-ink-soft">Size</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sizes.map((s) => {
                  const active = sel.size === s.id;
                  return (
                    <label key={s.id} className={`relative cursor-pointer rounded-2xl border-2 p-3 text-center transition-colors ${active ? "border-ink bg-ink text-pulp" : "border-pulp-line hover:border-ink/40"}`}>
                      <input
                        type="radio"
                        name="size"
                        value={s.id}
                        checked={active}
                        onChange={() => setSel((x) => ({ ...x, size: s.id }))}
                        aria-label={`${s.label}, ${s.volume}${s.delta === 0 ? "" : `, ${s.delta > 0 ? "plus" : "minus"} ${formatPrice(Math.abs(s.delta))}`}`}
                        className="peer sr-only"
                      />
                      <span className="block font-semibold">{s.label}</span>
                      <span className={`block font-mono text-xs ${active ? "text-pulp/75" : "text-ink-soft"}`}>{s.volume}</span>
                      <span className={`mt-1 block font-mono text-xs ${active ? "text-mango" : "text-ink-soft"}`}>
                        {s.delta === 0 ? "base" : `${s.delta > 0 ? "+" : "−"}${formatPrice(Math.abs(s.delta))}`}
                      </span>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange" />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="kicker text-ink-soft">Ice</legend>
              {r.ice ? (
                <ChipGroup name="ice" options={iceLevels.filter((o) => r.ice!.includes(o.id))} value={sel.ice} onChange={(v) => setSel((x) => ({ ...x, ice: v }))} />
              ) : (
                <p className="mt-2 text-sm text-ink-soft">{r.iceNote}</p>
              )}
            </fieldset>

            <fieldset className="mt-6">
              <legend className="kicker text-ink-soft">Sweetness</legend>
              {r.sweet ? (
                <ChipGroup name="sweet" options={sweetLevels.filter((o) => r.sweet!.includes(o.id))} value={sel.sweet} onChange={(v) => setSel((x) => ({ ...x, sweet: v }))} />
              ) : (
                <p className="mt-2 text-sm text-ink-soft">{r.sweetNote}</p>
              )}
            </fieldset>

            <fieldset className="mt-6">
              <legend className="kicker text-ink-soft">
                Add-ins <span className="normal-case tracking-normal">(up to {MAX_ADD_INS})</span>
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {extras.map((a) => {
                  const checked = sel.addIns.includes(a.id);
                  const disabled = !checked && sel.addIns.length >= MAX_ADD_INS;
                  return (
                    <label
                      key={a.id}
                      className={`relative flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 py-2 transition-colors ${
                        checked ? "border-ink" : "border-pulp-line hover:border-ink/40"
                      } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                    >
                      <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleAddIn(a.id)} aria-label={`${a.label}, plus ${formatPrice(a.price)}`} className="peer sr-only" />
                      <span className="flex items-center gap-2.5">
                        <span className={`grid h-5 w-5 place-items-center rounded-md border-2 ${checked ? "border-ink bg-ink text-pulp" : "border-ink/30"}`} aria-hidden="true">
                          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </span>
                        {a.label}
                      </span>
                      <span className="font-mono text-sm text-ink-soft">+{formatPrice(a.price)}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange" />
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-ink-soft" aria-live="polite">
                {sel.addIns.length >= MAX_ADD_INS ? `That's the maximum of ${MAX_ADD_INS} add-ins. Remove one to swap.` : ""}
              </p>
            </fieldset>
          </div>

          <div className="flex items-center gap-3 border-t border-pulp-line bg-pulp px-6 py-4 sm:px-8">
            <div className="flex items-center rounded-full border-2 border-pulp-line" role="group" aria-label="Quantity">
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-35" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <output className="w-7 text-center font-mono" aria-live="polite" aria-label={`Quantity ${qty}`}>
                {qty}
              </output>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-35" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Increase quantity">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <button type="button" onClick={onAdd} disabled={added} className="btn btn-primary flex-1 justify-between !px-5" data-autofocus>
              <span>{added ? "Added" : "Add to order"}</span>
              <span className="font-mono" aria-live="polite">
                {formatPrice(price * qty)}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChipGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { id: T; label: string; note?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <label
            key={o.id}
            className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-4 text-[0.95rem] transition-colors ${
              active ? "border-ink bg-ink text-pulp" : "border-pulp-line hover:border-ink/40"
            }`}
            title={o.note}
          >
            <input type="radio" name={name} value={o.id} checked={active} onChange={() => onChange(o.id)} aria-label={o.note ? `${o.label}, ${o.note}` : o.label} className="peer sr-only" />
            {o.label}
            <span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange" />
          </label>
        );
      })}
    </div>
  );
}
