import { getProduct } from "@/content/products";
import { testimonials, testimonialsAreSamples } from "@/content/testimonials";

const tilt = ["-rotate-[1.5deg]", "rotate-[1deg]", "-rotate-[0.6deg]", "rotate-[1.8deg]"];

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-mango py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div data-reveal>
            <p className="kicker text-ink">What people say</p>
            <h2 id="reviews-title" className="mt-3 max-w-[16ch] font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              The line gets noticed.
            </h2>
          </div>
          {testimonialsAreSamples && (
            <p data-reveal className="max-w-[34ch] rounded-2xl bg-ink/10 px-4 py-3 font-mono text-xs text-ink">
              Sample reviews written for this demo. They are not from real customers.
            </p>
          )}
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => {
            const p = getProduct(t.drink);
            return (
              <li key={i} data-reveal style={{ ["--d" as string]: i }} className={`${tilt[i % tilt.length]} transition-transform duration-500 hover:rotate-0`}>
                <figure className="flex h-full flex-col rounded-[28px] bg-pulp p-6 shadow-[0_24px_40px_-28px_rgb(30_20_14/0.5)]">
                  <span aria-hidden="true" className="font-display text-6xl leading-[0.6]" style={{ color: p?.color }}>
                    “
                  </span>
                  <blockquote className="mt-3 flex-1 text-[1.05rem] leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-2 border-t border-pulp-line pt-4 text-sm text-ink-soft">
                    <span className="h-3 w-3 rounded-full" style={{ background: p?.color }} aria-hidden="true" />
                    {t.who} · {p?.name}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
