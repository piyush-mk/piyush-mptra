// Serves the static site and one first-party endpoint, POST /api/e, that counts events
// into Workers Analytics Engine. No cookies, no IPs, no user agents are stored.

interface Env {
  ASSETS: Fetcher;
  EVENTS?: AnalyticsEngineDataset;
}

const NAME = /^[a-z][a-z0-9:_-]{0,39}$/;
const HOSTS = new Set(["piyushmoha.com", "localhost"]);
const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
  "Cross-Origin-Resource-Policy": "same-origin",
};

const empty = (status: number) => new Response(null, { status, headers: SECURITY });

function device(ua: string) {
  if (/bot|crawl|spider|preview|headless/i.test(ua)) return "bot";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

async function collect(req: Request, env: Env) {
  if (req.method !== "POST") return empty(405);
  const origin = req.headers.get("Origin");
  if (!origin || !HOSTS.has(new URL(origin).hostname)) return empty(403);
  if (req.headers.get("DNT") === "1" || req.headers.get("Sec-GPC") === "1") return empty(204);
  const len = Number(req.headers.get("Content-Length") ?? "0");
  if (len > 512) return empty(413);

  let data: { e?: unknown; v?: unknown; p?: unknown };
  try {
    const text = await req.text();
    if (text.length > 512) return empty(413);
    data = JSON.parse(text);
  } catch {
    return empty(400);
  }
  const e = typeof data.e === "string" ? data.e : "";
  if (!NAME.test(e)) return empty(400);
  const v = typeof data.v === "string" ? data.v.slice(0, 80) : "";
  const p = typeof data.p === "string" && data.p.startsWith("/") ? data.p.slice(0, 120) : "/";
  const ua = req.headers.get("User-Agent") ?? "";
  const kind = device(ua);
  if (kind === "bot") return empty(204);
  const country = (req as Request & { cf?: { country?: string } }).cf?.country ?? "XX";

  env.EVENTS?.writeDataPoint({ indexes: [e], blobs: [e, v, p, country, kind], doubles: [1] });
  return empty(204);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/e") return collect(req, env);
    if (url.pathname.startsWith("/api/")) return empty(404);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
