import { ensureHudRoot, createPanel, mountPanel, destroyPanel, createButton } from "./hudCommon.js";

export function createCityGeneratorHUD({ getWorld, getRegistry } = {}) {
  const panel = createPanel({ id: "hud-city-gen", title: "City Generator" });

  function makeSlider(label, min, max, step, get, set) {
    const row = document.createElement("div");
    row.style.margin = "6px 0";
    const l = document.createElement("div"); l.textContent = label; l.style.fontSize="12px"; l.style.opacity="0.85";
    const s = document.createElement("input"); s.type = "range"; s.min = String(min); s.max = String(max); s.step = String(step);
    s.value = String(get());
    const v = document.createElement("span"); v.style.marginLeft = "8px"; v.textContent = s.value;
    s.oninput = () => { v.textContent = s.value; set(parseFloat(s.value)); };
    row.appendChild(l); row.appendChild(s); row.appendChild(v);
    return row;
  }

  function regen() {
    const w = getWorld?.(); const r = getRegistry?.();
    if (!w || !r) return;
    // remove existing buildings
    const ents = r.query ? r.query(["Building"]) : [];
    for (const e of ents) {
      if (e.object3D && e.object3D.parent) e.object3D.parent.remove(e.object3D);
      r.remove(e.id);
    }
    // adjust building count based on density and radius
    const radius = w.worldRadius ?? 220;
    const area = Math.PI * radius * radius;
    const base = Math.max(10, Math.floor(area / (w.cityBlockSize || 18) / 20));
    const density = w.cityDensity ?? 0.8;
    w.buildingCount = Math.max(4, Math.floor(base * density));
    // trigger respawn next tick
    w._buildingsSpawned = false;
  }

  function render() {
    const w = getWorld?.();
    panel.body.innerHTML = "";

    const bs = makeSlider("Block Size", 8, 40, 1,
      () => (w?.cityBlockSize ?? 18),
      (val) => { const ww=getWorld?.(); ww.cityBlockSize = val; });
    const rw = makeSlider("Road Width", 2, 12, 1,
      () => (w?.cityRoadWidth ?? 4),
      (val) => { const ww=getWorld?.(); ww.cityRoadWidth = val; });
    const de = makeSlider("Density", 0.2, 1.5, 0.05,
      () => (w?.cityDensity ?? 0.8),
      (val) => { const ww=getWorld?.(); ww.cityDensity = val; });

    panel.body.appendChild(bs);
    panel.body.appendChild(rw);
    panel.body.appendChild(de);

    const btn = createButton("Regenerate City", regen);
    btn.style.marginTop = "8px";
    panel.body.appendChild(btn);
  }

  function mount(container){ mountPanel(panel, container ?? ensureHudRoot()); render(); }
  function unmount(){ destroyPanel(panel); }
  function update(){ render(); }

  return { mount, unmount, update };
}
