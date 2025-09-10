import * as THREE from "three";
import { ensureHudRoot } from "./hudCommon.js";

export function createHealthBarsHUD({ getWorld, getRegistry } = {}) {
  const root = ensureHudRoot();
  const container = document.createElement("div");
  container.id = "hud-healthbars";
  Object.assign(container.style, {
    position: "fixed",
    top: "0", left: "0", width: "100%", height: "100%",
    pointerEvents: "none",
    zIndex: "999",
  });

  const bars = new Map(); // entityId -> {wrap, inner}

  function makeBar() {
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      position: "absolute", transform: "translate(-50%, -100%)",
      width: "60px", height: "8px", background: "rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.35)", borderRadius: "4px",
      boxShadow: "0 0 6px rgba(0,0,0,0.3)",
    });
    const inner = document.createElement("div");
    Object.assign(inner.style, {
      height: "100%", width: "100%",
      background: "linear-gradient(90deg, #43d17c, #2aa85c)",
      borderRadius: "3px",
    });
    wrap.appendChild(inner);
    container.appendChild(wrap);
    return { wrap, inner };
  }

  let raf = 0;
  const v = new THREE.Vector3();
  function tick() {
    const world = getWorld?.();
    const registry = getRegistry?.();
    if (!world || !registry || !world.camera || !world.renderer) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const cam = world.camera;
    const ents = registry.query ? registry.query(["Transform","Health"]) : [];

    // mark existing as unseen
    for (const [id, obj] of bars.entries()) obj._seen = false;

    for (const e of ents) {
      const id = e.id;
      const t = registry.getComponent(e, "Transform");
      const h = registry.getComponent(e, "Health");
      if (!t || !h) continue;

      // bar anchor slightly above entity origin
      v.set(t.position.x, t.position.y + 2.0, t.position.z).project(cam);
      const halfW = world.renderer.domElement.clientWidth / 2;
      const halfH = world.renderer.domElement.clientHeight / 2;
      const sx = (v.x * halfW) + halfW;
      const sy = (-v.y * halfH) + halfH;

      let bar = bars.get(id);
      if (!bar) { bar = makeBar(); bars.set(id, bar); }
      bar._seen = true;

      // Position
      bar.wrap.style.left = sx + "px";
      bar.wrap.style.top  = sy + "px";

      // Width based on distance (smaller farther away)
      const dx = cam.position.x - t.position.x;
      const dy = cam.position.y - t.position.y;
      const dz = cam.position.z - t.position.z;
      const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const w = Math.max(38, Math.min(80, 80 - (d*0.6)));
      bar.wrap.style.width = w + "px";

      // Fill
      const pct = Math.max(0, Math.min(1, h.hp / h.max));
      bar.inner.style.width = (pct * 100) + "%";
      bar.wrap.style.display = (v.z < 1 && v.z > -1) ? "block" : "none";
    }

    // remove unseen
    for (const [id, bar] of Array.from(bars.entries())) {
      if (!bar._seen) {
        if (bar.wrap.parentNode) bar.wrap.parentNode.removeChild(bar.wrap);
        bars.delete(id);
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function mount() { if (!document.getElementById(container.id)) root.appendChild(container); raf = requestAnimationFrame(tick); }
  function unmount() { cancelAnimationFrame(raf); if (container.parentNode) container.parentNode.removeChild(container); }
  function update(){}

  return { mount, unmount, update };
}
