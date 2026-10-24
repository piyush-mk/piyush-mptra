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
        set(s, 90 + k * 35, 650 + k * 250, k > 0.8);
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

  // Idle wave for groups that ask for it, and a rest state for the others.
  let t = 0;
  const idle = () => {
    t += 0.035;
    for (const g of groups) {
      if (!g.visible || g.near) continue;
      g.letters.forEach((s, i) => {
        if (g.idle) {
          const k = (Math.sin(t - i * 0.45) + 1) / 2;
          set(s, 78 + k * 40, null, false);
        } else if (s.style.fontVariationSettings) {
          s.style.fontVariationSettings = "";
          s.style.fontWeight = "";
          s.classList.remove("hot");
        }
      });
    }
    requestAnimationFrame(idle);
  };
  if (!reduce) requestAnimationFrame(idle);
}
