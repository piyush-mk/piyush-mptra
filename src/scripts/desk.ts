// The project desk: an agent cursor visits each window until a visitor grabs one.
import { track } from "./track";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initDesk() {
  const desk = document.querySelector<HTMLElement>("[data-desk]");
  if (!desk) return;
  const wins = [...desk.querySelectorAll<HTMLElement>("[data-win]")];
  const cursor = desk.querySelector<HTMLElement>("[data-cursor]");
  const label = desk.querySelector<HTMLElement>("[data-cursor-label]");
  const wide = matchMedia("(min-width: 1181px)");
  let z = 10;
  let pausedUntil = 0;
  let step = 0;
  let visible = false;

  const front = (w: HTMLElement) => { w.style.zIndex = String(++z); };
  const focus = (w: HTMLElement) => wins.forEach((x) => x.classList.toggle("focus", x === w));

  // Grab a window by its title bar and move it around the desk (wide screens only)
  wins.forEach((w) => {
    let dx = 0, dy = 0;
    w.addEventListener("pointerdown", () => {
      front(w);
      focus(w);
      pausedUntil = performance.now() + 15000;
      desk.classList.add("user");
    });
    const bar = w.querySelector<HTMLElement>("[data-drag]");
    if (!bar) return;
    bar.addEventListener("pointerdown", (e) => {
      if (!wide.matches) return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      const sx = e.clientX - dx, sy = e.clientY - dy;
      const move = (ev: PointerEvent) => {
        dx = ev.clientX - sx;
        dy = ev.clientY - sy;
        w.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const up = () => {
        bar.removeEventListener("pointermove", move);
        bar.removeEventListener("pointerup", up);
        track("desk", `drag:${w.dataset.win}`);
      };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
    });
  });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.25 }).observe(desk);

  const verbs = ["open", "read", "inspect"];
  const tick = () => {
    if (performance.now() < pausedUntil) return;
    desk.classList.remove("user");
    if (!visible || !wide.matches || !cursor) return;
    const w = wins[step % wins.length];
    const d = desk.getBoundingClientRect();
    const r = w.getBoundingClientRect();
    cursor.style.transform = `translate(${r.left - d.left + r.width * 0.6}px, ${r.top - d.top + 60}px)`;
    window.setTimeout(() => {
      front(w);
      focus(w);
      if (label) label.textContent = `${verbs[step % verbs.length]}("${w.dataset.win}")`;
    }, 1200);
    step++;
  };
  if (!reduce) window.setInterval(tick, 2800);
}
