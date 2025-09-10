import { createPanel, mountPanel, destroyPanel, ensureHudRoot } from "./hudCommon.js";

const KEYS = [
  { code: "KeyQ", label: "Q" },
  { code: "KeyW", label: "W" },
  { code: "KeyE", label: "E" },
  { code: "KeyA", label: "A" },
  { code: "KeyS", label: "S" },
  { code: "KeyD", label: "D" },
  { code: "Space", label: "Space" },
];

export function createKeyOverlayHUD({ getWorld } = {}) {
  const panel = createPanel({ id: "hud-key-overlay", title: "Keys" });

  const style = document.createElement("style");
  style.textContent = `
    .keygrid { display: grid; grid-template-columns: repeat(6, 40px); grid-gap: 6px; align-items: center; }
    .mousegrid { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 6px; margin-top: 8px; }
    .key { border: 1px solid #777; border-radius: 6px; padding: 8px 0; text-align: center; font-family: monospace; opacity: 0.65; transition: all 120ms ease; }
    .key--wide { grid-column: span 3; }
    .key--active { background: #e9f1ff; border-color: #a8c7ff; opacity: 1; box-shadow: 0 0 10px rgba(168,199,255,0.6); }
  `;
  (document.head || document.documentElement).appendChild(style);

  const grid = document.createElement("div");
  grid.className = "keygrid";

  const keyElems = new Map();
  function mk(k) {
    const d = document.createElement("div");
    d.className = "key" + (k.code === "Space" ? " key--wide" : "");
    d.textContent = k.label;
    keyElems.set(k.code, d);
    grid.appendChild(d);
  }
  KEYS.forEach(mk);

  const mouseRow = document.createElement("div");
  mouseRow.className = "mousegrid";
  const mL = document.createElement("div"); mL.className = "key"; mL.textContent = "LMB";
  const mM = document.createElement("div"); mM.className = "key"; mM.textContent = "MMB";
  const mR = document.createElement("div"); mR.className = "key"; mR.textContent = "RMB";
  mouseRow.appendChild(mL); mouseRow.appendChild(mM); mouseRow.appendChild(mR);

  panel.body.appendChild(grid);
  panel.body.appendChild(mouseRow);

  let raf = 0;
  function tick() {
    const w = getWorld?.();
    const pressed = (w && w.input && w.input.keys) ? w.input.keys : {};
    for (const [code, el] of keyElems) {
      if (pressed[code]) el.classList.add("key--active");
      else el.classList.remove("key--active");
    }
    const mb = (w && w.input && w.input.mouse && w.input.mouse.buttons) ? w.input.mouse.buttons : {};
    if (mb.left) mL.classList.add("key--active"); else mL.classList.remove("key--active");
    if (mb.middle) mM.classList.add("key--active"); else mM.classList.remove("key--active");
    if (mb.right) mR.classList.add("key--active"); else mR.classList.remove("key--active");
    raf = requestAnimationFrame(tick);
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    const rootEl = panel.el || panel.body?.parentElement || panel.body;
    if (rootEl && rootEl.style) rootEl.style.minWidth = "300px";
    tick();
  }

  function unmount() { cancelAnimationFrame(raf); destroyPanel(panel); }
  function update() {}

  return { mount, unmount, update };
}
