#!/usr/bin/env bash
# Renders every JUICY film, then makes the web versions and posters the site uses.
#   cd video && bash render-all.sh
# Masters: video/out/*.mp4 (H.264, 1920x1080, 30 fps). Web files: ../public/media/video.
set -euo pipefail
cd "$(dirname "$0")"
PORT=3123   # keeps clear of the Next.js dev server on 3000
WEB=../public/media/video
mkdir -p out "$WEB"

for id in BrandFilm Showcase Seasonal; do
  npx remotion render src/index.ts "$id" "out/$id.mp4" --codec=h264 --crf=16 --port=$PORT --log=error
done

slug() { case "$1" in BrandFilm) echo brand-film;; Showcase) echo drinks-showcase;; Seasonal) echo seasonal-promo;; esac; }

for id in BrandFilm Showcase Seasonal; do
  s=$(slug "$id")
  # Desktop: 1080p, web-friendly H.264, no audio track, fast start.
  ffmpeg -loglevel error -y -i "out/$id.mp4" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an "$WEB/$s-1080.mp4"
  # Mobile: 720p, lighter.
  ffmpeg -loglevel error -y -i "out/$id.mp4" -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an "$WEB/$s-720.mp4"
done

# Posters: a representative frame from each film.
npx remotion still src/index.ts BrandFilm "$WEB/brand-film-poster.jpg" --frame=150 --jpeg-quality=86 --port=$PORT --log=error
npx remotion still src/index.ts Showcase "$WEB/drinks-showcase-poster.jpg" --frame=100 --jpeg-quality=86 --port=$PORT --log=error
npx remotion still src/index.ts Seasonal "$WEB/seasonal-promo-poster.jpg" --frame=170 --jpeg-quality=86 --port=$PORT --log=error
ls -la "$WEB"
