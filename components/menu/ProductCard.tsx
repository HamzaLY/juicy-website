"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/content/products";
import { formatPrice, fromPrice } from "@/lib/pricing";
import { DrinkVisual } from "@/components/visual/DrinkVisual";
import { useProductDialog } from "./ProductDialogProvider";
import { FlavorMeters } from "./FlavorMeters";

const badgeLabel = { signature: "Signature", new: "New", limited: "Limited", favorite: "Fan favorite" } as const;

export function ProductCard({ product, variant = "standard", priority = false }: { product: Product; variant?: "standard" | "tall" | "wide"; priority?: boolean }) {
  const { openProduct } = useProductDialog();
  const tint = `color-mix(in oklab, ${product.color} 26%, var(--pulp))`;
  const badge = product.badges?.[0];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-pulp-deep/60 ring-1 ring-pulp-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(30_20_14/0.45)] focus-within:-translate-y-1.5 ${
        variant === "wide" ? "md:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${variant === "tall" ? "aspect-[4/5] md:aspect-auto md:flex-1" : variant === "wide" ? "aspect-[4/3] md:aspect-auto md:w-1/2" : "aspect-[4/3]"}`}
        style={{ background: tint }}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]">
          <DrinkVisual product={product} priority={priority} sizes={variant === "tall" ? "(max-width: 768px) 92vw, 40vw" : "(max-width: 768px) 92vw, 30vw"} />
        </div>
        {/* the fill line rises to meet the cup on hover */}
        <span aria-hidden="true" className="absolute inset-x-6 bottom-6 h-px origin-left scale-x-0 bg-ink/30 transition-transform duration-700 group-hover:scale-x-100" />
        {badge && <span className="absolute left-4 top-4 rounded-full bg-pulp/90 px-3 py-1 font-mono text-[0.72rem] uppercase tracking-wider text-ink backdrop-blur">{badgeLabel[badge]}</span>}
      </div>

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${variant === "wide" ? "md:justify-center md:p-8" : ""}`}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={`font-display font-extrabold leading-[1] ${variant === "standard" ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            <button type="button" onClick={() => openProduct(product.id)} className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {product.name}
            </button>
          </h3>
          <p className="shrink-0 font-mono text-sm text-ink-soft">
            from <span className="text-base text-ink">{formatPrice(fromPrice(product))}</span>
          </p>
        </div>
        <p className="mt-2 text-ink-soft">{product.tagline}</p>
        {variant !== "standard" && <p className="mt-3 hidden max-w-[42ch] leading-relaxed text-ink-soft md:block">{product.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <FlavorMeters flavor={product.flavor} color={product.deep} compact />
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-pulp transition-[transform,background-color] duration-500 ease-[var(--ease-juicy)] group-hover:rotate-90 group-hover:bg-orange group-hover:text-ink"
          >
            <Plus />
          </span>
        </div>
      </div>
      {/* keyboard focus ring for the whole card (the stretched button covers it) */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] ring-orange group-has-[button:focus-visible]:ring-[3px]" />
    </article>
  );
}
