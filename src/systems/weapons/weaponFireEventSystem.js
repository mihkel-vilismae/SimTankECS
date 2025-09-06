import { Logger } from "../../utils/logger.js";

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
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    const lp = emitter?.localPos || { x:0, y:0, z:0.55 };
    const offX = (lp.x * cy + lp.z * sy);
    const offZ = (lp.z * cy - lp.x * sy);
    const worldPos = {
      x: t.position.x + offX,
      y: t.position.y + (lp.y || 0),
      z: t.position.z + offZ,
    };
    // forward (+Z rotated by yaw/pitch)
    const forward = { x: cp * sy, y: sp, z: cp * cy };

    world.vfxQueue.push({ entityId: e.id, preset, worldPos, forward });

    // registry has no removeComponent; just delete the marker from the entity
    registry.removeComponent(e, "FireEvent");
    Logger.info("[weaponFireEventSystem] queued VFX", { preset });
  }
}