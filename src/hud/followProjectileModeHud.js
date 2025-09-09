import { createPanel, mountPanel, destroyPanel, ensureHudRoot, createButton } from "./hudCommon.js";

export function createFollowProjectileModeHUD({ onToggle } = {}) {
  const panel = createPanel({ id: "hud-follow-proj", title: "View: Follow Gun / Projectile" });
  let enabled = false;
  let btn;

  function render() {
    panel.body.innerHTML = "";
    btn = createButton(enabled ? "Mode: FOLLOW GUN / PROJECTILE" : "Switch to FOLLOW GUN / PROJECTILE", () => {
      enabled = true;
      onToggle?.();
      btn.textContent = "Mode: FOLLOW GUN / PROJECTILE";
    });
    panel.body.appendChild(btn);
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    render();
  }

  function unmount() { destroyPanel(panel); }

  function update(active) {
    enabled = active;
    if (btn) btn.textContent = active ? "Mode: FOLLOW GUN / PROJECTILE" : "Switch to FOLLOW GUN / PROJECTILE";
  }

  return { mount, unmount, update };
}
