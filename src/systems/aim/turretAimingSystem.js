import { normalizeAngle, clamp } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

/**
 * Rotate turret (mounted to hull) to face world.mouse.worldPoint.
 * Targets turret entities whose Mount.parent === controlled entity id.
 */
export function turretAimingSystem(dt, world, registry) {
  if (!world.mouse?.worldPoint) return;
  const hullId = world.control?.entityId;
  if (!hullId) return;

  const turrets = registry.query(["Turret", "Mount", "Transform"]);
  for (const t of turrets) {
    if (registry.getComponent(t, "Mount").parent !== hullId) continue;
    const tt = registry.getComponent(t, "Turret");
    const tr = registry.getComponent(t, "Transform");
    const target = world.mouse.worldPoint;
    const dx = target.x - tr.position.x;
    const dz = target.z - tr.position.z;
    const targetYaw = Math.atan2(dx, dz);
    const current = tt.yaw ?? 0;
    let dy = normalizeAngle(targetYaw - tr.rotation.yaw - current);
    const step = clamp(dy, -tt.yawSpeed * dt, tt.yawSpeed * dt);
    tt.yaw = clamp(current + step, tt.yawMin, tt.yawMax);
  }
  Logger.info("[turretAimingSystem] updated");
}