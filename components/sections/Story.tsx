"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storyMedia } from "@/content/media";
import { FillLine } from "@/components/visual/FillLine";
import { Glass } from "@/components/visual/Glass";
import { CitrusSlice, MintLeaf } from "@/components/visual/Fruit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const rules = [
  { n: "01", title: "Press it when they order.", body: "No jugs waiting in the fridge. The fruit goes into the press after you pay, not before." },
  { n: "02", title: "Let them choose the sweet.", body: "Pressed juice stays just fruit. Smoothies and refreshers come not sweetened, half sweet or full." },
  { n: "03", title: "Fill it to the line.", body: "Every cup has a line near the top. If your drink isn't at the line, it isn't finished." },
];

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The fill line draws itself down the rules as you read.
        gsap.fromTo(
          "[data-draw]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-rules]", start: "top 75%", end: "bottom 60%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, { opacity: 0.18, x: 24, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 80%", end: "top 55%", scrub: 0.6 } });
        });
        // Gentle parallax on the visual.
        gsap.fromTo("[data-parallax]", { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo("[data-float-a]", { y: 40, rotate: -20 }, { y: -60, rotate: 15, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="on-rind relative bg-rind pb-28 pt-20 text-cream sm:pb-36" data-living>
      <FillLine color="var(--rind)" className="absolute -top-10 left-0 sm:-top-14" />
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-rind-soft">
            <div data-parallax className="absolute inset-[-8%]">
              {storyMedia.main ? (
                <Image src={storyMedia.main} alt={storyMedia.mainAlt ?? ""} fill sizes="(max-width: 1024px) 92vw, 46vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_60%,#2F5A47_0%,#1C3D2F_60%)]">
                  <Glass color="#FF8A1F" deep="#8A3A00" fill={0.9} garnish="#FFC21A" className="h-[62%] w-auto" />
                </div>
              )}
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-rind/80 px-4 py-3 backdrop-blur">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-rind">The line</span>
              <span className="h-px flex-1 border-t-2 border-dashed border-mango/70 mx-3" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-mango">Full</span>
            </div>
          </div>
          <div data-float-a className="pointer-events-none absolute -right-6 -top-8 w-28 sm:w-36" aria-hidden="true">
            <CitrusSlice />
          </div>
          <div className="pointer-events-none absolute -bottom-6 -left-4 w-14 rotate-[-30deg]" aria-hidden="true">
            <MintLeaf />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:pt-10">
          <p className="kicker text-mango" data-reveal>
            Our story
          </p>
          <h2 id="story-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-3 font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
            We started with one line on a cup.
          </h2>
          <p data-reveal style={{ ["--d" as string]: 2 }} className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-rind">
            Too many juice bars hand over drinks that are too sweet, half ice, or a thumb short of the top. So we drew a line near the rim of every cup and built the whole shop around reaching it.
          </p>

          <div data-rules className="relative mt-12 pl-10">
            <svg className="absolute left-2 top-2 h-[calc(100%-1rem)] w-4" viewBox="0 0 16 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M8 0 V100" stroke="var(--rind-line)" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
              <path data-draw d="M8 0 V100" stroke="var(--mango)" strokeWidth="3" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset="0" vectorEffect="non-scaling-stroke" />
            </svg>
            <ol className="space-y-9">
              {rules.map((r) => (
                <li key={r.n} data-rule className="relative">
                  <span className="absolute -left-10 top-1 grid h-5 w-5 place-items-center rounded-full bg-mango ring-4 ring-rind" aria-hidden="true" />
                  <p className="font-mono text-sm text-mango">{r.n}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{r.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-muted-rind">{r.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
