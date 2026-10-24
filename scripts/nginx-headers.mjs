// Turns the "/*" block of dist/_headers into nginx add_header lines so the container
// sends exactly the same security headers as Cloudflare.
import { readFileSync } from "node:fs";

const lines = readFileSync(new URL("../dist/_headers", import.meta.url), "utf8").split(/\r?\n/);
let inBlock = false;
for (const line of lines) {
  if (!line.startsWith(" ")) { inBlock = line.trim() === "/*"; continue; }
  if (!inBlock || !line.trim()) continue;
  const i = line.indexOf(":");
  const name = line.slice(0, i).trim();
  // HSTS and upgrade-insecure-requests only make sense behind TLS, which Cloudflare provides
  if (name === "Strict-Transport-Security") continue;
  const value = line.slice(i + 1).trim().replace("; upgrade-insecure-requests", "").replace(/"/g, '\\"');
  console.log(`add_header ${name} "${value}" always;`);
}
