"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, CircleCheck, Info } from "lucide-react";
import { getProduct } from "@/content/products";
import { bundle } from "@/content/promos";
import { contact } from "@/content/site";
import { lineTotal } from "@/lib/cart-math";
import { describeSelection, formatPrice } from "@/lib/pricing";
import { Glass } from "@/components/visual/Glass";
import { DrinkVisual } from "@/components/visual/DrinkVisual";
import { useCart } from "./CartProvider";

const pickupTimes = ["As soon as possible", "In 15 minutes", "In 30 minutes", "In 1 hour"];

/**
 * Demo checkout. Collects only a first name and a pickup time, keeps them in memory,
 * and never sends anything anywhere. No payment fields exist.
 */
export function CheckoutView() {
  const { lines, totals, ready, clear } = useCart();
  const [name, setName] = useState("");
  const [time, setTime] = useState(pickupTimes[0]);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ name: string; time: string; total: number; count: number; ref: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Add a first name so we know whose cup it is.");
      return;
    }
    setError("");
    setPlaced({ name: name.trim(), time, total: totals.total, count: totals.itemCount, ref: Math.random().toString(36).slice(2, 7).toUpperCase() });
    clear();
  };

  return (
    <div className="mx-auto min-h-[80vh] max-w-[1100px] px-5 pb-28 pt-[calc(var(--nav-h)+40px)] sm:px-8">
      <Link href="/#menu" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the menu
      </Link>
      <h1 className="mt-4 font-display text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">{placed ? "Order received." : "Checkout"}</h1>

      <div role="note" className="mt-6 flex gap-3 rounded-2xl bg-mango/40 px-5 py-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          <strong>This is a demo store.</strong> No payment is taken, no order is sent, and nothing you type here leaves your browser.
        </p>
      </div>

      {placed ? (
        <div className="mt-10 rounded-[32px] bg-pulp-deep p-8 text-center sm:p-12" role="status">
          <CircleCheck className="mx-auto h-14 w-14 text-orange-deep" aria-hidden="true" />
          <p className="mt-4 font-display text-3xl font-bold">Thanks, {placed.name}!</p>
          <p className="mx-auto mt-3 max-w-[48ch] text-lg text-ink-soft">
            In a real store, your {placed.count} {placed.count === 1 ? "drink" : "drinks"} ({formatPrice(placed.total)}) would be pressed for pickup {placed.time.toLowerCase()}. Demo reference {placed.ref}.
          </p>
          <Link href="/#menu" className="btn btn-primary mt-8">
            Back to the menu
          </Link>
        </div>
      ) : !ready ? (
        <p className="mt-10 text-ink-soft">Loading your order…</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[32px] bg-pulp-deep p-10 text-center">
          <Glass color="#FFC21A" deep="#7A5200" fill={0.08} ice={false} className="h-36 w-auto" />
          <p className="mt-4 font-display text-2xl font-bold">Your cup is empty.</p>
          <Link href="/#menu" className="btn btn-primary mt-6">
            Explore Our Drinks
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <section aria-labelledby="summary-title">
            <h2 id="summary-title" className="font-display text-2xl font-bold">
              Your order
            </h2>
            <ul className="mt-4 divide-y divide-pulp-line">
              {lines.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                return (
                  <li key={line.key} className="flex gap-4 py-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: `color-mix(in oklab, ${p.color} 24%, var(--pulp))` }}>
                      <DrinkVisual product={p} sizes="64px" glassClassName="h-12 w-auto" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-semibold">
                          {line.quantity} × {p.name}
                        </p>
                        <p className="font-mono">{formatPrice(lineTotal(line))}</p>
                      </div>
                      <p className="text-sm text-ink-soft">{describeSelection(line.selection)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-pulp-line pt-4">
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
              <div className="flex justify-between text-xl font-semibold">
                <dt>Total</dt>
                <dd className="font-mono">{formatPrice(totals.total)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="pickup-title" className="rounded-[32px] bg-pulp-deep p-6 sm:p-8">
            <h2 id="pickup-title" className="font-display text-2xl font-bold">
              Pickup details
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Pickup at the counter, {contact.addressLines[0]} (sample address).
            </p>
            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div>
                <label htmlFor="pickup-name" className="block font-semibold">
                  First name
                </label>
                <input
                  id="pickup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  maxLength={40}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "pickup-error" : undefined}
                  className="mt-2 h-12 w-full rounded-2xl border-2 border-pulp-line bg-pulp px-4 focus:border-ink focus:outline-none"
                />
                {error && (
                  <p id="pickup-error" className="mt-2 text-sm font-medium text-berry" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="pickup-time" className="block font-semibold">
                  Pickup time
                </label>
                <select id="pickup-time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border-2 border-pulp-line bg-pulp px-4 focus:border-ink focus:outline-none">
                  {pickupTimes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full justify-between !px-6">
                <span>Place demo order</span>
                <span className="font-mono">{formatPrice(totals.total)}</span>
              </button>
              <p className="text-center font-mono text-xs text-ink-soft">No payment details are requested or stored.</p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
