import { Logger } from "../../utils/logger.js";
import { muzzleForward, rotateXZByYaw } from "../../utils/math.js";

/**
 * Applies parent Hardpoint slot transform to children with Mount, writing to child Transform.
 * Recoil is applied along the gun's local -Z (opposite muzzleForward).
 */
export function hardpointMountSystem(dt, world, registry) {
  const mounts = registry.query(["Mount", "Transform"]);
  for (const child of mounts) {
    const m = registry.getComponent(child, "Mount");
    if (!m?.parent || !m.slotId) continue;
    const parent = registry.getById(m.parent);
    if (!parent) continue;
    const hp = registry.getComponent(parent, "Hardpoints");
    const pt = registry.getComponent(parent, "Transform");
    const ct = registry.getComponent(child, "Transform");
    if (!hp || !ct || !pt) continue;

    const slot = hp.slots?.find(s => s.id === m.slotId);
    if (!slot) continue;

    // Parent yaw + slot yaw
    const yaw = (pt.rotation.yaw || 0) + (slot.localYaw ?? 0);

    // Slot world base
    const rotSlot = rotateXZByYaw(slot.localPos?.x ?? 0, slot.localPos?.z ?? 0, yaw);
    const baseX = pt.position.x + rotSlot.x;
    const baseY = pt.position.y + (slot.localPos?.y ?? 0);
    const baseZ = pt.position.z + rotSlot.z;

    // Mount local offset -> rotate by yaw
    const off = m.offset ?? { pos:{x:0,y:0,z:0}, yaw:0, pitch:0, roll:0 };
    const rotOff = rotateXZByYaw(off.pos?.x ?? 0, off.pos?.z ?? 0, yaw);

    // Recoil along -forward (gun only)
    let recX = 0, recY = 0, recZ = 0;
    const gun = registry.getComponent(child, "Gun");
    if (gun) {
      const pitch = gun.pitch || 0;
      const r = gun.recoilOffset || 0;
      const fwd = muzzleForward(yaw, pitch); // world forward (+Z rotated)
      // Backward along barrel
      recX = -r * fwd.x;
      recY = -r * fwd.y;
      recZ = -r * fwd.z;
    }

    // Final world pos
    ct.position.x = baseX + rotOff.x + recX;
    ct.position.y = baseY + (off.pos?.y ?? 0) + recY;
    ct.position.z = baseZ + rotOff.z + recZ;

    // Rotation: yaw from parent+slot+offset+yaw turret; pitch from gun
    const turret = registry.getComponent(child, "Turret");
    ct.rotation.yaw = yaw + (off.yaw ?? 0) + (turret?.yaw ?? 0);
    if (gun) {
      ct.rotation.pitch = gun.pitch || 0;
    }
  }
  Logger.info("[hardpointMountSystem] applied");


// --- recoil direction fix (v2): apply delta opposite forward AFTER base mount, no sticky base ---
(function(){
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);
  try {
    const ents = registry.query?.(["Transform","Gun"]) ?? [];
    for (const child of ents) {
      const t = getC(child, "Transform");
      const g = getC(child, "Gun");
      if (!t || !g) continue;

      const yaw   = t.rotation?.yaw ?? 0;
      const pitch = t.rotation?.pitch ?? 0;
      const recoil = g.recoilOffset ?? 0;

      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const sinY = Math.sin(yaw),   cosY = Math.cos(yaw);
      const fx =  sinY * cosP;
      const fy =  sinP;
      const fz =  cosY * cosP;

      t.position.x -= recoil * fx;
      t.position.y -= recoil * fy;
      t.position.z -= recoil * fz;
    }
  } catch {}
})();
// --- end recoil fix (v2) ---

}