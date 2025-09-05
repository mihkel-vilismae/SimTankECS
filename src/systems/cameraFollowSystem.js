import { lerp } from "../utils/math3d.js";
import { Logger } from "../utils/logger.js";

export function cameraFollowSystem(dt, world, registry) {
  let target = null;
  const id = world.control?.entityId;
  if (id) target = registry.getById?.(id);
  if (!target) target = registry.query(["Transform"])[0];
  if (!target) return;

  const t = target.components.Transform;
  const cam = world.camera;

  const backDist = 6;
  const height = 3;
  const tx = t.position.x - Math.sin(t.rotation.yaw) * backDist;
  const tz = t.position.z - Math.cos(t.rotation.yaw) * backDist;
  const ty = t.position.y + height;

  cam.position.x = lerp(cam.position.x, tx, 0.1);
  cam.position.y = lerp(cam.position.y, ty, 0.1);
  cam.position.z = lerp(cam.position.z, tz, 0.1);
  cam.lookAt(t.position.x, t.position.y, t.position.z);

  Logger.info("[cameraFollowSystem] updated", { id: target.id });
}
