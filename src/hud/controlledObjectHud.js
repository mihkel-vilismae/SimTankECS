import { createPanel, renderKV, ensureHudRoot } from "./hudCommon.js";

export function createControlledObjectHUD() {
  const { root, body } = createPanel({ id: "hud-controlled", title: "ControlledObjectHUD" });
  ensureHudRoot().appendChild(root);

  function setData(ent) {
    if (!ent) {
      renderKV(body, [["status", "no controlled entity"]]);
      return;
    }
    const t = ent.components?.Transform;
    const isBall = !!ent.components?.Flight;
    const type = isBall ? "ball" : "tank";
    renderKV(body, [
      ["type", type],
      ["id", String(ent.id)],
      ["pos", t ? `(${t.position.x.toFixed(2)}, ${t.position.y.toFixed(2)}, ${t.position.z.toFixed(2)})` : "-"],
      ["yaw", t ? t.rotation.yaw.toFixed(2) : "-"],
    ]);
  }

  return { setData };
}
