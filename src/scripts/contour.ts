// Generative contour terrain drawn with marching squares on a canvas.
// One loop drives every [data-contour] canvas; each pauses while offscreen.

type Peak = { x: number; y: number; h: number; boost: number; target: number };
type Field = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  peaks: Peak[];
  levels: number;
  cell: number;
  mx: number;
  my: number;
  bump: number;
  bumpTarget: number;
  visible: boolean;
  drift: number;
};

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fields: Field[] = [];
let rgb = "47 107 79";
let accent = "#1d3cff";
let t = 0;
let running = false;

const presets: Record<string, { peaks: [number, number, number][]; levels: number; drift: number }> = {
  hero: { peaks: [[0.78, 0.3, 0.9], [0.58, 0.72, 0.55], [0.18, 0.2, 0.35]], levels: 16, drift: 1 },
  contact: { peaks: [[0.82, 0.55, 0.8], [0.3, 0.8, 0.4]], levels: 12, drift: 0.7 },
  case: { peaks: [[0.75, 0.35, 0.85], [0.35, 0.6, 0.4]], levels: 12, drift: 0.6 },
};

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  rgb = cs.getPropertyValue("--contour").trim() || rgb;
  accent = cs.getPropertyValue("--accent").trim() || accent;
}

function size(f: Field) {
  const r = f.el.getBoundingClientRect();
  const d = Math.min(devicePixelRatio || 1, 2);
  f.w = r.width;
  f.h = r.height;
  f.el.width = Math.max(1, Math.round(r.width * d));
  f.el.height = Math.max(1, Math.round(r.height * d));
  f.ctx.setTransform(d, 0, 0, d, 0, 0);
  f.cell = r.width < 700 ? 11 : 8;
}

function height(f: Field, u: number, v: number) {
  const aspect = f.w / Math.max(f.h, 1);
  let z = 0;
  for (const p of f.peaks) {
    const dx = (u - p.x) * aspect;
    const dy = v - p.y;
    z += (p.h + p.boost) * Math.exp(-(dx * dx + dy * dy) / 0.06);
  }
  if (f.bump > 0.001) {
    const dx = (u - f.mx) * aspect;
    const dy = v - f.my;
    z += f.bump * 0.75 * Math.exp(-(dx * dx + dy * dy) / 0.012);
  }
  const s = t * f.drift;
  z += 0.07 * Math.sin(u * 7 + s) * Math.cos(v * 5 - s * 0.7) + 0.04 * Math.sin((u + v) * 13 - s * 1.3);
  return z;
}

function draw(f: Field) {
  const { ctx, w, h, cell } = f;
  ctx.clearRect(0, 0, w, h);
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const grid: Float32Array[] = [];
  for (let j = 0; j <= rows; j++) {
    const row = new Float32Array(cols + 1);
    for (let i = 0; i <= cols; i++) row[i] = height(f, (i * cell) / w, (j * cell) / h);
    grid.push(row);
  }
  const step = 1.1 / f.levels;
  for (let L = 1; L <= f.levels; L++) {
    const lv = L * step - 0.05;
    const major = L % 4 === 0;
    ctx.beginPath();
    ctx.lineWidth = major ? 1.15 : 0.7;
    ctx.strokeStyle = `rgb(${rgb} / ${major ? 0.62 : 0.3})`;
    for (let j = 0; j < rows; j++) {
      const r0 = grid[j], r1 = grid[j + 1];
      for (let i = 0; i < cols; i++) {
        const a = r0[i], b = r0[i + 1], c = r1[i + 1], d = r1[i];
        const code = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const x = i * cell, y = j * cell;
        const tx = x + cell * ((lv - a) / (b - a)), ty = y;
        const rx = x + cell, ry = y + cell * ((lv - b) / (c - b));
        const bx = x + cell * ((lv - d) / (c - d)), by = y + cell;
        const lx = x, ly = y + cell * ((lv - a) / (d - a));
        switch (code) {
          case 1: case 14: ctx.moveTo(lx, ly); ctx.lineTo(bx, by); break;
          case 2: case 13: ctx.moveTo(bx, by); ctx.lineTo(rx, ry); break;
          case 3: case 12: ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); break;
          case 4: case 11: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); break;
          case 6: case 9: ctx.moveTo(tx, ty); ctx.lineTo(bx, by); break;
          case 7: case 8: ctx.moveTo(lx, ly); ctx.lineTo(tx, ty); break;
          case 5: ctx.moveTo(lx, ly); ctx.lineTo(tx, ty); ctx.moveTo(bx, by); ctx.lineTo(rx, ry); break;
          case 10: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); ctx.moveTo(lx, ly); ctx.lineTo(bx, by); break;
        }
      }
    }
    ctx.stroke();
  }
  // Highlight boosted peaks with a survey mark
  for (const p of f.peaks) {
    if (p.boost < 0.05) continue;
    ctx.strokeStyle = accent;
    ctx.globalAlpha = Math.min(1, p.boost * 3);
    ctx.lineWidth = 1.5;
    const x = p.x * w, y = p.y * h;
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 12); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function frame() {
  let any = false;
  for (const f of fields) {
    f.bump += (f.bumpTarget - f.bump) * 0.07;
    let settling = Math.abs(f.bumpTarget - f.bump) > 0.002;
    for (const p of f.peaks) {
      p.boost += (p.target - p.boost) * 0.1;
      if (Math.abs(p.target - p.boost) > 0.002) settling = true;
    }
    if (f.visible && (!reduce || settling)) { draw(f); any = true; }
  }
  t += 0.006;
  running = any && !document.hidden;
  if (running) requestAnimationFrame(frame);
}

function kick() {
  if (!running && !document.hidden) { running = true; requestAnimationFrame(frame); }
}

export function setPeak(el: HTMLCanvasElement, index: number, on: boolean) {
  const f = fields.find((x) => x.el === el);
  if (!f || !f.peaks[index]) return;
  f.peaks[index].target = on ? 0.35 : 0;
  kick();
}

export function initContours() {
  readColors();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const f = fields.find((x) => x.el === e.target);
      if (f) f.visible = e.isIntersecting;
    }
    kick();
  });

  document.querySelectorAll<HTMLCanvasElement>("canvas[data-contour]").forEach((el) => {
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const kind = el.dataset.contour ?? "hero";
    const preset = presets[kind] ?? presets.hero;
    const raw: [number, number, number][] = el.dataset.peaks ? JSON.parse(el.dataset.peaks) : preset.peaks;
    const f: Field = {
      el, ctx, w: 0, h: 0, cell: 8, mx: 0.5, my: 0.5, bump: 0, bumpTarget: 0, visible: false,
      peaks: raw.map(([x, y, h]) => ({ x, y, h, boost: 0, target: 0 })),
      levels: kind === "impact" ? 14 : preset.levels,
      drift: kind === "impact" ? 0.4 : preset.drift,
    };
    size(f);
    fields.push(f);
    io.observe(el);
    draw(f);

    const host = el.parentElement ?? el;
    host.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      f.mx = (e.clientX - r.left) / r.width;
      f.my = (e.clientY - r.top) / r.height;
      f.bumpTarget = 1;
      kick();
    });
    host.addEventListener("pointerleave", () => { f.bumpTarget = 0; kick(); });
  });

  let rt = 0;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { fields.forEach((f) => { size(f); draw(f); }); }, 120);
  });
  document.addEventListener("visibilitychange", kick);
  new MutationObserver(() => { readColors(); fields.forEach(draw); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); fields.forEach(draw); });
  kick();
}
