// ⌘K command palette over a native <dialog>.
import { track } from "./track";
import { toggleTheme } from "./theme";

export function initPalette() {
  const dlg = document.querySelector<HTMLDialogElement>("[data-palette]");
  const input = document.querySelector<HTMLInputElement>("#palette-q");
  if (!dlg || !input) return;
  const items = [...dlg.querySelectorAll<HTMLLIElement>("li[role=option]")];
  const empty = dlg.querySelector<HTMLElement>(".empty");
  let active = 0;

  const shown = () => items.filter((i) => !i.hidden);
  const select = (n: number) => {
    const list = shown();
    if (!list.length) return;
    active = (n + list.length) % list.length;
    items.forEach((i) => i.setAttribute("aria-selected", "false"));
    list[active].setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", list[active].id);
    list[active].scrollIntoView({ block: "nearest" });
  };
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    items.forEach((i) => { i.hidden = !!q && !i.textContent!.toLowerCase().includes(q); });
    if (empty) empty.hidden = shown().length > 0;
    select(0);
  };
  const open = (via: string) => {
    if (dlg.open) return;
    input.value = "";
    filter();
    dlg.showModal();
    input.focus();
    track("palette", via);
  };
  const run = (li: HTMLLIElement) => {
    const { href, action, external } = li.dataset;
    dlg.close();
    track("palette:run", li.querySelector(".l")?.textContent ?? "");
    if (action === "theme") {
      toggleTheme("palette");
    } else if (action === "copy") {
      navigator.clipboard?.writeText(location.href).catch(() => {});
    } else if (href) {
      if (href.startsWith("mailto:")) location.href = href;
      else if (external) window.open(href, "_blank", "noopener,noreferrer");
      else location.href = href;
    }
  };

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : open("keys"); }
    else if (e.key === "/" && !dlg.open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); open("slash"); }
  });
  document.querySelectorAll("[data-palette-open]").forEach((b) => b.addEventListener("click", () => open("button")));
  input.addEventListener("input", filter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); select(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); select(active - 1); }
    else if (e.key === "Enter") { e.preventDefault(); const li = shown()[active]; if (li) run(li); }
  });
  items.forEach((li) => {
    li.addEventListener("click", () => run(li));
    li.addEventListener("pointermove", () => select(shown().indexOf(li)));
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}
