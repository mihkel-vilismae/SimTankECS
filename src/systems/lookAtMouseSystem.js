import { normalizeAngle } from "../utils/math3d.js";
import { Logger } from "../utils/logger.js";

export function lookAtMouseSystem(dt, world, registry) {
  if (!world.mouse?.worldPoint) return;
  const p = world.mouse.worldPoint;
  for (const e of registry.query(["Transform", "MouseFollower"])) {
    const t = e.components.Transform;
    const m = e.components.MouseFollower;
    const dx = p.x - t.position.x;
    const dz = p.z - t.position.z;
    const targetYaw = Math.atan2(dx, dz);
    const dyaw = targetYaw - t.rotation.yaw;
    t.rotation.yaw = normalizeAngle(t.rotation.yaw + dyaw * (m.yawLerp ?? 0.15));
  }
  Logger.info("[lookAtMouseSystem] applied");
}
