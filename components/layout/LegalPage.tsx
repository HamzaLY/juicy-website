import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-[760px] px-5 pb-28 pt-[calc(var(--nav-h)+48px)] sm:px-8">
      <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-ink-soft hover:text-ink">
        ← Home
      </Link>
      <h1 className="mt-4 font-display text-5xl font-extrabold tracking-[-0.03em]">{title}</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink">{children}</div>
    </article>
  );
}
