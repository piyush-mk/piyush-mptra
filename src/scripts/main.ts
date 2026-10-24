import { initContours } from "./contour";
import { initKinetic } from "./kinetic";
import { initDesk } from "./desk";
import { initPalette } from "./palette";
import { initThemeToggle } from "./theme";
import { initTracking, track } from "./track";

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

// Copy buttons: copy the address, confirm briefly
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) =>
  b.addEventListener("click", () => {
    navigator.clipboard?.writeText(b.dataset.copy ?? "").then(() => {
      b.textContent = "Copied";
      window.setTimeout(() => (b.textContent = "Copy"), 1600);
    }).catch(() => {});
    track("click", "copy:email");
  }),
);

// Hackathon photo viewer
function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>("[data-lightbox-dialog]");
  const img = document.querySelector<HTMLImageElement>("[data-lightbox-img]");
  if (!dlg || !img) return;
  document.querySelectorAll<HTMLButtonElement>("[data-lightbox]").forEach((b) =>
    b.addEventListener("click", () => {
      img.src = b.dataset.lightbox ?? "";
      img.alt = b.dataset.alt ?? "";
      dlg.showModal();
      track("photo", b.dataset.alt ?? "");
    }),
  );
  dlg.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

initLightbox();
initThemeToggle();
initReveal();
initContours();
initKinetic();
initDesk();
initPalette();
initTracking();
