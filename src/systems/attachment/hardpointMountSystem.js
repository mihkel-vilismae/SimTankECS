import { Logger } from "../../utils/logger.js";

/**
 * Applies parent Hardpoint slot transform to children with Mount, writing to child Transform.
 * Recoil is applied along the gun's local -Z (barrel backwards), taking pitch and yaw into account.
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

    const slot = hp.slots?.find(s => s.id === m.slotId);
    if (!slot) continue;

    // Parent yaw + slot yaw
    const yaw = pt.rotation.yaw + (slot.localYaw ?? 0);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);

    // Slot base in world (apply parent yaw on XZ)
    const sx = slot.localPos?.x ?? 0;
    const syLocal = slot.localPos?.y ?? 0;
    const sz = slot.localPos?.z ?? 0;

    const baseX = pt.position.x + (sx * cy + sz * sy);
    const baseY = pt.position.y + syLocal;
    const baseZ = pt.position.z + (sz * cy - sx * sy);

    // Mount offset in local -> rotate by yaw to world
    const off = m.offset ?? { pos:{x:0,y:0,z:0}, yaw:0, pitch:0, roll:0 };
    const ox = off.pos?.x ?? 0, oy0 = off.pos?.y ?? 0, oz0 = off.pos?.z ?? 0;
    const offX = (ox * cy + oz0 * sy);
    const offZ = (oz0 * cy - ox * sy);

    // Recoil offset in world (only for guns)
    let recX = 0, recY = 0, recZ = 0;
    if (child.components?.Gun) {
      const g = child.components.Gun;
      const r = g.recoilOffset || 0;
      const pitch = g.pitch || 0;
      // Local recoil vector: (0, -r*sin(pitch), -r*cos(pitch))
      recY = -r * Math.sin(pitch);
      const localZ = -r * Math.cos(pitch);
      // Rotate by yaw into world
      recX = localZ * sy;
      recZ = localZ * cy;
    }

    // Final world position
    ct.position.x = baseX + offX + recX;
    ct.position.y = baseY + oy0 + recY;
    ct.position.z = baseZ + offZ + recZ;

    // Rotation yaw and pitch
    const cyaw = yaw + (off.yaw ?? 0);
    ct.rotation.yaw = cyaw + (child.components?.Turret?.yaw ?? 0);
    if (child.components?.Gun) {
      ct.rotation.pitch = child.components.Gun.pitch;
    }
  }
  Logger.info("[hardpointMountSystem] applied");
}
