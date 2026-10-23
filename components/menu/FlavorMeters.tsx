import type { FlavorProfile } from "@/content/products";

const labels: { key: keyof FlavorProfile; label: string }[] = [
  { key: "sweet", label: "Sweet" },
  { key: "tart", label: "Tart" },
  { key: "fresh", label: "Fresh" },
];

/** Five-segment flavor meters. Each row reads as text for screen readers. */
export function FlavorMeters({ flavor, color, className = "", compact = false }: { flavor: FlavorProfile; color: string; className?: string; compact?: boolean }) {
  return (
    <dl className={`grid gap-1.5 ${compact ? "grid-cols-3 gap-x-4" : ""} ${className}`}>
      {labels.map(({ key, label }) => (
        <div key={key} className={`flex items-center gap-3 ${compact ? "flex-col items-start gap-1" : ""}`}>
          <dt className={`font-mono text-xs uppercase tracking-wider text-ink-soft ${compact ? "" : "w-12"}`}>{label}</dt>
          <dd className="flex gap-1">
            <span className="sr-only">
              {flavor[key]} out of 5
            </span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-2 rounded-full ${compact ? "w-3" : "w-5"}`}
                style={{ background: i < flavor[key] ? color : "var(--pulp-line)" }}
              />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
