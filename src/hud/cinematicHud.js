import { createPanel, mountPanel, destroyPanel, ensureHudRoot, createButton } from "./hudCommon.js";

export function createCinematicHUD({ getWorld } = {}) {
  const panel = createPanel({ id: "hud-cinematic", title: "Explosion Cinematic" });
  let btn, btnReturn;

  function render() {
    const world = getWorld?.();
    const enabled = world?.cinematicEnabled !== false;
    panel.body.innerHTML = "";
    btn = createButton(enabled ? "Cinematic: ON" : "Cinematic: OFF", () => {
      const w = getWorld?.();
      if (!w) return;
      w.cinematicEnabled = !(w.cinematicEnabled !== false); // toggle
      btn.textContent = w.cinematicEnabled !== false ? "Cinematic: ON" : "Cinematic: OFF";
    });
    panel.body.appendChild(btn);
    const snap = !!(world && world.cinematicSnapBack);
    btnReturn = createButton(snap ? "Return: SNAP" : "Return: SMOOTH", () => {
      const w = getWorld?.(); if (!w) return;
      w.cinematicSnapBack = !w.cinematicSnapBack;
      btnReturn.textContent = w.cinematicSnapBack ? "Return: SNAP" : "Return: SMOOTH";
    });
    panel.body.appendChild(btnReturn);
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    render();
  }
  function unmount(){ destroyPanel(panel); }
  function update(){ render(); }

  return { mount, unmount, update };
}
