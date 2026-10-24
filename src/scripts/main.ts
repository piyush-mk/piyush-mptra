import { initContours } from "./contour";
import { initKinetic } from "./kinetic";
import { initDesk } from "./desk";
import { initPalette } from "./palette";
import { initThemeToggle } from "./theme";
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

initThemeToggle();
initReveal();
initContours();
initKinetic();
initDesk();
initPalette();
initTracking();
