import React from "react";
import { C, FONT_DISPLAY } from "../brand";

const r2 = (n: number) => Math.round(n * 100) / 100;

export const CitrusSlice: React.FC<{ color?: string; rind?: string; style?: React.CSSProperties }> = ({ color = "#FF8A1F", rind, style }) => (
  <svg viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="48" fill={rind ?? color} />
    <circle cx="50" cy="50" r="42" fill="#FFF4DA" />
    <circle cx="50" cy="50" r="38" fill={color} opacity="0.92" />
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i * Math.PI) / 5;
      return <line key={i} x1="50" y1="50" x2={r2(50 + 38 * Math.cos(a))} y2={r2(50 + 38 * Math.sin(a))} stroke="#FFF4DA" strokeWidth="2.6" />;
    })}
    <circle cx="50" cy="50" r="5" fill="#FFF4DA" />
  </svg>
);

export const Droplet: React.FC<{ color?: string; style?: React.CSSProperties }> = ({ color = C.orange, style }) => (
  <svg viewBox="0 0 24 32" style={style}>
    <path d="M12 1c4.4 6.3 10 12.2 10 18.8a10 10 0 0 1-20 0C2 13.2 7.6 7.3 12 1Z" fill={color} />
    <ellipse cx="8.4" cy="17" rx="2" ry="3.2" fill={C.mango} opacity=".9" />
  </svg>
);

/** The JUICY wordmark: live type plus the droplet, exactly as on the site. */
export const Wordmark: React.FC<{ size: number; color?: string; dropScale?: number }> = ({ size, color = C.ink, dropScale = 1 }) => (
  <div style={{ display: "flex", alignItems: "flex-start", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1, color, fontStretch: "85%", letterSpacing: "-0.02em" }}>
    <span>JUICY</span>
    <Droplet style={{ height: size * 0.5, marginLeft: size * 0.06, marginTop: -size * 0.08, scale: String(dropScale), transformOrigin: "50% 100%" }} />
  </div>
);

/** A liquid surface band: the site's signature "fill line". */
export const Wave: React.FC<{ color: string; offset: number; height?: number; style?: React.CSSProperties }> = ({ color, offset, height = 80, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, height, overflow: "hidden", ...style }}>
    <div style={{ display: "flex", width: "200%", translate: `${-offset % 50}% 0` }}>
      {[0, 1].map((k) => (
        <svg key={k} viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "50%", height }}>
          <path d="M0 30 C 120 12, 240 12, 360 26 S 600 44, 720 28 S 960 10, 1080 24 S 1320 40, 1440 30 V60 H0 Z" fill={color} />
        </svg>
      ))}
    </div>
  </div>
);

/** Seeded droplets that burst outward from a point, driven by progress 0..1. */
export const DropletBurst: React.FC<{ progress: number; x: number; y: number; color: string; count?: number; spread?: number; seed?: number }> = ({
  progress,
  x,
  y,
  color,
  count = 18,
  spread = 520,
  seed = 7,
}) => {
  let s = seed;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = rnd() * Math.PI * 2;
        const d = spread * (0.35 + rnd() * 0.65);
        const size = 10 + rnd() * 26;
        const t = Math.min(1, Math.max(0, progress));
        const ease = 1 - Math.pow(1 - t, 3);
        const gravity = t * t * 160;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d * ease - size / 2,
              top: y + Math.sin(a) * d * ease + gravity - size / 2,
              width: size,
              height: size * 1.25,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: color,
              opacity: t < 0.05 ? t * 20 : 1 - Math.max(0, (t - 0.6) / 0.4),
            }}
          />
        );
      })}
    </>
  );
};
