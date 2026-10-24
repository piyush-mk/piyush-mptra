// Cookieless, first-party event counts. Sent to /api/e on our own origin and nowhere else.
// Nothing is sent when the visitor has Do Not Track or Global Privacy Control on.

const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
const optedOut = nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
const enabled = import.meta.env.PROD && !optedOut;

export function track(event: string, value = "") {
  if (!enabled) return;
  const body = JSON.stringify({ e: event.slice(0, 40), v: value.slice(0, 80), p: location.pathname.slice(0, 120) });
  try {
    navigator.sendBeacon("/api/e", new Blob([body], { type: "application/json" }));
  } catch {
    /* beacon unavailable; drop the event */
  }
}

export function initTracking() {
  if (!enabled) return;
  track("view", document.referrer ? new URL(document.referrer).hostname : "direct");

  // Section reached
  const seen = new Set<string>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const id = (e.target as HTMLElement).id;
      if (e.isIntersecting && !seen.has(id)) { seen.add(id); track("section", id); }
    }
  }, { threshold: 0.35 });
  document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));

  // Scroll depth in quarters
  let best = 0;
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const q = Math.floor((scrollY / max) * 4) * 25;
    if (q > best) { best = q; track("depth", String(q)); }
  }, { passive: true });

  // Outbound and tagged clicks
  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLElement>("[data-track]");
    if (a) track("click", a.dataset.track ?? "");
  });
  document.querySelectorAll<HTMLDetailsElement>("details[data-track-toggle]").forEach((d) =>
    d.addEventListener("toggle", () => { if (d.open) track("expand", d.dataset.trackToggle ?? ""); }),
  );
}
