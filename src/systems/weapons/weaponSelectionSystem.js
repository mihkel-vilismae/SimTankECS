import { Logger } from "../../utils/logger.js";

/**
 * Cycle selected weapon with mouse wheel (middle scroll).
 * Stores selected gun id in world.weapons.selectedId.
 */
export function weaponSelectionSystem(dt, world, registry) {
  const hullId = world.control?.entityId;
  if (!hullId) return;
  const mouse = world.input?.mouse;
  if (!mouse) return;

  const guns = registry.query(["Gun","Mount"]);
  const list = [];
  for (const e of guns) {
    const parent = registry.getById(registry.getComponent(e, "Mount").parent);
    if (parent?.components?.Turret && registry.getComponent(parent, "Mount")?.parent === hullId) {
      list.push(e);
    }
  }
  if (!list.length) return;
  list.sort((a,b)=> (registry.getComponent(a, "Gun").type < registry.getComponent(b, "Gun").type ? -1 : 1));

  world.weapons = world.weapons || {};
  if (!world.weapons.selectedId || !list.find(g => g.id === world.weapons.selectedId)) {
    world.weapons.selectedId = list[0].id;
  }

  const delta = Math.sign(mouse.wheelDelta || 0);
  if (delta !== 0) {
    const idx = list.findIndex(g => g.id === world.weapons.selectedId);
    const next = (idx - delta) % list.length; // scrolling up -> previous
    const wrapped = next < 0 ? next + list.length : next;
    world.weapons.selectedId = list[wrapped].id;
    mouse.wheelDelta = 0;
    Logger.info("[weaponSelectionSystem] selected", { selectedId: world.weapons.selectedId });
  }
}