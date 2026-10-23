"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { films } from "@/content/media";

/**
 * The Remotion films. Never autoplay and carry no audio. One plays at a time; switching films
 * or scrolling away pauses playback. Phones get the lighter 720p file.
 */
export function Film() {
  const [active, setActive] = useState(0);
  const film = films[active];
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !v.paused) v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [active]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  const choose = (i: number) => {
    video.current?.pause();
    setPlaying(false);
    setActive(i);
  };

  return (
    <section id="film" aria-labelledby="film-title" className="relative bg-pulp pb-24 pt-8 sm:pb-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-reveal>
            <p className="kicker text-orange-deep">The films</p>
            <h2 id="film-title" className="mt-3 max-w-[18ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              {film.caption}
            </h2>
          </div>
          {films.length > 1 && (
            <div role="group" aria-label="Choose a film" className="flex flex-wrap gap-2" data-reveal>
              {films.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => choose(i)}
                  className={`min-h-11 rounded-full px-4 text-[0.95rem] font-medium transition-colors ${i === active ? "bg-ink text-pulp" : "bg-pulp-deep text-ink hover:bg-pulp-line"}`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[36px] bg-rind" data-reveal>
          {film.src ? (
            <>
              <video
                key={film.id}
                ref={video}
                poster={film.poster}
                muted
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                aria-label={`${film.title}: ${film.caption}`}
              >
                {film.srcMobile && <source src={film.srcMobile} type="video/mp4" media="(max-width: 720px)" />}
                <source src={film.src} type="video/mp4" />
              </video>
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? `Pause the ${film.title.toLowerCase()}` : `Play the ${film.title.toLowerCase()}`}
                className={`group absolute inset-0 grid place-items-center transition-opacity duration-500 ${playing ? "opacity-0 hover:opacity-100 focus-visible:opacity-100" : "opacity-100"}`}
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-orange text-ink shadow-2xl transition-transform duration-500 ease-[var(--ease-juicy)] group-hover:scale-110 sm:h-24 sm:w-24">
                  {playing ? <Pause className="h-8 w-8" aria-hidden="true" /> : <Play className="ml-1 h-8 w-8" aria-hidden="true" />}
                </span>
              </button>
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-cream">
              {film.poster && <Image src={film.poster} alt="" fill sizes="(max-width: 1280px) 92vw, 1216px" className="object-cover opacity-80" />}
              <p className="relative rounded-full bg-rind/80 px-4 py-2 font-mono text-sm backdrop-blur">This film is still being rendered.</p>
            </div>
          )}
        </div>
        <p className="mt-3 font-mono text-xs text-ink-soft">Made with Remotion. Silent, and they only play when you press play.</p>
      </div>
    </section>
  );
}
