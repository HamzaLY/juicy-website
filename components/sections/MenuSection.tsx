import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { FillLine } from "@/components/visual/FillLine";

export function MenuSection() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-pulp-deep pb-28 pt-20 sm:pb-36" data-living>
      <FillLine color="var(--pulp-deep)" className="absolute -top-10 left-0 sm:-top-14" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div data-reveal>
            <p className="kicker text-orange-deep">The full menu</p>
            <h2 id="menu-title" className="mt-3 font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              Pick a color.
            </h2>
          </div>
          <p data-reveal style={{ ["--d" as string]: 1 }} className="max-w-[40ch] text-lg text-ink-soft">
            Tap any drink to choose the size, ice, sweetness and add-ins. The price updates as you go.
          </p>
        </div>
        <div className="mt-10">
          <MenuExplorer />
        </div>
        <p className="mt-10 font-mono text-xs text-ink-soft">All prices are demo prices in US dollars.</p>
      </div>
    </section>
  );
}
