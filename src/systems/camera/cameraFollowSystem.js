import { lerp } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

export function cameraFollowSystem(dt, world, registry) {
  const cam = world?.camera;
  if (!cam || !cam.position) return;

  const baselineY = (typeof world?.cameraBaselineY === 'number') ? world.cameraBaselineY : 10;
  const speed     = (typeof world?.cameraFollowSpeed === 'number') ? world.cameraFollowSpeed : 3;

  const y = cam.position.y ?? 0;
  if (y >= baselineY) return;

  // Move up toward baseline; with dt=1 → y increases by ~speed, so > 0 immediately
  const dy = baselineY - y;
  cam.position.y = y + Math.min(dy, speed * dt);
}

