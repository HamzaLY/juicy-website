// Real-browser checks for the scroll hero (10K self-test items 3, 4, 8 and the static-hero gates).
//   node scripts/qa/hero-check.mjs [url]
import { mkdirSync } from "node:fs";
import path from "node:path";
import { launch, sleep } from "./cdp.mjs";

const URL_ = process.argv[2] ?? "http://localhost:3000/";
const OUT = path.resolve(import.meta.dirname, "../../review/qa");
mkdirSync(OUT, { recursive: true });

const b = await launch();
const requests = [];
b.on((m) => m.method === "Network.requestWillBeSent" && requests.push(m.params.request.url));

const state = `(() => {
  const s = document.querySelector('.hero-scrub'); const v = s?.querySelector('video');
  return { y: Math.round(scrollY), ready: !!s?.classList.contains('video-ready'), failed: !!s?.classList.contains('video-failed'),
    t: v ? +v.currentTime.toFixed(2) : null, dur: v?.duration ?? null,
    bands: s ? [...s.querySelectorAll('[data-band]')].map(x => +(+getComputedStyle(x).opacity).toFixed(2)) : [],
    staticShown: getComputedStyle(document.querySelector('.hero-static')).display !== 'none' };
})()`;

// 1. Desktop: scrub top, middle, bottom.
await b.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await b.send("Page.navigate", { url: URL_ });
for (let i = 0; i < 40; i++) {
  await sleep(500);
  if ((await b.evaluate(state)).ready) break;
}
console.log("desktop load:", JSON.stringify(await b.evaluate(state)));
const range = await b.evaluate(`document.querySelector('.hero-scrub').offsetHeight - innerHeight`);
for (const p of [0, 0.15, 0.48, 0.8, 1]) {
  await b.evaluate(`scrollTo(0, ${Math.round(range * p)})`);
  await sleep(1300);
  const s = await b.evaluate(state);
  console.log(`p=${p}`, JSON.stringify({ t: s.t, bands: s.bands }));
  await b.screenshot(path.join(OUT, `hero-p${String(p).replace(".", "")}.jpg`));
}

// 2. Flick test: 120px steps from the top; each band should hold full opacity for 5+ steps.
await b.evaluate(`scrollTo(0,0)`);
await sleep(800);
const runs = [];
for (let i = 0; i < Math.ceil(range / 120) + 2; i++) {
  await b.evaluate(`scrollBy(0,120)`);
  await sleep(260);
  runs.push((await b.evaluate(state)).bands);
}
const plateau = [0, 1, 2].map((k) => runs.filter((r) => r[k] >= 0.98).length);
console.log("flick 120px: full-opacity steps per band =", plateau.join(", "));
await b.evaluate(`scrollTo(0,0)`);
await sleep(600);
const seen = [false, false, false];
for (let i = 0; i < Math.ceil(range / 360) + 2; i++) {
  await b.evaluate(`scrollBy(0,360)`);
  await sleep(260);
  (await b.evaluate(state)).bands.forEach((o, k) => o >= 0.98 && (seen[k] = true));
}
console.log("flick 360px: every band reached full opacity =", seen.every(Boolean), JSON.stringify(seen));

// 3. Phone (touch, 375 wide): static hero, and the hero video is never requested.
requests.length = 0;
await b.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await b.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await b.send("Page.navigate", { url: URL_ });
await sleep(3500);
const phone = await b.evaluate(state);
console.log("phone:", JSON.stringify({ staticShown: phone.staticShown, heroVideoRequested: requests.some((u) => u.includes("hero-scrub")), overflowX: await b.evaluate(`document.documentElement.scrollWidth > innerWidth`) }));
await b.screenshot(path.join(OUT, "phone-hero.jpg"));

// 4. Reduced motion on desktop: static hero, no video request; then flip it off live and the scrub re-arms.
// Leave the page first: resizing the open phone page to desktop would (correctly) arm the scrub on it.
await b.send("Page.navigate", { url: "about:blank" });
await sleep(300);
await b.send("Emulation.setTouchEmulationEnabled", { enabled: false });
await b.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await b.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
requests.length = 0;
await b.send("Page.navigate", { url: URL_ });
await sleep(3500);
const rm = await b.evaluate(state);
console.log("reduced motion:", JSON.stringify({ staticShown: rm.staticShown, heroVideoRequested: requests.some((u) => u.includes("hero-scrub")) }));
await b.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
for (let i = 0; i < 30; i++) {
  await sleep(500);
  if ((await b.evaluate(state)).ready) break;
}
console.log("motion flipped back on:", JSON.stringify(await b.evaluate(state)));

// 5. Video blocked: the page still works over the poster.
await b.send("Network.setBlockedURLs", { urls: ["*hero-scrub.mp4*"] });
await b.send("Page.navigate", { url: URL_ });
await sleep(4000);
const blocked = await b.evaluate(state);
console.log("video blocked:", JSON.stringify({ failed: blocked.failed, bands: blocked.bands }));
await b.screenshot(path.join(OUT, "hero-video-blocked.jpg"));

const errors = await b.evaluate(`window.__errs ? window.__errs.length : 0`);
console.log("done", errors);
b.close();
process.exit(0);
