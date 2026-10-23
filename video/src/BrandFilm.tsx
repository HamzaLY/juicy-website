import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { C, FONT_BODY, FONT_DISPLAY, FONT_MONO, img, showcaseDrinks } from "./brand";
import { CitrusSlice, DropletBurst, Wave, Wordmark } from "./components/Marks";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Video A: the hero brand film. Citrus arrives, a glass fills, the colors line up, JUICY closes. */
export const BrandFilm: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Citrus arrives" durationInFrames={80}>
      <CitrusScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 16, easing: out })} />
    <TransitionSeries.Sequence name="The pour" durationInFrames={110}>
      <FillScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Every color" durationInFrames={95}>
      <ColorsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 16, easing: out })} />
    <TransitionSeries.Sequence name="JUICY" durationInFrames={78}>
      <CloseScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

export const BRAND_FILM_FRAMES = 80 + 110 + 95 + 78 - 16 - 15 - 16;

const CitrusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const arrive = spring({ frame, fps, config: { damping: 14, mass: 0.9 } });
  const squeeze = interpolate(frame, [38, 46, 58], [1, 0.82, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: C.mango, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #FFD65C 0%, rgba(255,214,92,0) 55%)" }} />
      <DropletBurst progress={interpolate(frame, [42, 80], [0, 1], clamp)} x={width / 2} y={height / 2} color={C.orange} count={26} spread={700} />
      <DropletBurst progress={interpolate(frame, [44, 80], [0, 1], clamp)} x={width / 2} y={height / 2} color="#FFF4DA" count={12} spread={520} seed={31} />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 260,
          top: height / 2 - 260,
          width: 520,
          height: 520,
          translate: `${interpolate(arrive, [0, 1], [-1400, 0])}px 0px`,
          rotate: `${interpolate(arrive, [0, 1], [-540, 0])}deg`,
          scale: `${squeeze} ${2 - squeeze}`,
        }}
      >
        <CitrusSlice style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 34,
          letterSpacing: "0.18em",
          color: C.ink,
          opacity: interpolate(frame, [20, 36], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [20, 36], [20, 0], { ...clamp, easing: out })}px`,
        }}
      >
        FRESH-PRESSED, MADE TO ORDER
      </div>
    </AbsoluteFill>
  );
};

const FillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [18, 82], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const words = ["Pressed", "when", "you", "order."];
  return (
    <AbsoluteFill style={{ background: C.pulp, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 110], [1.02, 1.12])) }}>
        <Img src={img("hero/hero-ice.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>
          <Img src={img("hero/hero-full.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(255,240,226,0.9) 0%, rgba(255,240,226,0.55) 28%, rgba(255,240,226,0) 48%)" }} />
      <div style={{ position: "absolute", left: 120, top: 330, width: 640, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9, letterSpacing: "-0.035em", color: C.ink }}>
        {words.map((w, i) => (
          <span
            key={w}
            style={{
              display: "inline-block",
              marginRight: 28,
              opacity: interpolate(frame, [10 + i * 7, 26 + i * 7], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [10 + i * 7, 30 + i * 7], [60, 0], { ...clamp, easing: out })}px`,
              color: i === 3 ? C.orange : C.ink,
            }}
          >
            {w}
          </span>
        ))}
        <div style={{ marginTop: 34, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 40, letterSpacing: 0, lineHeight: 1.3, color: "#5C4A3E", opacity: interpolate(frame, [50, 66], [0, 1], clamp) }}>
          Poured while it&apos;s cold. Filled to the line.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ColorsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const picks = showcaseDrinks.slice(0, 4);
  return (
    <AbsoluteFill style={{ background: C.pulp, padding: "0 120px", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: "-0.03em", color: C.ink, opacity: interpolate(frame, [0, 14], [0, 1], clamp) }}>
        Every drink, its own color.
      </div>
      <div style={{ display: "flex", gap: 36, marginTop: 56 }}>
        {picks.map((d, i) => {
          const s = spring({ frame: frame - 8 - i * 6, fps, config: { damping: 16 } });
          return (
            <div key={d.id} style={{ flex: 1, translate: `0px ${interpolate(s, [0, 1], [500, 0])}px`, rotate: `${interpolate(s, [0, 1], [8 - i * 4, 0])}deg` }}>
              <div style={{ aspectRatio: "4 / 5", borderRadius: 40, overflow: "hidden", background: d.color }}>
                <Img src={img(`products/${d.id}.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 22, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, color: C.ink }}>{d.name}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 11, mass: 0.8 } });
  const rise = interpolate(frame, [0, 60], [height + 40, height - 210], { ...clamp, easing: out });
  return (
    <AbsoluteFill style={{ background: C.pulp, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Wave color={C.mango} offset={frame * 0.5} height={90} style={{ top: rise - 70, opacity: 0.6 }} />
      <Wave color={C.orange} offset={frame * 0.9 + 20} height={90} style={{ top: rise - 40 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: rise + 40, bottom: 0, background: C.orange }} />
      <div style={{ scale: String(interpolate(pop, [0, 1], [0.6, 1])), opacity: interpolate(pop, [0, 0.3], [0, 1], clamp), marginTop: -120 }}>
        <Wordmark size={260} dropScale={interpolate(frame, [10, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) })} />
      </div>
      <div style={{ position: "absolute", top: 640, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 46, color: "#5C4A3E", opacity: interpolate(frame, [22, 38], [0, 1], clamp) }}>
        Freshness in full color
      </div>
    </AbsoluteFill>
  );
};
