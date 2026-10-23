import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { C, FONT_BODY, FONT_DISPLAY, FONT_MONO, img, showcaseDrinks, type Drink } from "./brand";
import { CitrusSlice, Wordmark } from "./components/Marks";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const T = 12;
const DRINK = 72;

/** Readable text on any drink color. */
const textOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.32 ? C.ink : C.cream;
};

const directions = ["from-left", "from-bottom", "from-right", "from-top"] as const;

/** Video B: a fast, color-blocked run through the signature drinks. */
export const Showcase: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={48}>
      <Intro />
    </TransitionSeries.Sequence>
    {showcaseDrinks.flatMap((d, i) => [
      i % 2 ? (
        <TransitionSeries.Transition key={`t-${d.id}`} presentation={slide({ direction: directions[i % 4] })} timing={linearTiming({ durationInFrames: T, easing: out })} />
      ) : (
        <TransitionSeries.Transition key={`t-${d.id}`} presentation={wipe({ direction: directions[i % 4] })} timing={linearTiming({ durationInFrames: T, easing: out })} />
      ),
      <TransitionSeries.Sequence key={d.id} name={d.name} durationInFrames={DRINK}>
        <DrinkScene drink={d} index={i} />
      </TransitionSeries.Sequence>,
    ])}
    <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T, easing: out })} />
    <TransitionSeries.Sequence name="Outro" durationInFrames={78}>
      <Outro />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

export const SHOWCASE_FRAMES = 48 + showcaseDrinks.length * DRINK + 78 - (showcaseDrinks.length + 1) * T;

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 170, letterSpacing: "-0.04em", color: C.cream, display: "flex", gap: 40 }}>
        {["Five", "signatures."].map((w, i) => (
          <span key={w} style={{ opacity: interpolate(frame, [4 + i * 8, 16 + i * 8], [0, 1], clamp), translate: `0px ${interpolate(frame, [4 + i * 8, 22 + i * 8], [80, 0], { ...clamp, easing: out })}px`, color: i ? C.mango : C.cream }}>
            {w}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const DrinkScene: React.FC<{ drink: Drink; index: number }> = ({ drink, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fg = textOn(drink.color);
  const reveal = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  const letters = drink.name.split("");
  return (
    <AbsoluteFill style={{ background: drink.color, overflow: "hidden" }}>
      {/* giant outlined name drifting behind */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 0,
          whiteSpace: "nowrap",
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 300,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: `3px ${drink.deep}`,
          opacity: 0.35,
          translate: `${interpolate(frame, [0, DRINK], [80, -260])}px 0px`,
        }}
      >
        {drink.name} {drink.name}
      </div>
      <div style={{ position: "absolute", right: 150, top: 150, width: 780, height: 780, borderRadius: "50%", overflow: "hidden", clipPath: `circle(${interpolate(reveal, [0, 1], [0, 72])}% at 50% 50%)` }}>
        <Img src={img(`products/${drink.id}.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, DRINK], [1.12, 1.02])) }} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 120, width: 170, rotate: `${interpolate(frame, [0, DRINK], [-30, 60])}deg`, opacity: interpolate(reveal, [0.4, 1], [0, 1], clamp) }}>
        <CitrusSlice color={drink.color} rind={drink.deep} style={{ width: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 130, top: 330, width: 820, color: fg }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 30, letterSpacing: "0.16em", opacity: interpolate(frame, [4, 14], [0, 1], clamp) }}>
          {String(index + 1).padStart(2, "0")} / {String(showcaseDrinks.length).padStart(2, "0")}
        </div>
        <div style={{ marginTop: 18, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.92, letterSpacing: "-0.035em" }}>
          {letters.map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: interpolate(frame, [6 + i * 1.2, 14 + i * 1.2], [0, 1], clamp),
                translate: `0px ${interpolate(frame, [6 + i * 1.2, 20 + i * 1.2], [70, 0], { ...clamp, easing: out })}px`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 28, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 40, opacity: interpolate(frame, [22, 34], [0, 0.92], clamp) }}>{drink.tagline}</div>
        <div
          style={{
            marginTop: 36,
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: 999,
            background: fg,
            color: drink.color,
            fontFamily: FONT_MONO,
            fontSize: 32,
            opacity: interpolate(frame, [30, 40], [0, 1], clamp),
            scale: String(interpolate(frame, [30, 40], [0.8, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })),
          }}
        >
          from {drink.from}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 14, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: C.pulp, alignItems: "center", justifyContent: "center", gap: 50 }}>
      <div style={{ display: "flex", gap: 22 }}>
        {showcaseDrinks.map((d, i) => (
          <div key={d.id} style={{ width: 70, height: 70, borderRadius: 999, background: d.color, scale: String(spring({ frame: frame - i * 3, fps, config: { damping: 12 } })) }} />
        ))}
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, letterSpacing: "-0.035em", color: C.ink, opacity: interpolate(frame, [8, 20], [0, 1], clamp) }}>
        Fifteen drinks. Pick a color.
      </div>
      <div style={{ scale: String(interpolate(pop, [0, 1], [0.7, 1])), opacity: pop }}>
        <Wordmark size={120} />
      </div>
    </AbsoluteFill>
  );
};
