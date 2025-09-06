import { clamp } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

/**
 * Adjust Gun.pitch to look toward Aim target on ground.
 * Operates on guns whose parent is the controlled entity's turret.
 */
export function weaponElevationSystem(dt, world, registry) {
  if (!world.mouse?.worldPoint) return;
  const hullId = world.control?.entityId;
  if (!hullId) return;

  const guns = registry.query(["Gun", "Mount", "Transform"]);
  for (const g of guns) {
    // Only adjust for guns mounted to any turret parented to the hull
    const parent = registry.getById(g.components.Mount.parent);
    if (!parent?.components?.Turret) continue;

    const gt = g.components.Gun;
    const tr = g.components.Transform;
    const target = world.mouse.worldPoint;

    const dx = target.x - tr.position.x;
    const dy = target.y - tr.position.y;
    const dz = target.z - tr.position.z;
    const horizontalDist = Math.max(1e-5, Math.hypot(dx, dz));
    const desiredPitch = Math.atan2(dy, horizontalDist);

    const step = Math.sign(desiredPitch - gt.pitch) * gt.pitchSpeed * dt;
    let next = gt.pitch + step;
    if ((step > 0 && next > desiredPitch) || (step < 0 && next < desiredPitch)) next = desiredPitch;
    gt.pitch = clamp(next, gt.pitchMin, gt.pitchMax);
  }
  Logger.info("[weaponElevationSystem] updated");
}
