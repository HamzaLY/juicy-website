import { promises } from "@/content/site";

/** One living element: the four promises on a slow, endless ribbon. */
export function PromiseRibbon() {
  const items = [...promises, ...promises, ...promises];
  return (
    <section aria-label="Our promises" className="relative z-10 -mt-6 overflow-hidden py-6" data-living>
      <ul className="sr-only">
        {promises.map((p) => (
          <li key={p.title}>
            {p.title}: {p.body}
          </li>
        ))}
      </ul>
      <div className="-rotate-[1.6deg] bg-orange py-4 shadow-[0_20px_40px_-24px_rgb(178_74_0/0.8)]" aria-hidden="true">
        <div className="flex w-max" style={{ animation: "marquee 48s linear infinite", animationDelay: "-12s" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {items.map((p, i) => (
                <span key={`${copy}-${i}`} className="flex items-center gap-6 px-6 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {p.title}
                  <svg viewBox="0 0 24 32" className="h-6 w-auto"><path d="M12 1c4.4 6.3 10 12.2 10 18.8a10 10 0 0 1-20 0C2 13.2 7.6 7.3 12 1Z" fill="var(--ink)" /></svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
