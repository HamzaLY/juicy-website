import Image from "next/image";
import { heroMedia } from "@/content/media";
import { Glass } from "@/components/visual/Glass";
import { CitrusSlice, MelonWedge, MintLeaf, Strawberry } from "@/components/visual/Fruit";
import { HeroScrub } from "./HeroScrub";

const SUB = "Fifteen fresh drinks, each one its own color. Pick yours, set the sweetness, and we fill it to the line.";

export function Hero() {
  const hasScrub = Boolean(heroMedia.video && heroMedia.poster);
  return (
    <section id="top" aria-label="Welcome to JUICY" className="relative">
      {hasScrub && <HeroScrub video={heroMedia.video!} poster={heroMedia.poster!} bytes={heroMedia.videoBytes ?? 0} sub={SUB} />}
      <StaticHero hidden={hasScrub} />
    </section>
  );
}

/** The composed hero for phones, reduced motion, no-JS and any visitor without the video. */
function StaticHero({ hidden }: { hidden: boolean }) {
  return (
    <div className={`hero-static relative isolate overflow-hidden bg-pulp ${hidden ? "hero-static--gated" : ""}`} data-living>
      <Bubbles />
      <div className="mx-auto grid min-h-[100svh] max-w-[1280px] items-center gap-6 px-5 pb-16 pt-[calc(var(--nav-h)+28px)] sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-10">
        <div className="relative z-10 max-w-[640px]">
          <p className="kicker hero-in text-orange-deep" style={{ ["--i" as string]: 0 }}>
            Fresh-pressed drinks, made to order
          </p>
          <h1 id="hero-title" className="mt-5 font-display text-[clamp(3.1rem,8.4vw,7.4rem)] font-extrabold leading-[0.88] tracking-[-0.035em]" style={{ fontVariationSettings: '"opsz" 96, "wdth" 88' }}>
            <span className="mask-line">
              <span className="hero-in block" style={{ ["--i" as string]: 1 }}>
                A little more juice.
              </span>
            </span>
            <span className="mask-line">
              <span className="hero-in block" style={{ ["--i" as string]: 2 }}>
                A lot more <span className="text-orange">joy.</span>
              </span>
            </span>
          </h1>
          <p className="hero-in mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-soft sm:text-xl" style={{ ["--i" as string]: 3 }}>
            {SUB}
          </p>
          <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ ["--i" as string]: 4 }}>
            <a href="#menu" className="btn btn-primary">
              Explore Our Drinks
            </a>
            <a href="#signatures" className="btn btn-ghost">
              Order Your Favorite
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[1/1] w-full max-w-[620px] lg:max-w-none">
          {heroMedia.still ? (
            <div className="hero-in absolute inset-0 overflow-hidden rounded-[40px]" style={{ ["--i" as string]: 2 }}>
              <Image src={heroMedia.still} alt={heroMedia.stillAlt ?? ""} fill priority sizes="(max-width: 1024px) 92vw, 50vw" className="object-cover" />
            </div>
          ) : (
            <IllustratedComposition />
          )}
        </div>
      </div>
    </div>
  );
}

function IllustratedComposition() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="hero-in absolute left-1/2 top-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango" style={{ ["--i" as string]: 1 }} />
      <div className="hero-in absolute left-1/2 top-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD65C]" style={{ ["--i" as string]: 2 }} />
      <div className="absolute inset-x-0 bottom-[6%] flex items-end justify-center">
        <div className="hero-in -mr-[6%] w-[30%] -rotate-6" style={{ ["--i" as string]: 3 }}>
          <Glass color="#FF5A5F" deep="#8E1B22" fill={0.82} className="h-auto w-full drop-shadow-[0_24px_30px_rgb(142_27_34/0.25)]" />
        </div>
        <div className="hero-in relative z-10 w-[40%]" style={{ ["--i" as string]: 2 }}>
          <Glass color="#FF8A1F" deep="#8A3A00" fill={0.9} garnish="#FF8A1F" className="h-auto w-full drop-shadow-[0_30px_36px_rgb(138_58_0/0.3)]" />
        </div>
        <div className="hero-in -ml-[6%] w-[30%] rotate-6" style={{ ["--i" as string]: 4 }}>
          <Glass color="#D9EE6A" deep="#4D5A00" fill={0.86} className="h-auto w-full drop-shadow-[0_24px_30px_rgb(77_90_0/0.25)]" />
        </div>
      </div>
      <div className="float absolute left-[2%] top-[12%] w-[20%]" style={{ ["--f" as string]: "-1s" }}>
        <CitrusSlice className="w-full" />
      </div>
      <div className="float absolute right-[4%] top-[6%] w-[16%]" style={{ ["--f" as string]: "-3s" }}>
        <CitrusSlice color="#9BCB3C" rind="#4E8A1E" className="w-full rotate-12" />
      </div>
      <div className="float absolute bottom-[38%] right-[0%] w-[13%]" style={{ ["--f" as string]: "-2s" }}>
        <Strawberry className="w-full -rotate-12" />
      </div>
      <div className="float absolute bottom-[44%] left-[0%] w-[22%]" style={{ ["--f" as string]: "-4s" }}>
        <MelonWedge className="w-full rotate-[-18deg]" />
      </div>
      <div className="float absolute right-[24%] top-[2%] w-[8%]" style={{ ["--f" as string]: "-5s" }}>
        <MintLeaf className="w-full rotate-45" />
      </div>
    </div>
  );
}

function Bubbles() {
  const dots = [
    { l: "8%", s: 10, d: "14s", o: "-2s", dx: "18px" },
    { l: "22%", s: 6, d: "18s", o: "-9s", dx: "-12px" },
    { l: "41%", s: 14, d: "22s", o: "-4s", dx: "10px" },
    { l: "57%", s: 8, d: "16s", o: "-12s", dx: "-20px" },
    { l: "72%", s: 12, d: "20s", o: "-6s", dx: "14px" },
    { l: "88%", s: 7, d: "15s", o: "-1s", dx: "-8px" },
  ];
  return (
    <div className="motion-decor pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {dots.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-20px] rounded-full border-2 border-orange/25"
          style={{ left: b.l, width: b.s, height: b.s, animation: `rise ${b.d} linear infinite`, animationDelay: b.o, ["--dx" as string]: b.dx }}
        />
      ))}
    </div>
  );
}
