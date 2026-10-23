import { useId } from "react";

type GlassProps = {
  color: string;
  deep: string;
  /** 0 to 1. The dashed fill line sits at 0.9. */
  fill?: number;
  ice?: boolean;
  garnish?: string;
  className?: string;
  title?: string;
};

/**
 * The illustrated JUICY glass. Used wherever a drink has no photo yet, and as a brand motif.
 * Pure SVG, tinted by the drink's own color.
 */
export function Glass({ color, deep, fill = 0.9, ice = true, garnish, className = "", title }: GlassProps) {
  const id = useId().replace(/:/g, "");
  const top = 18;
  const bottom = 192;
  const level = bottom - (bottom - top - 8) * Math.max(0, Math.min(1, fill));
  const lineY = bottom - (bottom - top - 8) * 0.9;
  // Glass walls taper from 16..104 at the rim to 26..94 at the base.
  const xAt = (y: number, side: "l" | "r") => {
    const t = (y - top) / (bottom - top);
    return side === "l" ? 16 + 10 * t : 104 - 10 * t;
  };

  return (
    <svg viewBox="0 0 120 210" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`liq-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={deep} stopOpacity="0" />
          <stop offset="1" stopColor={deep} stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`inside-${id}`}>
          <path d={`M17 ${top + 2} L103 ${top + 2} L93.5 ${bottom - 3} Q60 ${bottom + 4} 26.5 ${bottom - 3} Z`} />
        </clipPath>
      </defs>

      {/* shadow */}
      <ellipse cx="60" cy="203" rx="40" ry="5" fill={deep} opacity="0.18" />

      <g clipPath={`url(#inside-${id})`}>
        <rect x="0" y={level} width="120" height={bottom - level + 10} fill={color} />
        <rect x="0" y={level} width="120" height={bottom - level + 10} fill={`url(#liq-${id})`} />
        {/* meniscus */}
        <path d={`M0 ${level} Q30 ${level - 3} 60 ${level} T120 ${level} V${level + 6} H0 Z`} fill="#fff" opacity="0.28" />
        {ice && fill > 0.25 && (
          <g opacity="0.55">
            <rect x="28" y={level + 4} width="26" height="24" rx="6" fill="#fff" opacity="0.5" transform={`rotate(-12 41 ${level + 16})`} />
            <rect x="60" y={level + 10} width="24" height="22" rx="6" fill="#fff" opacity="0.4" transform={`rotate(14 72 ${level + 21})`} />
            <rect x="40" y={level + 36} width="22" height="20" rx="5" fill="#fff" opacity="0.3" transform={`rotate(6 51 ${level + 46})`} />
          </g>
        )}
        {/* bubbles */}
        <g fill="#fff" opacity="0.45">
          <circle cx="36" cy={Math.min(bottom - 14, level + 70)} r="2" />
          <circle cx="78" cy={Math.min(bottom - 10, level + 92)} r="1.6" />
          <circle cx="66" cy={Math.min(bottom - 20, level + 120)} r="1.2" />
        </g>
      </g>

      {/* glass body */}
      <path
        d={`M14 ${top} L106 ${top} L95.5 ${bottom - 2} Q60 ${bottom + 6} 24.5 ${bottom - 2} Z`}
        fill={`url(#shine-${id})`}
        stroke={deep}
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      {/* fill line */}
      <line x1={xAt(lineY, "l") + 3} x2={xAt(lineY, "r") - 3} y1={lineY} y2={lineY} stroke={deep} strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 3" />
      {/* condensation */}
      <g fill="#fff" opacity="0.7">
        <ellipse cx="24" cy="70" rx="1.4" ry="2.2" />
        <ellipse cx="29" cy="112" rx="1.1" ry="1.8" />
        <ellipse cx="95" cy="88" rx="1.3" ry="2" />
        <ellipse cx="90" cy="140" rx="1" ry="1.6" />
      </g>
      {garnish && (
        <g transform="translate(92 14)">
          <circle r="15" fill={garnish} />
          <circle r="11.5" fill="#fff" opacity="0.35" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2={Math.round(1100 * Math.cos((i * Math.PI) / 4)) / 100} y2={Math.round(1100 * Math.sin((i * Math.PI) / 4)) / 100} stroke={garnish} strokeWidth="1.2" />
          ))}
        </g>
      )}
    </svg>
  );
}
