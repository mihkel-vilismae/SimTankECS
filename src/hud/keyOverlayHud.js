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
    .key { border: 1px solid #777; border-radius: 6px; padding: 8px 0; text-align: center; font-family: monospace; opacity: 0.65; transition: all 120ms ease; }
    .key--wide { grid-column: span 3; }
    .key--active { background: #e9f1ff; border-color: #a8c7ff; opacity: 1; box-shadow: 0 0 10px rgba(168,199,255,0.6); }
    .row { grid-column: 1 / -1; display: contents; }
  `;
  style.minWidth = "280px";
  document.head.appendChild(style);


  const grid = document.createElement("div");
  grid.className = "keygrid";

  const keyElems = new Map();
  function makeKey(k) {
    const div = document.createElement("div");
    div.className = "key" + (k.code === "Space" ? " key--wide" : "");
    div.textContent = k.label;
    keyElems.set(k.code, div);
    grid.appendChild(div);
  }

  // Layout rows: Q W E / A S D / Space
  makeKey(KEYS[0]); makeKey(KEYS[1]); makeKey(KEYS[2]);
  makeKey(KEYS[3]); makeKey(KEYS[4]); makeKey(KEYS[5]);
  makeKey(KEYS[6]);

  panel.body.appendChild(grid);

  let rafId = 0;
  function tick() {
    const w = getWorld?.();
    const pressed = (w && w.input && w.input.keys) ? w.input.keys : {};
    for (const [code, el] of keyElems.entries()) {
      if (pressed[code]) el.classList.add("key--active");
      else el.classList.remove("key--active");
    }
    rafId = requestAnimationFrame(tick);
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    tick();
  }
  function unmount() {
    cancelAnimationFrame(rafId);
    destroyPanel(panel);
  }
  function update(){}

  return { mount, unmount, update };
}
