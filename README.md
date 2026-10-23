# JUICY: Freshness in full color

A premium fresh-drinks website for a fictional juice bar. It has a scroll-driven hero video, AI-generated product photography, three rendered Remotion brand films, and a working (demo) shop with a menu, customizer, cart and checkout.

> JUICY is a fictional brand made as a design and engineering demo. Products, prices and reviews are samples, the photography is AI generated, and the checkout takes no payment.

## Features

- **Scroll hero:** a pour clip plays forward and backward as you scroll, with timed headlines. Phones and reduced-motion visitors get a designed still instead.
- **Menu:** 15 drinks, category filters, search, and a drink window with size, ice, sweetness and add-ins. Prices update live from one pricing model.
- **Cart:** saved in the browser, with quantity controls, a bundle discount ("Color Flight": any three small drinks for $15), and a demo checkout.
- **Films:** a brand film, a drinks showcase and a reusable seasonal promo, all rendered with Remotion.
- **Accessibility:** keyboard-friendly dialogs and menus, visible focus, reduced-motion support, and tested text contrast over the video.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Framer Motion · GSAP ScrollTrigger · Lucide icons · Remotion 4

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build`, then `npm start`.

## Change the content

| What | Where |
|---|---|
| Drinks, prices, colors, descriptions | `content/products.ts` |
| Sizes, add-ins, ice and sweetness rules | `content/options.ts` |
| Brand name, contact details, hours, social links | `content/site.ts` |
| Seasonal special and bundle | `content/promos.ts` |
| Testimonials (currently samples) | `content/testimonials.ts` |
| Images and films used by each section | `content/media.ts` |

## Media

All media is original. The photography comes from FLUX.2 klein 4B, the hero clip from Wan 2.2 (both Apache 2.0), and the films are rendered from code in `video/`. See [docs/assets.md](docs/assets.md) for sources, licenses, and how to regenerate or re-render. The design decisions are in [docs/design-package.md](docs/design-package.md).

```bash
cd video && npm install && bash render-all.sh   # re-render all films
```

Remotion is free for individuals and companies of up to 3 people. Larger teams need a [company license](https://www.remotion.pro/license).
