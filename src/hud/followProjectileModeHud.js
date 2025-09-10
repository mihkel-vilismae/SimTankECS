import { createPanel, mountPanel, destroyPanel, ensureHudRoot, createButton } from "./hudCommon.js";

export function createFollowProjectileModeHUD({ getWorld } = {}) {
  const panel = createPanel({ id: "hud-follow-proj", title: "View: Follow Gun / Projectile" });
  let btn;

  function render() {
    const w = getWorld?.();
    const enabled = !!(w && w.followGunProjectileEnabled);
    panel.body.innerHTML = "";
    btn = createButton(enabled ? "Mode: ON (Follow Gun / Projectile)" : "Mode: OFF (Click to Enable)", () => {
      const world = getWorld?.();
      if (!world) return;
      world.followGunProjectileEnabled = !world.followGunProjectileEnabled;
      if (world.followGunProjectileEnabled) {
        world.cameraMode = "follow_gun";
        world.cameraBaselineMode = "follow_gun";
      }
      render();
    });
    panel.body.appendChild(btn);
  }

  function mount(container) { mountPanel(panel, container ?? ensureHudRoot()); render(); }
  function unmount() { destroyPanel(panel); }
  function update(){ render(); }

  return { mount, unmount, update };
}
