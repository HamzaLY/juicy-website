// Turns approved raw generations (review/raw) into web-ready WebP files under public/media/images.
// One clean compression pass, metadata stripped. next/image handles responsive resizing on top.
//
//   node scripts/media/process-images.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const RAW = path.join(ROOT, "review", "raw");
const OUT = path.join(ROOT, "public", "media", "images");

// raw id prefix -> [output folder, max width]
const rules = [
  ["product-", "products", 1024],
  ["hero-", "hero", 2048],
  ["", "sections", 1920],
];

mkdirSync(OUT, { recursive: true });
for (const file of readdirSync(RAW)) {
  if (!/\.(jpg|png|webp)$/.test(file)) continue;
  const id = file.replace(/\.\w+$/, "");
  const [prefix, folder, width] = rules.find(([p]) => id.startsWith(p));
  const name = prefix === "product-" ? id.slice(prefix.length) : id;
  const dir = path.join(OUT, folder);
  mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `${name}.webp`);
  if (existsSync(dest) && statSync(dest).mtimeMs > statSync(path.join(RAW, file)).mtimeMs) continue;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(RAW, file), "-vf", `scale='min(${width},iw)':-2`, "-c:v", "libwebp", "-quality", "84", "-map_metadata", "-1", dest]);
  console.log(`${folder}/${name}.webp  ${(statSync(dest).size / 1024).toFixed(0)} KB`);
}
