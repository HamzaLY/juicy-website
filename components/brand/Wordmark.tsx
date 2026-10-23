import { brand } from "@/content/site";

/** The JUICY wordmark: live type plus a droplet mark, so it renames from content/site.ts. */
export function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "cream" }) {
  return (
    <span className={`inline-flex items-start font-display font-extrabold leading-none ${className}`} style={{ fontVariationSettings: '"opsz" 96, "wdth" 85' }}>
      <span className={tone === "cream" ? "text-cream" : "text-ink"}>{brand.name}</span>
      <svg viewBox="0 0 24 32" aria-hidden="true" className="ml-[0.06em] mt-[-0.08em] h-[0.5em] w-auto">
        <path d="M12 1c4.4 6.3 10 12.2 10 18.8a10 10 0 0 1-20 0C2 13.2 7.6 7.3 12 1Z" fill="var(--orange)" />
        <ellipse cx="8.4" cy="17" rx="2" ry="3.2" fill="var(--mango)" opacity=".9" />
      </svg>
    </span>
  );
}
