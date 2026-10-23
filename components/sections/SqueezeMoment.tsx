"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Glass } from "@/components/visual/Glass";
import { CitrusSlice } from "@/components/visual/Fruit";

const STEPS = ["Picked", "Pressed", "Poured", "Filled to the line"];
const HOLD_MS = 1600;

/**
 * The interactive moment: press and hold to squeeze an orange and fill the glass to the line.
 * Letting go early eases the juice back down. Keyboard: hold Space or Enter. Reduced motion: one press fills it.
 */
export function SqueezeMoment() {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const holding = useRef(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const value = useRef(0);
  const reduced = useRef(false);

  const finish = () => {
    value.current = 1;
    setP(1);
    setDone(true);
    holding.current = false;
  };

  // Reduced motion switched on mid-visit: show the finished state instead of animating.
  const onReducedChange = useEffectEvent((e: MediaQueryListEvent) => {
    reduced.current = e.matches;
    if (e.matches) finish();
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    mq.addEventListener("change", onReducedChange);
    return () => {
      mq.removeEventListener("change", onReducedChange);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const loop = (now: number) => {
    const dt = Math.min(64, now - (last.current || now));
    last.current = now;
    const v = holding.current ? value.current + dt / HOLD_MS : value.current - dt / (HOLD_MS * 0.7);
    value.current = Math.max(0, Math.min(1, v));
    setP(value.current);
    if (value.current >= 1) {
      finish();
      raf.current = null;
      return;
    }
    if (value.current <= 0 && !holding.current) {
      raf.current = null;
      last.current = 0;
      return;
    }
    raf.current = requestAnimationFrame(loop);
  };

  const start = () => {
    if (done) return;
    if (reduced.current) return finish();
    holding.current = true;
    if (raf.current === null) {
      last.current = 0;
      raf.current = requestAnimationFrame(loop);
    }
  };
  const stop = () => {
    holding.current = false;
    if (!done && raf.current === null && value.current > 0) raf.current = requestAnimationFrame(loop);
  };
  const reset = () => {
    value.current = 0;
    setP(0);
    setDone(false);
  };

  const fill = 0.06 + p * 0.84;
  const litSteps = done ? STEPS.length : Math.floor(p * STEPS.length);

  return (
    <div className="relative overflow-hidden rounded-[36px] bg-mango p-6 sm:p-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto flex h-[300px] w-full max-w-[300px] items-end justify-center sm:h-[340px]">
          <div
            className="absolute left-1/2 top-0 w-[44%] -translate-x-1/2 transition-transform duration-150"
            style={{ transform: `translateX(-50%) scale(${1 - p * 0.22}, ${1 - p * 0.32}) rotate(${p * 12}deg)` }}
            aria-hidden="true"
          >
            <CitrusSlice />
          </div>
          {/* the pour */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[30%] w-2 -translate-x-1/2 rounded-full bg-orange transition-opacity"
            style={{ height: `${28 + (1 - fill) * 30}%`, opacity: p > 0.02 && !done ? 1 : 0 }}
          />
          <Glass color="#FF8A1F" deep="#8A3A00" fill={fill} ice className="relative h-[66%] w-auto" title={`Glass ${Math.round(p * 100)} percent full`} />
        </div>

        <div>
          <p className="kicker text-ink">Try it</p>
          <h3 className="mt-2 font-display text-3xl font-extrabold leading-[0.95] sm:text-4xl">{done ? "Filled to the line." : "Squeeze one for yourself."}</h3>
          <ol className="mt-5 grid grid-cols-2 gap-2" aria-label="How every drink is made">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={`rounded-2xl px-3 py-2.5 text-[0.95rem] font-semibold transition-[background-color,color,transform] duration-500 ${
                  i < litSteps ? "bg-ink text-mango" : "bg-ink/10 text-ink/70"
                }`}
                style={{ transitionDelay: done ? `${i * 90}ms` : "0ms" }}
              >
                <span className="mr-1.5 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
          {done ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#menu" className="btn btn-primary">
                Order the real thing
              </a>
              <button type="button" onClick={reset} className="btn btn-ghost">
                Squeeze again
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn mt-6 w-full select-none bg-ink text-pulp sm:w-auto"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                start();
              }}
              onPointerUp={stop}
              onPointerCancel={stop}
              onPointerLeave={stop}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                  e.preventDefault();
                  start();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") stop();
              }}
              onContextMenu={(e) => e.preventDefault()}
              aria-describedby="squeeze-hint"
            >
              Press and hold to squeeze
            </button>
          )}
          <p id="squeeze-hint" className="mt-2 text-sm text-ink/75" aria-live="polite">
            {done ? "Pressed, poured and right at the line." : p > 0 ? `${Math.round(p * 100)}% full. Keep holding.` : "Hold the button (or Space) until the glass reaches the line."}
          </p>
        </div>
      </div>
    </div>
  );
}
