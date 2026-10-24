// Post-build: hash every inline <script> and <style> in dist/*.html and write a strict
// Content-Security-Policy into dist/_headers (no 'unsafe-inline' anywhere).
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const html = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) html.push(p);
  }
})(dist);

const hash = (s) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`;
const scripts = new Set();
const styles = new Set();
for (const file of html) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) if (m[1].trim()) scripts.add(hash(m[1]));
  for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) if (m[1].trim()) styles.add(hash(m[1]));
  if (/\sstyle="/.test(src)) throw new Error(`${file}: inline style attribute found; move it to CSS so CSP stays strict`);
}

// Cloudflare Web Analytics beacon is the only third party allowed.
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scripts].join(" ")} https://static.cloudflareinsights.com`,
  `style-src 'self' ${[...styles].join(" ")}`,
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const headersPath = join(dist, "_headers");
writeFileSync(headersPath, readFileSync(headersPath, "utf8").replace("__CSP__", csp));
console.log(`csp: ${html.length} pages, ${scripts.size} inline script hash(es), ${styles.size} inline style hash(es)`);
