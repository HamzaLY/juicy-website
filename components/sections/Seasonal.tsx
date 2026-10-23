"use client";

import Image from "next/image";
import { getProduct } from "@/content/products";
import { bundle, seasonal } from "@/content/promos";
import { formatPrice, fromPrice } from "@/lib/pricing";
import { useProductDialog } from "@/components/menu/ProductDialogProvider";
import { showCategory } from "@/components/menu/MenuExplorer";
import { Glass } from "@/components/visual/Glass";
import { CitrusSlice } from "@/components/visual/Fruit";
import { FillLine } from "@/components/visual/FillLine";

const flight = ["sunrise-press", "melon-hour", "mint-condition"].map((id) => getProduct(id)!);

export function Seasonal() {
  const { openProduct } = useProductDialog();
  const product = getProduct(seasonal.productId)!;

  return (
    <section id="seasonal" aria-labelledby="seasonal-title" className="on-rind relative pb-24 pt-20 text-cream sm:pb-32" style={{ background: product.deep }} data-living>
      <FillLine color={product.deep} className="absolute -top-10 left-0 sm:-top-14" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative order-2 aspect-[5/4] overflow-hidden rounded-[40px] lg:order-1" style={{ background: `radial-gradient(circle at 50% 65%, ${product.color} 0%, ${product.deep} 72%)` }}>
            {seasonal.image ? (
              <Image src={seasonal.image} alt={seasonal.imageAlt} fill sizes="(max-width: 1024px) 92vw, 52vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute inset-x-0 bottom-[8%] flex justify-center">
                  <Glass color={product.color} deep={product.deep} fill={0.9} garnish="#E25A3B" className="h-[300px] w-auto sm:h-[380px]" />
                </div>
                <div className="float absolute left-[8%] top-[12%] w-[18%]" style={{ ["--f" as string]: "-2s" }}>
                  <CitrusSlice color="#C8102E" rind="#E87A2E" />
                </div>
                <div className="float absolute right-[10%] top-[30%] w-[13%]" style={{ ["--f" as string]: "-5s" }}>
                  <CitrusSlice color="#C8102E" rind="#E87A2E" />
                </div>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <p className="kicker text-mango" data-reveal>
              {seasonal.kicker}
            </p>
            <h2 id="seasonal-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-3 font-display text-[clamp(2.8rem,6vw,5.4rem)] font-extrabold leading-[0.9] tracking-[-0.03em]">
              {seasonal.title}
            </h2>
            <p data-reveal style={{ ["--d" as string]: 2 }} className="mt-5 max-w-[46ch] text-lg leading-relaxed text-cream/85">
              {seasonal.body}
            </p>
            <p data-reveal style={{ ["--d" as string]: 3 }} className="mt-4 font-mono text-sm text-mango">
              {seasonal.availability} · from {formatPrice(fromPrice(product))}
            </p>
            <div data-reveal style={{ ["--d" as string]: 4 }} className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={() => openProduct(product.id)}>
                Try {product.name}
              </button>
              <button type="button" className="btn btn-ghost text-cream" onClick={() => showCategory("seasonal")}>
                All seasonal drinks
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-8 rounded-[36px] bg-cream p-6 text-ink sm:p-10 md:grid-cols-[1fr_auto]" data-reveal>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="kicker text-orange-deep">Bundle</p>
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-mango">{bundle.label}</span>
            </div>
            <h3 className="mt-2 font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl">
              {bundle.title}: {formatPrice(bundle.price)}
            </h3>
            <p className="mt-3 max-w-[50ch] text-lg text-ink-soft">{bundle.body} The discount applies in your cart automatically, add-ins extra.</p>
            <a href="#menu" className="btn btn-primary mt-6">
              Build your flight
            </a>
          </div>
          {bundle.image ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] md:w-[440px]">
              <Image src={bundle.image} alt={bundle.imageAlt} fill sizes="(max-width: 768px) 90vw, 440px" className="object-cover" />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-1" aria-hidden="true">
              {flight.map((p, i) => (
                <Glass key={p.id} color={p.color} deep={p.deep} fill={0.9} className={`h-36 w-auto sm:h-44 ${i === 1 ? "-translate-y-3" : ""}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
