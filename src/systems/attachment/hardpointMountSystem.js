import { Logger } from "../../utils/logger.js";

/**
 * Applies parent Hardpoint slot transform to children with Mount, writing to child Transform.
 */
export function hardpointMountSystem(dt, world, registry) {
  const mounts = registry.query(["Mount", "Transform"]);
  for (const child of mounts) {
    const m = child.components.Mount;
    if (!m?.parent || !m.slotId) continue;
    const parent = registry.getById(m.parent);
    if (!parent) continue;
    const hp = parent.components?.Hardpoints;
    const pt = parent.components?.Transform;
    const ct = child.components.Transform;
    if (!hp || !pt || !ct) continue;

    const slot = hp.slots.find(s => s.id === m.slotId);
    if (!slot) continue;

    // Parent world (use only yaw from parent rotation for simplicity)
    const cy = Math.cos(pt.rotation.yaw), sy = Math.sin(pt.rotation.yaw);

    // Slot local -> parent space
    const sx = slot.localPos?.x ?? 0, syy = slot.localPos?.y ?? 0, sz = slot.localPos?.z ?? 0;
    const px = pt.position.x + (sx * cy + sz * sy);
    const py = pt.position.y + syy;
    const pz = pt.position.z + (sz * cy - sx * sy);

    // Child position (apply mount offset local first order small)
    const off = m.offset ?? { pos:{x:0,y:0,z:0}, yaw:0, pitch:0, roll:0 };
    const ox = off.pos?.x ?? 0, oy = off.pos?.y ?? 0, oz = off.pos?.z ?? 0;
    const cx = px + (ox * cy + oz * sy);
    const cz = pz + (oz * cy - ox * sy);
    const cyaw = (pt.rotation.yaw + (slot.localYaw ?? 0) + (off.yaw ?? 0));

    ct.position.x = cx;
    ct.position.y = py + oy;
    ct.position.z = cz;
    ct.rotation.yaw = cyaw + (child.components?.Turret?.yaw ?? 0);
    // If it's a gun, pitch is applied here
    if (child.components?.Gun) {
      ct.rotation.pitch = child.components.Gun.pitch;
    }
  }
  Logger.info("[hardpointMountSystem] applied");
}
