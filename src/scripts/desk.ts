// The project desk: an agent cursor walks the windows until a visitor grabs one.
import { track } from "./track";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initDesk() {
  const desk = document.querySelector<HTMLElement>("[data-desk]");
  if (!desk) return;
  const wins = [...desk.querySelectorAll<HTMLElement>("[data-win]")];
  const cursor = desk.querySelector<HTMLElement>("[data-cursor]");
  const log = desk.querySelector<HTMLElement>("[data-desk-log]");
  const heroLine = document.querySelector<HTMLElement>("[data-agent-line]");
  let z = 10;
  let pausedUntil = 0;
  let step = 0;
  let visible = false;

  const front = (w: HTMLElement) => { w.style.zIndex = String(++z); };
  const say = (fn: string, arg: string) => {
    if (!log) return;
    const row = document.createElement("div");
    row.append("> ");
    const em = document.createElement("em");
    em.textContent = fn;
    row.append(em, `(${arg})`);
    log.append(row);
    while (log.children.length > 5) log.firstElementChild?.remove();
  };

  // Voice demo inside the Advaita window
  const voice = desk.querySelector<HTMLElement>("[data-voice]");
  const vstate = desk.querySelector<HTMLElement>("[data-voice-state]");
  let vt = 0;
  const interrupt = () => {
    if (!voice || !vstate) return;
    voice.classList.add("cut");
    vstate.textContent = "stopped · \"wait, I don't get that step\"";
    clearTimeout(vt);
    vt = window.setTimeout(() => {
      vstate.textContent = "re-explaining step 2, slower…";
      voice.classList.remove("cut");
      vt = window.setTimeout(() => (vstate.textContent = "explaining step 2…"), 3200);
    }, 1400);
  };
  desk.querySelector("[data-interrupt]")?.addEventListener("click", () => { interrupt(); track("demo", "advaita:interrupt"); });

  // Dragging (wide screens only; the desk becomes a grid below 1180px)
  const wide = matchMedia("(min-width: 1181px)");
  wins.forEach((w) => {
    w.addEventListener("pointerdown", () => {
      front(w);
      pausedUntil = performance.now() + 15000;
      desk.classList.add("user");
      wins.forEach((x) => x.classList.toggle("focus", x === w));
    });
    const bar = w.querySelector<HTMLElement>("[data-drag]");
    if (!bar) return;
    bar.addEventListener("pointerdown", (e) => {
      if (!wide.matches) return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      const start = { x: e.clientX, y: e.clientY, l: w.offsetLeft, t: w.offsetTop };
      const move = (ev: PointerEvent) => {
        const l = Math.min(Math.max(start.l + ev.clientX - start.x, -w.offsetWidth * 0.5), desk.clientWidth - w.offsetWidth * 0.5);
        const t = Math.min(Math.max(start.t + ev.clientY - start.y, 0), desk.clientHeight - 40);
        w.style.left = `${l}px`;
        w.style.top = `${t}px`;
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); track("desk", `drag:${w.dataset.win}`); };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
    });
  });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.25 }).observe(desk);

  const actions = ["focus", "read", "scroll"];
  const tick = () => {
    const now = performance.now();
    if (now < pausedUntil) return;
    desk.classList.remove("user");
    if (!visible || !wide.matches || !cursor) return;
    const w = wins[step % wins.length];
    const act = actions[step % actions.length];
    const tx = w.offsetLeft + w.offsetWidth * 0.55;
    const ty = w.offsetTop + 70;
    cursor.style.transform = `translate(${tx}px, ${ty}px)`;
    window.setTimeout(() => {
      front(w);
      wins.forEach((x) => x.classList.toggle("focus", x === w));
      say(act, `"${w.dataset.win}"`);
      if (heroLine) heroLine.textContent = `agent · ${act}("${w.dataset.win}")`;
      if (w.dataset.win === "advaita" && step > 3) interrupt();
    }, 1200);
    step++;
  };
  if (!reduce) window.setInterval(tick, 2600);
}
