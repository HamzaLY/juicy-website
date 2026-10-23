import { ArrowRight } from "lucide-react";
import { featuredIds, getProduct } from "@/content/products";
import { ProductCard } from "@/components/menu/ProductCard";

const layout: Record<string, { cls: string; variant: "standard" | "tall" | "wide" }> = {
  "sunrise-press": { cls: "lg:row-span-2", variant: "tall" },
  "mango-monsoon": { cls: "sm:col-span-2", variant: "wide" },
  "berry-banana-bloom": { cls: "sm:col-span-2", variant: "wide" },
};

export function Signatures() {
  const featured = featuredIds.map(getProduct).filter((p) => p !== undefined);
  return (
    <section id="signatures" aria-labelledby="signatures-title" className="relative bg-pulp py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <p className="kicker text-orange-deep">The signatures</p>
            <h2 id="signatures-title" className="mt-3 max-w-[14ch] font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              Six drinks we&apos;d pour for anyone.
            </h2>
          </div>
          <div data-reveal style={{ ["--d" as string]: 1 }} className="max-w-[36ch]">
            <p className="text-lg text-ink-soft">Every one is pressed or blended when you order, in its own color, and filled right to the line.</p>
            <a href="#menu" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-orange decoration-2 underline-offset-4 hover:decoration-4">
              See the full menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="mt-14 grid auto-rows-[minmax(0,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => {
            const l = layout[p.id] ?? { cls: "", variant: "standard" as const };
            return (
              <li key={p.id} className={l.cls} data-reveal style={{ ["--d" as string]: i % 3 }}>
                <ProductCard product={p} variant={l.variant} priority={i < 2} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
