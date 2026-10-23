import { Hero } from "@/components/sections/Hero";
import { PromiseRibbon } from "@/components/sections/PromiseRibbon";
import { Signatures } from "@/components/sections/Signatures";
import { MenuSection } from "@/components/sections/MenuSection";
import { Story } from "@/components/sections/Story";
import { Freshness } from "@/components/sections/Freshness";
import { Seasonal } from "@/components/sections/Seasonal";
import { Film } from "@/components/sections/Film";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Hero />
      <PromiseRibbon />
      <Signatures />
      <MenuSection />
      <Story />
      <Freshness />
      <Seasonal />
      <Film />
      <Reviews />
      <Visit />
    </>
  );
}
