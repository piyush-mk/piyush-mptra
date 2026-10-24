import { initContours, setPeak } from "./contour";
import { initKinetic } from "./kinetic";
import { initDesk } from "./desk";
import { initPalette } from "./palette";
import { initTracking } from "./track";

// Reveal anything at or above the lower edge of the viewport, including elements skipped by a fast scroll
function initReveal() {
  let pending = [...document.querySelectorAll<HTMLElement>(".reveal")];
  let queued = false;
  const check = () => {
    queued = false;
    const edge = innerHeight * 0.92;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < edge) { el.classList.add("in"); return false; }
      return true;
    });
    if (!pending.length) removeEventListener("scroll", onScroll);
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  check();
}

// Impact map: place pins and link the legend to the peaks
function initImpact() {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-contour=impact]");
  if (!canvas) return;
  const pins = [...document.querySelectorAll<HTMLElement>("[data-pin]")];
  pins.forEach((p) => {
    p.style.left = `${Number(p.dataset.x) * 100}%`;
    p.style.top = `${Number(p.dataset.y) * 100}%`;
  });
  document.querySelectorAll<HTMLElement>("[data-peak]").forEach((li) => {
    const i = Number(li.dataset.peak);
    const on = (v: boolean) => { setPeak(canvas, i, v); pins[i]?.classList.toggle("on", v); li.classList.toggle("on", v); };
    li.addEventListener("pointerenter", () => on(true));
    li.addEventListener("pointerleave", () => on(false));
    li.addEventListener("focus", () => on(true));
    li.addEventListener("blur", () => on(false));
  });
}

initReveal();
initContours();
initImpact();
initKinetic();
initDesk();
initPalette();
initTracking();
