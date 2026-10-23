import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, FONT_MONO, img } from "./brand";
import { CitrusSlice, Wave, Wordmark } from "./components/Marks";

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Edit these (or the props in Remotion Studio) to make a new seasonal promo. */
export type SeasonalProps = {
  kicker: string;
  title: string;
  body: string;
  availability: string;
  cta: string;
  /** The drink's own color and its deep shade. */
  color: string;
  deep: string;
  /** Path under video/public/images. */
  image: string;
};

export const seasonalDefaults: SeasonalProps = {
  kicker: "SEASONAL SPECIAL",
  title: "Blood Orange Ember",
  body: "Ruby blood oranges, fresh ginger and a sprig of rosemary.",
  availability: "Only while blood oranges are in season",
  cta: "Try it this season",
  color: "#D7263D",
  deep: "#6A0F1C",
  image: "sections/seasonal-blood-orange.webp",
};

export const SEASONAL_FRAMES = 300;

/** Video C: a reusable limited-time promo. */
export const Seasonal: React.FC<SeasonalProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const titleWords = p.title.split(" ");
  const reveal = spring({ frame: frame - 70, fps, config: { damping: 20 } });
  const typed = Math.floor(interpolate(frame, [8, 8 + p.kicker.length * 1.4], [0, p.kicker.length], clamp));

  return (
    <AbsoluteFill style={{ background: p.deep, overflow: "hidden", color: C.cream }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 55%, ${p.color} 0%, rgba(0,0,0,0) 62%)`, opacity: interpolate(frame, [0, 60], [0.2, 0.9], clamp) }} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: [120, 160, 230][i],
            left: [60, 930, 1720][i],
            top: [60, 880, 40][i],
            rotate: `${frame * [0.6, -0.8, 1][i]}deg`,
            translate: `0px ${Math.sin((frame + i * 40) / 30) * 14}px`,
            opacity: 0.85,
          }}
        >
          <CitrusSlice color={p.color} rind="#E87A2E" style={{ width: "100%" }} />
        </div>
      ))}

      <div style={{ position: "absolute", left: 130, top: 210, width: 860 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 32, letterSpacing: "0.2em", color: C.mango }}>
          {p.kicker.slice(0, typed)}
          <span style={{ opacity: frame % 20 < 10 && typed < p.kicker.length ? 1 : 0 }}>▍</span>
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, lineHeight: 0.88, letterSpacing: "-0.04em" }}>
          {titleWords.map((w, i) => {
            const s = spring({ frame: frame - 26 - i * 7, fps, config: { damping: 9, mass: 0.7 } });
            return (
              <span key={i} style={{ display: "inline-block", marginRight: 30, opacity: interpolate(s, [0, 0.2], [0, 1], clamp), scale: String(interpolate(s, [0, 1], [1.8, 1])) }}>
                {w}
              </span>
            );
          })}
        </div>
        <Sequence from={95} layout="none">
          <Body {...p} />
        </Sequence>
      </div>

      <div
        style={{
          position: "absolute",
          right: 130,
          top: 170,
          width: 700,
          height: 740,
          borderRadius: 48,
          overflow: "hidden",
          clipPath: `circle(${interpolate(reveal, [0, 1], [0, 80])}% at 50% 60%)`,
          boxShadow: "0 50px 90px -40px rgba(0,0,0,0.6)",
        }}
      >
        <Img src={img(p.image)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [70, 300], [1.15, 1.02], clamp)) }} />
      </div>

      <Sequence from={215} layout="none">
        <Close {...p} width={width} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Body: React.FC<SeasonalProps> = (p) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ marginTop: 40, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 44, lineHeight: 1.3, maxWidth: 760, opacity: interpolate(frame, [0, 16], [0, 0.92], clamp), translate: `0px ${interpolate(frame, [0, 20], [30, 0], { ...clamp, easing: out })}px` }}>
        {p.body}
      </div>
      <div style={{ marginTop: 36, display: "inline-block", padding: "14px 26px", borderRadius: 999, border: `2px solid ${C.mango}`, fontFamily: FONT_MONO, fontSize: 28, color: C.mango, opacity: interpolate(frame, [18, 30], [0, 1], clamp) }}>
        {p.availability}
      </div>
    </>
  );
};

const Close: React.FC<SeasonalProps & { width: number }> = (p) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const rise = interpolate(frame, [0, 45], [height, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pop = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ translate: `0px ${rise}px` }}>
      <Wave color={p.color} offset={frame * 0.8} height={90} style={{ top: -80 }} />
      <AbsoluteFill style={{ background: p.color, alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, letterSpacing: "-0.035em", color: C.cream, opacity: interpolate(frame, [26, 40], [0, 1], clamp) }}>{p.cta}</div>
        <div style={{ scale: String(interpolate(pop, [0, 1], [0.6, 1])), opacity: pop }}>
          <Wordmark size={110} color={C.cream} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
