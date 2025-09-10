import { createPanel, mountPanel, destroyPanel, ensureHudRoot } from "../core/hudCommon.js";
import {createButton} from "../elements/createButton.js";

export function createDebugCollidersHUD({ getWorld } = {}){
  const panel = createPanel({ id: "hud-debug-colliders", title: "Debug: Colliders" });
  function render(){
    const w = getWorld?.();
    panel.body.innerHTML = "";
    const on = !!(w && w.debugColliders);
    const btn = createButton(on ? "AABB Overlay: ON" : "AABB Overlay: OFF", () => {
      const ww = getWorld?.(); if (!ww) return;
      ww.debugColliders = !ww.debugColliders;
      render();
    });
    panel.body.appendChild(btn);
  }
  function mount(container){ mountPanel(panel, container ?? ensureHudRoot()); render(); }
  function unmount(){ destroyPanel(panel); }
  function update(){ render(); }
  return { mount, unmount, update };
}
