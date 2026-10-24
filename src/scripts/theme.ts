// Light by default. Dark only when the visitor asks for it; the choice is remembered in localStorage.
import { track } from "./track";

export function toggleTheme(via: string) {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(next === "dark")));
  track("theme", `${next}:${via}`);
}

export function initThemeToggle() {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((b) => {
    b.setAttribute("aria-pressed", String(dark));
    b.addEventListener("click", () => toggleTheme("button"));
  });
}
