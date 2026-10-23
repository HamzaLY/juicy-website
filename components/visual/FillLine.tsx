/**
 * The signature element: a liquid surface between sections, filled with the next section's color.
 * Place it at the top of a section; `color` is that section's background.
 */
export function FillLine({ color, className = "", flip = false }: { color: string; className?: string; flip?: boolean }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none relative h-10 w-full overflow-hidden sm:h-14 ${className}`} style={{ transform: flip ? "scaleY(-1)" : undefined }}>
      <div className="motion-decor absolute inset-y-0 left-0 flex w-[200%]" style={{ animation: "wave 18s linear infinite", animationDelay: "-6s" }}>
        <Wave color={color} opacity={0.45} />
        <Wave color={color} opacity={0.45} />
      </div>
      <div className="absolute inset-y-0 left-0 flex w-[200%]" style={{ animation: "wave 11s linear infinite reverse", animationDelay: "-3s" }}>
        <Wave color={color} offset />
        <Wave color={color} offset />
      </div>
    </div>
  );
}

function Wave({ color, opacity = 1, offset = false }: { color: string; opacity?: number; offset?: boolean }) {
  const d = offset
    ? "M0 30 C 120 12, 240 12, 360 26 S 600 44, 720 28 S 960 10, 1080 24 S 1320 40, 1440 30 V60 H0 Z"
    : "M0 22 C 160 40, 280 40, 420 26 S 660 6, 800 20 S 1080 42, 1220 28 S 1380 14, 1440 22 V60 H0 Z";
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="h-full w-1/2 shrink-0">
      <path d={d} fill={color} opacity={opacity} />
    </svg>
  );
}
