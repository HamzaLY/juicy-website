"use client";

import { useEffect, useRef } from "react";

// Must match the CSS gate in app/globals.css character for character.
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

type Band = { a: number; b: number };
const BANDS: Band[] = [
  { a: 0, b: 0.3 },
  { a: 0.34, b: 0.62 },
  { a: 0.68, b: 1 },
];

const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The 10K scroll-scrubbed hero: the video's time follows scroll progress through a pinned stage.
 * Blob fetch (works on hosts without Range support), dt-normalized lerp, gated seeks,
 * delta-gated DOM writes, live static-hero gates, and a page that is complete without the video.
 */
export function HeroScrub({ video, poster, bytes, sub }: { video: string; poster: string; bytes: number; sub: string }) {
  const root = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const posterLayer = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = root.current!;
    const v = vid.current!;
    const bandEls = [...section.querySelectorAll<HTMLElement>("[data-band]")];
    const cache = bandEls.map(() => ({ op: -1, k: -1 }));
    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let onScreen = true;
    let seekBusy = false;
    let pending: number | null = null;
    let started = false;
    let scrubOn = false;
    let objectUrl = "";
    const loadStart = performance.now();

    const progress = () => {
      const r = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
    };

    const requestSeek = (t: number) => {
      if (!v.duration || Number.isNaN(v.duration)) return;
      if (seekBusy) {
        pending = t;
        return;
      }
      seekBusy = true;
      v.currentTime = t;
    };
    const onSeeked = () => {
      seekBusy = false;
      if (pending !== null) {
        const t = pending;
        pending = null;
        requestSeek(t);
      }
    };
    const onError = () => {
      seekBusy = false;
      pending = null;
      section.classList.add("video-failed");
    };
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("error", onError);

    const updateBands = (p: number, now: number) => {
      BANDS.forEach((band, i) => {
        const { a, b } = band;
        const f = Math.min(0.02, (b - a) / 3);
        const inEase = i === 0 ? 1 : smoothstep(p, a, a + f);
        const outEase = i === BANDS.length - 1 ? 1 : 1 - smoothstep(p, b - f, b);
        const op = Math.round(inEase * outEase * 1000) / 1000;
        let k = clamp((p - a) / Math.min(0.025, (b - a) * 0.35), 0, 1);
        if (i === 0) k = Math.max(k, clamp((now - loadStart) / 1200, 0, 1));
        const el = bandEls[i];
        if (Math.abs(cache[i].op - op) > 0.004) {
          cache[i].op = op;
          el.style.opacity = String(op);
          el.style.visibility = op < 0.01 ? "hidden" : "visible";
        }
        if (Math.abs(cache[i].k - k) > 0.008) {
          cache[i].k = k;
          el.style.setProperty("--k", k.toFixed(3));
        }
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667));
      const loadRamping = now - loadStart < 1300;
      if (Math.abs(target - shown) < 0.0005 && !loadRamping) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      requestSeek(shown * (v.duration || 0));
      updateBands(shown, now);
    };

    const onScroll = () => {
      target = progress();
      if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) onScroll();
    });
    io.observe(section);

    const fail = () => {
      section.classList.add("video-failed");
    };

    const loadBlob = async () => {
      const ctrl = new AbortController();
      let watchdog = setTimeout(() => ctrl.abort(), 20000);
      try {
        const res = await fetch(video, { signal: ctrl.signal, priority: "low" } as RequestInit);
        if (!res.ok || !res.body) throw new Error(String(res.status));
        const total = Number(res.headers.get("Content-Length")) || bytes || 1;
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let got = 0;
        let lastRing = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          clearTimeout(watchdog);
          watchdog = setTimeout(() => ctrl.abort(), 20000);
          chunks.push(value);
          got += value.length;
          const now = performance.now();
          if (now - lastRing > 100) {
            lastRing = now;
            ring.current?.style.setProperty("--ld", String(Math.round(126 * (1 - Math.min(1, got / total)))));
          }
        }
        clearTimeout(watchdog);
        ring.current?.style.setProperty("--ld", "0");
        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
        v.src = objectUrl;
        v.load();
        v.addEventListener(
          "canplay",
          () => {
            requestSeek(progress() * v.duration);
            section.classList.add("video-ready");
          },
          { once: true },
        );
      } catch {
        clearTimeout(watchdog);
        fail();
      }
    };

    const initOnce = () => {
      if (started) return;
      started = true;
      posterLayer.current!.style.backgroundImage = `url('${poster}')`;
      const img = new Image();
      let kicked = false;
      const go = () => {
        if (kicked) return;
        kicked = true;
        loadBlob();
      };
      img.onload = go;
      img.onerror = go;
      img.src = poster;
      setTimeout(go, 4000);
    };

    const enable = () => {
      if (scrubOn) return;
      scrubOn = true;
      initOnce();
      window.addEventListener("scroll", onScroll, { passive: true });
      cache.forEach((c) => {
        c.op = -1;
        c.k = -1;
      });
      onScroll();
    };
    const disable = () => {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };
    const apply = () => (GATES.some((q) => window.matchMedia(q).matches) ? disable() : enable());
    const mqls = GATES.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener("change", apply));
    apply();

    return () => {
      disable();
      io.disconnect();
      mqls.forEach((m) => m.removeEventListener("change", apply));
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("error", onError);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [video, poster, bytes]);

  return (
    <div ref={root} className="hero-scrub group/scrub relative h-[420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#F6D3B4]">
        <div ref={posterLayer} className="absolute inset-0 bg-cover bg-center" aria-hidden="true" />
        <video
          ref={vid}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 [transform:translateZ(0)] group-[.video-ready]/scrub:opacity-100 group-[.video-failed]/scrub:hidden"
        />
        {/* base wash: lifts the side lanes where the type lives */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,240,226,0.5)_0%,rgba(255,240,226,0)_36%,rgba(255,240,226,0)_64%,rgba(255,240,226,0.5)_100%)]" aria-hidden="true" />

        {/* The glass sits dead center in the footage, so every band lives in the side lanes. */}
        <div data-band className="band absolute inset-y-0 left-0 flex w-[40%] items-center pl-[max(2.5rem,calc((100vw-1280px)/2+2rem))] pr-4">
          <div className="band-scrim relative">
            <p className="kicker band-word text-orange-deep" style={{ ["--t" as string]: 0 }}>
              Fresh-pressed drinks, made to order
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,5.4vw,5.8rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink">
              <span className="sr-only">A little more juice. A lot more joy.</span>
              <span aria-hidden="true">
                {"A little more juice.".split(" ").map((w, i) => (
                  <span key={i} className="band-word mr-[0.22em] inline-block" style={{ ["--t" as string]: 0.1 + i * 0.12 }}>
                    {w}
                  </span>
                ))}
              </span>
            </h1>
          </div>
        </div>

        <div data-band className="band invisible absolute inset-y-0 right-0 flex w-[34%] items-center justify-end pl-4 pr-[max(2.5rem,calc((100vw-1280px)/2+2rem))] opacity-0" aria-hidden="true">
          <p className="band-scrim relative font-display text-[clamp(2.2rem,4vw,4.2rem)] font-extrabold leading-[0.95] text-ink">
            {"Pressed when you order. Poured while it's cold.".split(" ").map((w, i) => (
              <span key={i} className="band-drop mr-[0.22em] inline-block" style={{ ["--t" as string]: i * 0.08 }}>
                {w}
              </span>
            ))}
          </p>
        </div>

        <div data-band className="band invisible absolute inset-y-0 left-0 flex w-[40%] items-center pl-[max(2.5rem,calc((100vw-1280px)/2+2rem))] pr-4 opacity-0">
          <div className="band-scrim relative">
            <p aria-hidden="true" className="font-display text-[clamp(2.8rem,5.4vw,5.8rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink">
              {"A lot more joy.".split(" ").map((w, i) => (
                <span key={i} className="band-word mr-[0.22em] inline-block" style={{ ["--t" as string]: i * 0.12 }}>
                  {w}
                </span>
              ))}
            </p>
            <p className="band-late mt-4 max-w-[32ch] text-lg font-medium text-ink-soft">{sub}</p>
            <div className="band-later mt-6 flex flex-wrap gap-3">
              <a href="#menu" className="btn btn-primary">
                Explore Our Drinks
              </a>
              <a href="#signatures" className="btn btn-ghost text-ink">
                Order Your Favorite
              </a>
            </div>
          </div>
        </div>

        <svg ref={ring} className="absolute bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 text-ink transition-opacity duration-500 group-[.video-ready]/scrub:opacity-0 group-[.video-failed]/scrub:opacity-0" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" style={{ strokeDashoffset: "var(--ld,126)" }} transform="rotate(-90 24 24)" />
        </svg>
      </div>
    </div>
  );
}
