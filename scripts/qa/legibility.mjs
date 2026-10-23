// Worst-frame legibility audit for the scroll hero (10K law 10).
// For each band: scrub through its range, hide the glyphs, screenshot the real composited page,
// and find the darkest background pixel under the text box (the worst case for dark ink type).
//   node scripts/qa/legibility.mjs [url]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { launch, sleep } from "./cdp.mjs";

const URL_ = process.argv[2] ?? "http://localhost:3000/";
const OUT = path.resolve(import.meta.dirname, "../../review/qa/legibility");
mkdirSync(OUT, { recursive: true });
const BANDS = [
  [0, 0.3],
  [0.34, 0.62],
  [0.68, 1],
];
const INK = [0x1e, 0x14, 0x0e];
const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

const b = await launch({ port: 9335 });
await b.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await b.send("Page.navigate", { url: URL_ });
for (let i = 0; i < 40 && !(await b.evaluate(`!!document.querySelector('.hero-scrub.video-ready')`)); i++) await sleep(500);
const range = await b.evaluate(`document.querySelector('.hero-scrub').offsetHeight - innerHeight`);

let pass = true;
for (const [i, [a, z]] of BANDS.entries()) {
  let worst = 99;
  for (const f of [0.25, 0.5, 0.75]) {
    const p = a + (z - a) * f;
    await b.evaluate(`document.getElementById('qa-hide')?.remove(); scrollTo(0, ${Math.round(range * p)})`);
    await sleep(1500);
    const box = await b.evaluate(`(() => { const el = document.querySelectorAll('.hero-scrub [data-band]')[${i}].querySelector('.band-scrim'); const r = el.getBoundingClientRect(); return { x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y + scrollY)), w: Math.round(r.width), h: Math.round(r.height) }; })()`); // clip is in page coordinates
    await b.evaluate(`(() => { const s = document.createElement('style'); s.id = 'qa-hide'; s.textContent = '.hero-scrub [data-band] *{color:transparent!important;text-shadow:none!important;border-color:transparent!important}.hero-scrub .btn{background:transparent!important;box-shadow:none!important}'; document.head.append(s); })()`);
    await sleep(250);
    const file = path.join(OUT, `band${i + 1}-${f}.png`);
    const { data } = await b.send("Page.captureScreenshot", { format: "png", clip: { ...box, width: box.w, height: box.h, scale: 1 } });
    const buf = Buffer.from(data, "base64");
    // Decode with ffmpeg into raw RGB and take the darkest pixel.
    const raw = execFileSync("ffmpeg", ["-loglevel", "error", "-i", "pipe:0", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"], { input: buf, maxBuffer: 64 * 1024 * 1024 });
    let darkest = 1;
    for (let k = 0; k < raw.length; k += 3) darkest = Math.min(darkest, lum([raw[k], raw[k + 1], raw[k + 2]]));
    const ratio = (darkest + 0.05) / (lum(INK) + 0.05);
    worst = Math.min(worst, ratio);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", "pipe:0", file], { input: buf });
  }
  const ok = worst >= 3.5;
  pass &&= ok;
  console.log(`band ${i + 1}: worst-pixel contrast ${worst.toFixed(2)}:1 ${ok ? "PASS" : "FAIL"} (floor 3.5:1)`);
}
console.log(pass ? "legibility: all bands pass" : "legibility: FAIL");
b.close();
process.exit(pass ? 0 : 1);
