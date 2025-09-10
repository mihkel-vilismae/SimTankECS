import * as THREE from "three";
import { lerp } from "../../utils/math3d.js";
import { muzzleForward } from "../../aim/math.js";

/**
 * Behavior:
 * - If followGunProjectileEnabled and cameraMode is follow_gun, watch for fired projectiles.
 * - On shot, switch to follow_gun_projectile and chase behind it (person view).
 * - If projectile dies (lifespan end): lifespanSystem triggers cinematic orbit & sets return baseline.
 * - If projectile keeps flying >5s, stop chasing and fly back to baseline (smooth via follow_gun lerp).
 */
export function cameraFollowGunProjectileSystem(dt, world, registry) {
  const cam = world.camera;
  if (!cam) return;

  // Detect a projectile to chase when enabled and currently in follow_gun (no active target)
  if (world.followGunProjectileEnabled && world.cameraMode === "follow_gun" && !world.followProjectileTargetId) {
    const projs = registry.query?.(["Projectile","Transform"]) || [];
    if (projs.length) {
      // choose newest by createdAt/id
      let pick = projs[0];
      for (const e of projs) {
        const ca = e.components.Projectile?.createdAt ?? 0;
        const cb = pick.components.Projectile?.createdAt ?? 0;
        if (ca > cb || (ca === cb && e.id > pick.id)) pick = e;
      }
      world.prevCameraModeBeforeProjectile = world.cameraMode;
      world.cameraMode = "follow_gun_projectile";
      world.followProjectileTargetId = pick.id;
      world.followProjectileStartTime = performance.now();
    }
  }

  // Not chasing? maintain follow_gun framing
  const isChasing = world.cameraMode === "follow_gun_projectile" && world.followProjectileTargetId;
  if (!isChasing) {
    if (world.cameraMode !== "follow_gun") return;
    const guns = registry.query?.(["Gun", "Transform"]) || [];
    if (!guns.length) return;
    const cannon = guns.find(e => e.components.Gun?.type === "Cannon");
    const preferred = cannon || guns[0];
    const gt = registry.getComponent(preferred, "Transform");
    const fwd = muzzleForward(preferred, registry);

    const backDist = 3.2, up = 1.1;
    const tx = gt.position.x - fwd.x * backDist;
    const ty = gt.position.y + up;
    const tz = gt.position.z - fwd.z * backDist;

    cam.position.x = lerp(cam.position.x, tx, 0.18);
    cam.position.y = lerp(cam.position.y, ty, 0.18);
    cam.position.z = lerp(cam.position.z, tz, 0.18);
    cam.lookAt(gt.position.x + fwd.x * 8, gt.position.y + fwd.y * 8, gt.position.z + fwd.z * 8);
    return;
  }

  // Chasing logic
  const target = registry.getById?.(world.followProjectileTargetId);
  if (!target) { world.followProjectileTargetId = null; world.cameraMode = "follow_gun"; return; }
  const t = registry.getComponent(target, "Transform");
  if (!t) { world.followProjectileTargetId = null; world.cameraMode = "follow_gun"; return; }

  // If chasing for more than 5 seconds without lifespan ending -> go back to baseline smoothly
  if (world.followProjectileStartTime && performance.now() - world.followProjectileStartTime > 5000) {
    world.followProjectileTargetId = null;
    world.followProjectileStartTime = null;
    world.cameraMode = world.cameraBaselineMode || "follow_gun";
    return; // follow_gun system lerp will handle smooth return
  }

  // person view behind projectile
  const yaw = t.rotation?.yaw || 0;
  const pitch = t.rotation?.pitch || 0;
  const fwd = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  );

  const backDist = 2.5, up = 0.6;
  const tx = t.position.x - fwd.x * backDist;
  const ty = t.position.y + up;
  const tz = t.position.z - fwd.z * backDist;

  cam.position.x = lerp(cam.position.x, tx, 0.25);
  cam.position.y = lerp(cam.position.y, ty, 0.25);
  cam.position.z = lerp(cam.position.z, tz, 0.25);
  cam.lookAt(t.position.x + fwd.x * 5, t.position.y + fwd.y * 5, t.position.z + fwd.z * 5);
}
