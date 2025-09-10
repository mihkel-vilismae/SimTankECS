import { lerp } from "../../utils/math3d.js";
import { muzzleForward } from "../../utils/math.js";
import { Logger } from "../../utils/logger.js";

/**
 * Follow-Gun camera: sits slightly behind/above the active gun's barrel and looks forward.
 * Active when world.cameraMode === "follow_gun". Prefers Cannon, else first Gun.
 */
export function cameraFollowGunSystem(dt, world, registry) {
  if (world.cameraMode !== "follow_gun") return;
  const cam = world.camera;
  if (!cam) return;

  const guns = registry.query(["Gun", "Transform"]);
  if (!guns.length) return;
  // Prefer cannon if present
  const preferred = guns.find(e => (e.components?.Gun?.type || e.components?.Gun?.kind) === "Cannon") || guns[0];

  const t = registry.getComponent(preferred, "Transform");
  const g = registry.getComponent(preferred, "Gun");
  const yaw = t.rotation.yaw || 0;
  const pitch = g.pitch || 0;

  const fwd = muzzleForward(yaw, pitch);
  // Approximate the muzzle a bit in front of the mount
  const baseX = t.position.x + fwd.x * 0.8;
  const baseY = t.position.y + fwd.y * 0.8;
  const baseZ = t.position.z + fwd.z * 0.8;

  const backDist = 2.5;
  const upOffset = 0.6;

  const tx = baseX - fwd.x * backDist;
  const ty = baseY - fwd.y * backDist + upOffset;
  const tz = baseZ - fwd.z * backDist;

  cam.position.x = lerp(cam.position.x, tx, 0.18);
  cam.position.y = lerp(cam.position.y, ty, 0.18);
  cam.position.z = lerp(cam.position.z, tz, 0.18);

  // Look down the barrel
  const lookX = baseX + fwd.x * 8;
  const lookY = baseY + fwd.y * 8;
  const lookZ = baseZ + fwd.z * 8;
  cam.lookAt(lookX, lookY, lookZ);

  Logger.info("[cameraFollowGunSystem] following", { id: preferred.id });
}
