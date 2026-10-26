// Stretches letters on Archivo's width axis as the pointer passes.
// Near letters widen, far ones narrow slightly, so the line keeps roughly the same length.

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

type Group = { el: HTMLElement; letters: HTMLElement[]; idle: boolean; near: boolean; visible: boolean };

export function initKinetic() {
  const groups: Group[] = [...document.querySelectorAll<HTMLElement>("[data-kinetic]")].map((el) => ({
    el,
    letters: [...el.querySelectorAll<HTMLElement>(".k")],
    idle: el.dataset.idle === "1",
    near: false,
    visible: true,
  }));
  if (!groups.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const g = groups.find((x) => x.el === e.target);
      if (g) g.visible = e.isIntersecting;
    }
  });
  groups.forEach((g) => io.observe(g.el));

  const set = (s: HTMLElement, wdth: number, wght: number | null, hot: boolean) => {
    s.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}`;
    s.style.fontWeight = wght === null ? "" : String(Math.round(wght));
    s.classList.toggle("hot", hot);
  };

  let px = -1, py = -1, queued = false;
  const apply = () => {
    queued = false;
    for (const g of groups) {
      if (!g.visible) continue;
      const box = g.el.getBoundingClientRect();
      const reach = Math.max(120, box.height * 1.4);
      g.near = px >= box.left - reach && px <= box.right + reach && py >= box.top - reach && py <= box.bottom + reach;
      if (!g.near) continue;
      for (const s of g.letters) {
        const r = s.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / reach);
        set(s, 97 + k * 15, 800 + k * 100, k > 0.85);
      }
    }
  };
  if (!reduce) {
    addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      px = e.clientX; py = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }
  document.addEventListener("pointerleave", () => { px = py = -1; groups.forEach((g) => (g.near = false)); });

  // One gentle wave across "idle" groups on load, then everything settles back to rest.
  // Letters away from the pointer always ease back to their normal width.
  const introEnd = performance.now() + 1600;
  const rest = () => {
    const now = performance.now();
    const intro = now < introEnd;
    for (const g of groups) {
      if (!g.visible || g.near) continue;
      g.letters.forEach((s, i) => {
        if (g.idle && intro) {
          const phase = (introEnd - now) / 1600; // 1 → 0
          const k = Math.max(0, Math.sin((1 - phase) * Math.PI * 2 - i * 0.35));
          set(s, 100 + k * 10 * phase, null, false);
        } else if (s.style.fontVariationSettings) {
          s.style.fontVariationSettings = "";
          s.style.fontWeight = "";
          s.classList.remove("hot");
        }
      });
    }
    requestAnimationFrame(rest);
  };
  if (!reduce) requestAnimationFrame(rest);
}
