/** Hand-drawn fruit marks for the vector layer. All decorative. */

// Rounded so server and browser math produce identical markup.
const r2 = (n: number) => Math.round(n * 100) / 100;

export function CitrusSlice({ color = "#FF8A1F", rind, className = "" }: { color?: string; rind?: string; className?: string }) {
  const r = rind ?? color;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill={r} />
      <circle cx="50" cy="50" r="42" fill="#FFF4DA" />
      <circle cx="50" cy="50" r="38" fill={color} opacity="0.92" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i * Math.PI) / 5;
        return <line key={i} x1="50" y1="50" x2={r2(50 + 38 * Math.cos(a))} y2={r2(50 + 38 * Math.sin(a))} stroke="#FFF4DA" strokeWidth="2.6" />;
      })}
      <circle cx="50" cy="50" r="5" fill="#FFF4DA" />
      <ellipse cx="34" cy="36" rx="7" ry="4" fill="#fff" opacity="0.35" transform="rotate(-35 34 36)" />
    </svg>
  );
}

export function MelonWedge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <path d="M4 8 A56 56 0 0 0 116 8 Z" fill="#2F8F3A" />
      <path d="M10 8 A50 50 0 0 0 110 8 Z" fill="#CFF0B0" />
      <path d="M15 8 A45 45 0 0 0 105 8 Z" fill="#FF5A5F" />
      {[30, 45, 60, 75, 90, 52, 68].map((x, i) => (
        <ellipse key={i} cx={x} cy={i > 4 ? 30 : 18} rx="2" ry="3.4" fill="#2A1A14" transform={`rotate(${(x - 60) / 2} ${x} 20)`} />
      ))}
    </svg>
  );
}

export function MintLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 90" className={className} aria-hidden="true">
      <path d="M30 4 C 56 24, 56 62, 30 86 C 4 62, 4 24, 30 4 Z" fill="#4FB54A" />
      <path d="M30 10 V 82" stroke="#2E7D32" strokeWidth="2" />
      {[24, 38, 52, 66].map((y) => (
        <g key={y} stroke="#2E7D32" strokeWidth="1.4" fill="none">
          <path d={`M30 ${y} Q 40 ${y - 6} 46 ${y - 12}`} />
          <path d={`M30 ${y} Q 20 ${y - 6} 14 ${y - 12}`} />
        </g>
      ))}
    </svg>
  );
}

export function Strawberry({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 90" className={className} aria-hidden="true">
      <path d="M40 86 C 10 70, 4 36, 16 26 C 26 18, 54 18, 64 26 C 76 36, 70 70, 40 86 Z" fill="#E8414F" />
      {[
        [28, 40], [42, 36], [54, 44], [34, 54], [48, 58], [40, 70], [24, 56], [58, 58],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.4" fill="#FFE6A8" />
      ))}
      <path d="M40 22 L 30 10 L 38 16 L 40 4 L 44 16 L 52 10 Z" fill="#3E9B3A" />
    </svg>
  );
}
