import { Logger } from "../../utils/logger.js";
import { muzzleForward, rotateXZByYaw } from "../../aim/math.js";

/** Collect FireEvent from guns into world.vfxQueue and clear the event. */
export function weaponFireEventSystem(dt, world, registry) {
  world.vfxQueue = world.vfxQueue || [];
  const fired = registry.query(["Gun", "FireEvent", "Transform"]);
  for (const e of fired) {
    const emitter = registry.getComponent(e, "VfxEmitter");
    const preset = emitter?.preset || (registry.getComponent(e, "Gun").type === "Cannon" ? "CANNON_MUZZLE" : "MG_MUZZLE");

    // Compute muzzle world position & forward
    const t = registry.getComponent(e, "Transform");
    const yaw = t.rotation.yaw + (emitter?.localYaw ?? 0);
    const pitch = (registry.getComponent(e, "Gun").pitch || 0) + (emitter?.localPitch ?? 0);
    const lp = emitter?.localPos || { x:0, y:0, z:0.55 };
    const off = rotateXZByYaw(lp.x, lp.z, yaw);
    const worldPos = {
      x: t.position.x + off.x,
      y: t.position.y + (lp.y || 0),
      z: t.position.z + off.z,
    };
    const forward = muzzleForward(yaw, pitch);

    world.vfxQueue.push({ entityId: e.id, preset, worldPos, forward });

    // registry has no removeComponent; just delete the marker from the entity
    registry.removeComponent(e, "FireEvent");
    Logger.info("[weaponFireEventSystem] queued VFX", { preset });
  }
}