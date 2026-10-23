import Link from "next/link";
import { brand, contact, nav, socials } from "@/content/site";
import { categories } from "@/content/products";
import { Wordmark } from "@/components/brand/Wordmark";
import { FillLine } from "@/components/visual/FillLine";

export function Footer() {
  return (
    <footer className="relative bg-rind text-cream on-rind" data-living>
      <FillLine color="var(--rind)" className="absolute -top-10 left-0 sm:-top-14" />
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark tone="cream" className="text-5xl" />
            <p className="mt-4 max-w-[30ch] text-muted-rind">{brand.description}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="kicker text-mango">Explore</h2>
            <ul className="mt-4 space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-10 items-center hover:text-mango">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Menu categories">
            <h2 className="kicker text-mango">Menu</h2>
            <ul className="mt-4 space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`/?category=${c.id}#menu`} className="inline-flex min-h-10 items-center hover:text-mango">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="kicker text-mango">Say hello</h2>
            <address className="mt-4 space-y-1 not-italic text-muted-rind">
              {contact.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <a href={contact.phoneHref} className="block pt-2 text-cream hover:text-mango">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block text-cream hover:text-mango">
                {contact.email}
              </a>
            </address>
            {contact.sample && <p className="mt-3 font-mono text-xs text-muted-rind">Sample details for a demo business.</p>}
            {socials.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className="btn btn-ghost !min-h-10 !px-4 text-sm" target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-rind-line pt-6 text-sm text-muted-rind md:flex-row md:items-center md:justify-between">
          <p>
            © {brand.copyrightYear} {brand.name}. {brand.fictional && "A fictional brand made as a website demo. Products, prices and reviews are samples, and the photography is AI generated."}
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-mango">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-mango">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
