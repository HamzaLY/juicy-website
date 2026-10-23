# Media assets

All photography is original and AI generated for this project. All films are rendered from code with Remotion. Nothing is stock, and nothing loads from a third-party URL.

## Images

| Where it's used | File | Source |
|---|---|---|
| Hero (still) | `public/media/images/hero/hero-full.webp` | FLUX.2 klein 4B |
| Brand film (empty glass) | `public/media/images/hero/hero-ice.webp` | FLUX.2 klein 4B |
| 15 drink photos | `public/media/images/products/<drink-id>.webp` | FLUX.2 klein 4B |
| Our story | `public/media/images/sections/story-counter.webp` | FLUX.2 klein 4B |
| Fresh and full | `public/media/images/sections/fresh-flatlay.webp` | FLUX.2 klein 4B |
| Seasonal special | `public/media/images/sections/seasonal-blood-orange.webp` | FLUX.2 klein 4B |
| Color Flight bundle | `public/media/images/sections/promo-flight.webp` | FLUX.2 klein 4B |
| Spare composition | `public/media/images/sections/citrus-splash.webp` | FLUX.2 klein 4B |

- **Model:** FLUX.2 [klein] 4B by Black Forest Labs, released under the **Apache 2.0** license (commercial use allowed). It runs on Cloudflare Workers AI on the free daily allowance.
- **Prompts** live in `scripts/media/jobs/*.json`. The drink prompts are built by `scripts/media/jobs/make-product-jobs.mjs`, so the drinks share one art direction.
- **Review:** every image was checked for stray text or logos, malformed fruit or glasses, and whether the fruit matches the drink. Three drink photos were regenerated: Guava Wave (it showed the wrong fruit), Passion Pine (the seeds looked like bubble-tea pearls) and Mango Monsoon (the fruit read as papaya). The rejected versions are in `review/rejected/`, which stays out of Git.
- **Disclosure:** the footer and the Terms page state that the photography is AI generated.

### Regenerate or add an image

1. Add a job to a file in `scripts/media/jobs/`, or edit an existing one.
2. Run `node scripts/media/generate.mjs scripts/media/jobs/<file>.json`. This needs `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in `.env.local`. Raw files land in `review/raw/`, and existing files are skipped, so delete one to redo it.
3. Look at the result, then run `node scripts/media/process-images.mjs` to write the web WebP into `public/media/images/`.

## Scroll hero video

- **File:** `public/media/video/hero-scrub.mp4`, 1280×720, 16 fps, 5 s, about 1.5 MB. The poster is `hero-poster.jpg`.
- **Source:** Wan 2.2 image-to-video (**Apache 2.0**) on the free public Hugging Face Space, started from `hero-ice`. The job is in `scripts/media/jobs/hero-video.json` and needs `HF_TOKEN` in `.env.local`.
- **Encoding:** a lanczos upscale from 832×480 with mild sharpening, and a keyframe every 8 frames (`-g 8`) so scroll seeking stays smooth. No audio.
- **Known flaw:** a thin stream of juice is still falling in the last frame, so the ending isn't fully at rest. The final text panel sits over it.
- **Checks:** run `node scripts/qa/hero-check.mjs` (scrub positions, flick test, phone and reduced-motion gates, blocked video) and `node scripts/qa/legibility.mjs` (worst-frame contrast) with the dev server running.

## Films (Remotion)

| Film | Composition | Length | Web files |
|---|---|---|---|
| A. Brand film | `BrandFilm` | about 10.5 s | `public/media/video/brand-film-{1080,720}.mp4`, `brand-film-poster.jpg` |
| B. Drinks showcase | `Showcase` | about 13.8 s | `public/media/video/drinks-showcase-{1080,720}.mp4`, `drinks-showcase-poster.jpg` |
| C. Seasonal promo (template) | `Seasonal` | 10 s | `public/media/video/seasonal-promo-{1080,720}.mp4`, `seasonal-promo-poster.jpg` |

- **Source:** `video/src/` (React + Remotion 4.0.538). The films use the generated photos, the site's fonts (bundled in `video/public/fonts`), and procedural vector work: citrus slices, droplet bursts and the liquid "fill line" wave.
- **Masters:** `video/out/*.mp4`, H.264 at 1920×1080 and 30 fps. This folder stays out of Git.
- **Web versions:** H.264 with fast start and no audio track. 1080p for desktop, and 720p for phones, which the browser picks automatically with `<source media>`.
- **Seasonal template:** change `seasonalDefaults` in `video/src/Seasonal.tsx`, or edit the props in Remotion Studio, then re-render.

### Re-render everything

```bash
cd video
bash render-all.sh
```

To preview and edit, run `npx remotion studio --port=3123` from `video/`. Port 3123 keeps it clear of the Next.js dev server on 3000.

**License note:** Remotion is free for individuals and for companies of up to 3 people. Larger companies need a Remotion company license (remotion.pro/license).
