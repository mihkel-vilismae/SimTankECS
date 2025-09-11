import * as THREE from "three";
import { ensureHudRoot } from "../core/hudCommon.js";

export function createFloatingTextHUD({ getWorld, getRegistry } = {}) {
  const root = ensureHudRoot();
  const layer = document.createElement("div");
  layer.id = "hud-floating-text";
  Object.assign(layer.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "1000"
  });

  const items = []; // {el, born, life, pos:{x,y,z}, vy, vx, color}

  function spawn(entry) {
    const el = document.createElement("div");
    el.textContent = entry.text ?? "";
    Object.assign(el.style, {
      position: "absolute",
      transform: "translate(-50%,-50%)",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: "700",
      fontSize: "14px",
      color: entry.color || "#ff6666",
      textShadow: "0 1px 0 rgba(0,0,0,0.35)",
      opacity: "1"
    });
    layer.appendChild(el);
    items.push({
      el,
      born: performance.now(),
      life: entry.life ?? 900,
      pos: { x: entry.pos.x, y: entry.pos.y, z: entry.pos.z },
      vy: 0.6 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.2,
      color: entry.color || "#ff6666"
    });
  }

  let raf = 0;
  const v = new THREE.Vector3();
  function tick() {
    const world = getWorld?.();
    const registry = getRegistry?.();
    if (!world || !world.camera || !world.renderer) { raf = requestAnimationFrame(tick); return; }
    // Consume queue
    const q = world.floatingTextQueue || [];
    world.floatingTextQueue = [];
    for (const entry of q) spawn(entry);

    const cam = world.camera;
    const halfW = world.renderer.domElement.clientWidth / 2;
    const halfH = world.renderer.domElement.clientHeight / 2;

    const now = performance.now();

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const t = (now - it.born);
      const a = 1 - Math.min(1, t / it.life);
      const yoff = (t / 1000) * it.vy * 40;
      const xoff = (t / 1000) * it.vx * 40;
      const y3 = it.pos.y + (t / 1000) * it.vy;

      v.set(it.pos.x, y3, it.pos.z).project(cam);
      const sx = (v.x * halfW) + halfW + xoff;
      const sy = (-v.y * halfH) + halfH - yoff;

      it.el.style.left = sx + "px";
      it.el.style.top  = sy + "px";
      it.el.style.opacity = String(Math.max(0, a * a)); // curve for nicer fade

      if (t >= it.life) {
        if (it.el.parentNode) it.el.parentNode.removeChild(it.el);
        items.splice(i, 1);
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function mount() { if (!document.getElementById(layer.id)) root.appendChild(layer); raf = requestAnimationFrame(tick); }
  function unmount(){ cancelAnimationFrame(raf); if (layer.parentNode) layer.parentNode.removeChild(layer); }
  function update(){}

  return { mount, unmount, update };
}
