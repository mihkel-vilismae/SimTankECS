import { createPanel, mountPanel, destroyPanel, ensureHudRoot, renderKV } from "./hudCommon.js";

/**
 * ControlledObjectHUD
 * Shows data about the entity currently controlled with WSAD.
 * Uniform interface: { mount, unmount, update(ent) }
 * Back-compat: setData(ent)
 */
export function createControlledObjectHUD() {
  const panel = createPanel({ id: "hud-controlled", title: "ControlledObjectHUD" });

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
  }

  function unmount() {
    destroyPanel(panel);
  }

  function update(ent) {
    if (!ent) {
      renderKV(panel.body, [["status", "no controlled entity"]]);
      return;
    }
    const t = ent.components?.Transform;
    const isBall = !!ent.components?.Flight;
    const type = isBall ? "ball" : "tank";
    renderKV(panel.body, [
      ["type", type],
      ["id", String(ent.id)],
      [
        "pos",
        t ? `(${t.position.x.toFixed(2)}, ${t.position.y.toFixed(2)}, ${t.position.z.toFixed(2)})` : "-"
      ],
      ["yaw", t ? t.rotation.yaw.toFixed(2) : "-"],
    ]);
  }

  // Back-compat alias
  const setData = (ent) => update(ent);

  return { mount, unmount, update, setData };
}
