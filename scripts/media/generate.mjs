// Free media generation: Cloudflare Workers AI (FLUX.2 klein) and public Hugging Face Spaces (Gradio REST API).
// Models (all Apache 2.0): FLUX.2 klein 4B, Z-Image-Turbo and FLUX.1-schnell for stills, Wan 2.2 I2V for motion.
//
//   node scripts/media/generate.mjs scripts/media/jobs/hero.json
//
// Each job writes review/raw/<id>.<png|mp4> and is skipped if that file already exists.
// Set HF_TOKEN in .env.local (optional, free) to raise the shared GPU quota.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "review", "raw");

const SPACES = {
  zimage: "https://tongyi-mai-z-image-turbo.hf.space",
  flux: "https://black-forest-labs-flux-1-schnell.hf.space",
  wan: "https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space",
};

const NO_TEXT = " No text, no logos, no lettering, no labels anywhere.";

async function loadEnv() {
  try {
    const env = await readFile(path.join(ROOT, ".env.local"), "utf8");
    return Object.fromEntries([...env.matchAll(/^([A-Z_]+)=(.*)$/gm)].map((m) => [m[1], m[2].trim()]));
  } catch {
    return {};
  }
}

const env = await loadEnv();
const token = env.HF_TOKEN ?? "";

/** Cloudflare Workers AI: FLUX.2 klein 4B (Apache 2.0). Free tier: 10,000 neurons per day. */
async function cloudflareKlein(job) {
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) throw new Error("Cloudflare keys missing in .env.local");
  const form = new FormData();
  form.append("prompt", job.prompt + NO_TEXT);
  form.append("width", String(job.width ?? 1536));
  form.append("height", String(job.height ?? 864));
  form.append("steps", String(job.steps ?? 4));
  form.append("seed", String(job.seed ?? 42));
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-2-klein-4b`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(`cloudflare: ${JSON.stringify(json.errors)}`);
  return Buffer.from(json.result.image, "base64");
}
const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

const exists = (p) => access(p).then(() => true, () => false);

async function upload(space, file) {
  const form = new FormData();
  form.append("files", new Blob([await readFile(file)]), path.basename(file));
  const res = await fetch(`${space}/gradio_api/upload`, { method: "POST", body: form, headers: authHeaders });
  if (!res.ok) throw new Error(`upload failed ${res.status}`);
  const [p] = await res.json();
  return { path: p, meta: { _type: "gradio.FileData" } };
}

async function call(space, endpoint, data) {
  const start = await fetch(`${space}/gradio_api/call/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ data }),
  });
  if (!start.ok) throw new Error(`call failed ${start.status}: ${await start.text()}`);
  const { event_id } = await start.json();
  const stream = await fetch(`${space}/gradio_api/call/${endpoint}/${event_id}`, { headers: authHeaders });
  const text = await stream.text();
  const blocks = text.split(/\n\n/);
  for (const block of blocks) {
    const ev = block.match(/^event: (\w+)/m)?.[1];
    const payload = block.match(/^data: (.*)$/m)?.[1];
    if (ev === "complete") return JSON.parse(payload);
    if (ev === "error") throw new Error(`space error: ${payload}`);
  }
  throw new Error(`no result: ${text.slice(-300)}`);
}

function findUrl(result) {
  const json = JSON.stringify(result);
  return json.match(/"url":\s*"([^"]+)"/)?.[1];
}

async function download(url, dest) {
  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function runJob(job) {
  const ext = { wan: "mp4", zimage: "png", klein: "jpg", flux: "webp" }[job.model];
  const dest = path.join(OUT, `${job.id}.${ext}`);
  if (await exists(dest)) return console.log(`skip  ${job.id}`);
  const t0 = Date.now();
  if (job.model === "klein") {
    await writeFile(dest, await cloudflareKlein(job));
    return console.log(`done  ${job.id}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  let result;
  if (job.model === "zimage") {
    result = await call(SPACES.zimage, "generate", [
      job.prompt + NO_TEXT, job.resolution ?? "2048x1152 ( 16:9 )", job.seed ?? 42, job.steps ?? 8, 3, false, [],
    ]);
  } else if (job.model === "flux") {
    result = await call(SPACES.flux, "infer", [job.prompt + NO_TEXT, job.seed ?? 42, false, job.width ?? 1344, job.height ?? 768, 4]);
  } else if (job.model === "wan") {
    const image = await upload(SPACES.wan, path.resolve(ROOT, job.image));
    result = await call(SPACES.wan, "generate_video", [
      image, job.prompt + " No text.", job.steps ?? 6,
      "text, watermark, subtitles, blurry, distorted glass, warped hands, static, jitter",
      job.duration ?? 3.5, 1, 1, job.seed ?? 42, false,
    ]);
  } else throw new Error(`unknown model ${job.model}`);
  const url = findUrl(result);
  if (!url) throw new Error(`no file url in ${JSON.stringify(result).slice(0, 200)}`);
  await download(url, dest);
  console.log(`done  ${job.id}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

const jobsFile = process.argv[2];
if (!jobsFile) throw new Error("usage: node generate.mjs <jobs.json>");
const jobs = JSON.parse(await readFile(path.resolve(jobsFile), "utf8"));
await mkdir(OUT, { recursive: true });

let failed = 0;
for (const job of jobs) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await runJob(job);
      break;
    } catch (err) {
      console.log(`fail  ${job.id} (attempt ${attempt}): ${err.message.slice(0, 300)}`);
      if (/quota/i.test(err.message)) {
        console.log("GPU quota reached. Add a free HF_TOKEN to .env.local or wait for the quota to reset.");
        process.exit(2);
      }
      if (attempt === 2) failed++;
    }
  }
}
console.log(`finished: ${jobs.length - failed}/${jobs.length} ok`);
