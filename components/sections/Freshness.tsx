import Image from "next/image";
import { freshnessMedia } from "@/content/media";
import { CitrusSlice, MelonWedge, MintLeaf, Strawberry } from "@/components/visual/Fruit";
import { SqueezeMoment } from "./SqueezeMoment";

const ingredients = [
  { name: "Orange", drinks: "Sunrise Press, Carrot Gold, Tropic Parade", bg: "#FFE0C2", art: <CitrusSlice className="w-full" /> },
  { name: "Watermelon", drinks: "Melon Hour", bg: "#FFD9D6", art: <MelonWedge className="w-full" /> },
  { name: "Strawberry", drinks: "Berry Banana Bloom", bg: "#FFD3D8", art: <Strawberry className="w-[70%]" /> },
  { name: "Lime", drinks: "Melon Hour, Green Rush, Guava Wave", bg: "#E4F3C9", art: <CitrusSlice color="#9BCB3C" rind="#4E8A1E" className="w-full" /> },
  { name: "Mint", drinks: "Mint Condition, Cucumber Cooler", bg: "#D8F0D2", art: <MintLeaf className="w-[46%]" /> },
  { name: "Lemon", drinks: "Mint Condition, Hibiscus Hush", bg: "#FBF3C2", art: <CitrusSlice color="#F6D33C" rind="#D9A800" className="w-full" /> },
];

export function Freshness() {
  return (
    <section id="fresh" aria-labelledby="fresh-title" className="relative bg-pulp py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-[720px]">
          <p className="kicker text-orange-deep" data-reveal>
            Fresh and full
          </p>
          <h2 id="fresh-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-3 font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
            Whole fruit in. Nothing waiting around.
          </h2>
          <p data-reveal style={{ ["--d" as string]: 2 }} className="mt-5 max-w-[52ch] text-lg text-ink-soft">
            Fruit is cut each morning and pressed or blended when you order. Here are a few of the regulars, and where they end up.
          </p>
        </div>

        {freshnessMedia.wall && (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[36px] sm:aspect-[21/9]" data-reveal>
            <Image src={freshnessMedia.wall} alt={freshnessMedia.wallAlt ?? ""} fill sizes="(max-width: 1280px) 92vw, 1216px" className="object-cover" />
          </div>
        )}

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {ingredients.map((i, n) => (
            <li key={i.name} data-reveal style={{ ["--d" as string]: n % 6 }} className="group flex flex-col rounded-[28px] p-4 sm:p-5" >
              <div className="grid aspect-square place-items-center rounded-[22px] p-[18%] transition-transform duration-700 ease-[var(--ease-juicy)] group-hover:-rotate-6 group-hover:scale-105" style={{ background: i.bg }}>
                {i.art}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold">{i.name}</h3>
              <p className="mt-1 text-sm leading-snug text-ink-soft">{i.drinks}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16" data-reveal>
          <SqueezeMoment />
        </div>
      </div>
    </section>
  );
}
