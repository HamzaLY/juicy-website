import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/site";

export function Visit() {
  const directions = contact.mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}` : null;
  return (
    <section id="visit" aria-labelledby="visit-title" className="relative bg-pulp pb-32 pt-24 sm:pb-40 sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="kicker text-orange-deep" data-reveal>
            Visit and contact
          </p>
          <h2 id="visit-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-3 font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
            Come thirsty.
          </h2>
          {contact.sample && (
            <p data-reveal style={{ ["--d" as string]: 2 }} className="mt-4 inline-block rounded-2xl bg-pulp-deep px-4 py-2 font-mono text-xs text-ink-soft">
              Sample address and hours for this demo. Replace them in content/site.ts.
            </p>
          )}

          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            <div data-reveal>
              <dt className="flex items-center gap-2 font-semibold">
                <MapPin className="h-5 w-5 text-orange-deep" aria-hidden="true" /> Find us
              </dt>
              <dd className="mt-2 text-ink-soft">
                <address className="not-italic">
                  {contact.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                {directions && (
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center font-semibold text-ink underline decoration-orange decoration-2 underline-offset-4">
                    Get directions
                  </a>
                )}
              </dd>
            </div>
            <div data-reveal style={{ ["--d" as string]: 1 }}>
              <dt className="flex items-center gap-2 font-semibold">
                <Clock className="h-5 w-5 text-orange-deep" aria-hidden="true" /> Opening hours
              </dt>
              <dd className="mt-2">
                <table className="w-full text-left text-ink-soft">
                  <caption className="sr-only">Opening hours</caption>
                  <tbody>
                    {contact.hours.map((h) => (
                      <tr key={h.days}>
                        <th scope="row" className="py-0.5 pr-4 font-normal">
                          {h.days}
                        </th>
                        <td className="py-0.5 font-mono text-sm text-ink">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
            <div data-reveal>
              <dt className="flex items-center gap-2 font-semibold">
                <Phone className="h-5 w-5 text-orange-deep" aria-hidden="true" /> Call
              </dt>
              <dd className="mt-2">
                <a href={contact.phoneHref} className="inline-flex min-h-10 items-center font-mono text-ink hover:text-orange-deep">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div data-reveal style={{ ["--d" as string]: 1 }}>
              <dt className="flex items-center gap-2 font-semibold">
                <Mail className="h-5 w-5 text-orange-deep" aria-hidden="true" /> Email
              </dt>
              <dd className="mt-2">
                <a href={`mailto:${contact.email}`} className="inline-flex min-h-10 items-center font-mono text-ink hover:text-orange-deep">
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-10 max-w-[48ch] text-ink-soft" data-reveal>
            We serve at the counter for pickup. There is no delivery service.
          </p>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[40px] bg-[#F7E3CC]" data-reveal aria-hidden="true">
          <svg viewBox="0 0 600 520" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <rect width="600" height="520" fill="#F7E3CC" />
            <g stroke="#FFF5EA" strokeWidth="26" strokeLinecap="round" fill="none">
              <path d="M-20 120 H620" />
              <path d="M-20 330 C 180 300, 380 380, 620 340" />
              <path d="M160 -20 V540" />
              <path d="M430 -20 C 400 160, 470 300, 420 540" />
            </g>
            <g stroke="#FFF5EA" strokeWidth="10" fill="none" opacity="0.8">
              <path d="M-20 220 H620" />
              <path d="M290 -20 V540" />
              <path d="M-20 440 H620" />
            </g>
            <rect x="185" y="140" width="85" height="65" rx="14" fill="#CFEAB8" />
            <rect x="455" y="370" width="120" height="60" rx="14" fill="#CFEAB8" />
            <circle cx="520" cy="80" r="40" fill="#BDE7E1" />
          </svg>
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-full">
            <div className="relative grid place-items-center">
              <span className="absolute h-16 w-16 animate-ping rounded-full bg-orange/30 motion-decor" />
              <svg viewBox="0 0 24 32" className="relative h-16 w-auto drop-shadow-[0_10px_14px_rgb(178_74_0/0.45)]">
                <path d="M12 1c4.4 6.3 10 12.2 10 18.8a10 10 0 0 1-20 0C2 13.2 7.6 7.3 12 1Z" fill="var(--orange)" />
                <circle cx="12" cy="19" r="4" fill="#FFF5EA" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 rounded-2xl bg-pulp/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="font-display text-lg font-bold">JUICY</p>
            <p className="font-mono text-xs text-ink-soft">Sample location</p>
          </div>
        </div>
      </div>
    </section>
  );
}
