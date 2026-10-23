// Generated and rendered media used by the site. Paths are under /public.
// Leave a field undefined and the site falls back to its designed vector version.
// Photography is AI generated with FLUX.2 klein 4B (Apache 2.0) via Cloudflare Workers AI; see docs/assets.md.

export const heroMedia: {
  /** Scroll-scrubbed hero video (desktop and landscape tablets only). */
  video?: string;
  /** Real byte size of the video, the fallback when Content-Length is missing. */
  videoBytes?: number;
  /** First frame of the video, painted before the video arrives. */
  poster?: string;
  /** Still used for phones, reduced motion and when the video fails. */
  still?: string;
  stillAlt?: string;
} = {
  // Wan 2.2 image-to-video (Apache 2.0) from hero-ice, encoded for scrubbing (keyframe every 8 frames).
  video: "/media/video/hero-scrub.mp4",
  videoBytes: 1499078,
  poster: "/media/video/hero-poster.jpg",
  still: "/media/images/hero/hero-full.webp",
  stillAlt: "A tall glass of fresh orange juice with ice and condensation on a sunlit stone counter, with halved oranges and mint",
};

export const storyMedia: { main?: string; mainAlt?: string } = {
  main: "/media/images/sections/story-counter.webp",
  mainAlt: "A juice bar counter in morning light with cut citrus, a citrus press and freshly poured juices",
};

export const freshnessMedia: { wall?: string; wallAlt?: string } = {
  wall: "/media/images/sections/fresh-flatlay.webp",
  wallAlt: "Freshly cut oranges, watermelon, strawberries, mango, pineapple, lime, lemon and mint laid out on a peach surface",
};

export const films: { id: string; title: string; caption: string; src?: string; srcMobile?: string; poster?: string }[] = [
  {
    id: "brand-film",
    title: "Brand film",
    caption: "Citrus, ice and a glass filled to the line.",
    src: "/media/video/brand-film-1080.mp4",
    srcMobile: "/media/video/brand-film-720.mp4",
    poster: "/media/video/brand-film-poster.jpg",
  },
  {
    id: "drinks-showcase",
    title: "Drinks showcase",
    caption: "Five signatures, five colors.",
    src: "/media/video/drinks-showcase-1080.mp4",
    srcMobile: "/media/video/drinks-showcase-720.mp4",
    poster: "/media/video/drinks-showcase-poster.jpg",
  },
  {
    id: "seasonal-promo",
    title: "Seasonal promo",
    caption: "Blood Orange Ember, here for the cold months.",
    src: "/media/video/seasonal-promo-1080.mp4",
    srcMobile: "/media/video/seasonal-promo-720.mp4",
    poster: "/media/video/seasonal-promo-poster.jpg",
  },
];
