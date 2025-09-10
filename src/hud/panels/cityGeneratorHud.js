import { ensureHudRoot, mountPanel, destroyPanel } from "../core/hudCommon.js";
import {createButton} from "../elements/createButton.js";
import {makeSlider} from "../elements/createSlider.js";
import {createPanel} from "../elements/createPanel.js";

export function createCityGeneratorHUD({ getWorld, getRegistry } = {}) {
  const panel = createPanel({ id: "hud-city-gen", title: "City Generator" });


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
