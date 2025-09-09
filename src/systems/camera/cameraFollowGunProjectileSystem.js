import { lerp } from "../../utils/math3d.js";
import { muzzleForward } from "../../aim/math.js";

/**
 * Camera mode: follow_gun_projectile
 * - Follows gun like 'follow_gun'
 * - When world.followProjectileTargetId is set and entity exists, trails that projectile until it despawns.
 */
export function cameraFollowGunProjectileSystem(dt, world, registry) {
  if (world.cameraMode !== "follow_gun_projectile") return;
  const cam = world.camera;
  if (!cam) return;

  let targetEnt = null;
  if (world.followProjectileTargetId) {
    targetEnt = registry.getById?.(world.followProjectileTargetId);
    if (!targetEnt) {
      // projectile died -> clear
      world.followProjectileTargetId = null;
    }
  }

  if (targetEnt) {
    const t = registry.getComponent(targetEnt, "Transform");
    if (!t) return;
    // Trail behind projectile along its forward (entity already oriented by flight system)
    const backDist = 2.5;
    const up = 0.6;
    const yaw = t.rotation?.yaw || 0;
    const pitch = t.rotation?.pitch || 0;

    // Forward vector from yaw/pitch
    const fwd = {
      x: Math.sin(yaw) * Math.cos(pitch),
      y: Math.sin(pitch),
      z: Math.cos(yaw) * Math.cos(pitch)
    };
    const tx = t.position.x - fwd.x * backDist;
    const ty = t.position.y + up;
    const tz = t.position.z - fwd.z * backDist;

    cam.position.x = lerp(cam.position.x, tx, 0.25);
    cam.position.y = lerp(cam.position.y, ty, 0.25);
    cam.position.z = lerp(cam.position.z, tz, 0.25);
    cam.lookAt(t.position.x + fwd.x * 5, t.position.y + fwd.y * 5, t.position.z + fwd.z * 5);
    return;
  }

  // Fallback: follow active gun (copy of follow_gun behavior simplified)
  const guns = registry.query(["Gun", "Transform"]);
  if (!guns.length) return;
  const cannon = guns.find(e => e.components.Gun?.type === "Cannon");
  const preferred = cannon || guns[0];
  const gt = registry.getComponent(preferred, "Transform");
  const fwd = muzzleForward(preferred, registry);

  const backDist = 3.2;
  const up = 1.1;
  const tx = gt.position.x - fwd.x * backDist;
  const ty = gt.position.y + up;
  const tz = gt.position.z - fwd.z * backDist;

  cam.position.x = lerp(cam.position.x, tx, 0.18);
  cam.position.y = lerp(cam.position.y, ty, 0.18);
  cam.position.z = lerp(cam.position.z, tz, 0.18);
  cam.lookAt(gt.position.x + fwd.x * 8, gt.position.y + fwd.y * 8, gt.position.z + fwd.z * 8);
}
