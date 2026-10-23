"use client";

import { useEffect } from "react";

/**
 * Site-wide motion hygiene:
 * - pauses every CSS loop while the tab is hidden
 * - pauses loops inside [data-living] sections while they are off-screen
 * - reveals [data-reveal] elements as they enter the viewport
 */
export function PageEffects() {
  useEffect(() => {
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    const living = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("offscreen", !e.isIntersecting)),
      { rootMargin: "120px" },
    );
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            reveal.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll("[data-living]").forEach((el) => living.observe(el));
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => reveal.observe(el));
    };
    scan();
    // Sections that mount later (dialogs, filtered grids) get picked up too.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      living.disconnect();
      reveal.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
