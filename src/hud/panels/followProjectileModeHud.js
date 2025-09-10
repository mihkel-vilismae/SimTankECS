import {  mountPanel, destroyPanel, ensureHudRoot } from "../core/hudCommon.js";
import {createButton} from "../elements/createButton.js";
import {createPanel} from "../elements/createPanel.js";

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
      const next = !world.followGunProjectileEnabled;
      world.followGunProjectileEnabled = next;
      if (next) {
        world.cameraBaselineMode = world.cameraMode || "follow_gun";
        world.cameraMode = "follow_gun"; // (1) switch immediately
      } else {
        // turn OFF: clear any pending projectile follow
        world.followProjectileTargetId = null;
        world.followProjectileStartTime = null;
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
