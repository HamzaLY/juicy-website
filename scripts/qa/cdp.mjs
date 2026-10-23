// Minimal Chrome DevTools Protocol driver (no dependencies; Node 22+ has a global WebSocket).
// Used for QA checks the hidden preview pane cannot run: real rAF, touch emulation, media flips.
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME =
  process.env.CHROME_PATH ??
  path.resolve(import.meta.dirname, "../../video/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");

export async function launch({ port = 9333 } = {}) {
  const profile = mkdtempSync(path.join(os.tmpdir(), "juicy-qa-"));
  const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
  let targets;
  for (let i = 0; i < 50; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      if (targets.length) break;
    } catch {}
    await sleep(200);
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) listeners.forEach((l) => l(msg));
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, { resolve, reject });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "evaluate failed");
    return r.result.value;
  };
  const screenshot = async (file) => {
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
    writeFileSync(file, Buffer.from(data, "base64"));
  };
  await send("Page.enable");
  await send("Network.enable");
  return { send, evaluate, screenshot, on: (fn) => listeners.push(fn), close: () => proc.kill() };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
