import { createPanel, mountPanel, destroyPanel, ensureHudRoot, renderKV } from "./hudCommon.js";

/**
 * ControlledObjectHUD
 * Shows data about the entity currently controlled with WSAD.
 * Uniform interface: { mount, unmount, update(ent) }
 * Back-compat: setData(ent)
 */
export function createControlledObjectHUD() {
  function collectWeapons(registry, hullEnt) {
    if (!hullEnt) return [];
    const all = registry.query(["Gun","Mount","Transform"]);
    const result = [];
    for (const g of all) {
      const parent = registry.getById(g.components.Mount.parent);
      if (parent?.components?.Turret) {
        // Ensure turret is mounted to this hull
        if (parent.components.Mount?.parent === hullEnt.id) {
          const gun = g.components.Gun;
          result.push({ id: g.id, type: gun.type, ammo: gun.ammo, cooldown: gun.cooldown });
        }
      }
    }
    return result.sort((a,b)=> (a.type<b.type?-1:1));
  }

  const panel = createPanel({ id: "hud-controlled", title: "ControlledObjectHUD" });

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
  }

  function unmount() {
    destroyPanel(panel);
  }

  function update(payload) {
    const ent = payload?.ent ?? payload;
    const registry = payload?.registry;
    if (!ent) {
      const weapons = registry ? collectWeapons(registry, ent) : [];
    renderKV(panel.body, [["status", "no controlled entity"]]);
      return;
    }
    const t = ent.components?.Transform;
    const isBall = !!ent.components?.Flight;
    const type = isBall ? "ball" : "tank";
    const weapons = registry ? collectWeapons(registry, ent) : [];
    renderKV(panel.body, [
      ["type", type],
      ["id", String(ent.id)],
      [
        "pos",
        t ? `(${t.position.x.toFixed(2)}, ${t.position.y.toFixed(2)}, ${t.position.z.toFixed(2)})` : "-"
      ],
      ["yaw", t ? t.rotation.yaw.toFixed(2) : "-"],
      ["weapons", weapons.length? weapons.map(w=>w.type).join(", "): "-"],
      ["ammo", weapons.length? weapons.map(w=>`${w.type[0]}:${w.ammo}`).join("  "): "-"],
    ]);
  }

  // Back-compat alias
  const setData = (ent) => update(ent);

  return { mount, unmount, update, setData };
}
