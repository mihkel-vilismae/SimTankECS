import * as THREE from "three";
import { lerp } from "../../utils/math3d.js";
import { muzzleForward } from "../../aim/math.js";

export function cameraFollowGunProjectileSystem(dt, world, registry) {
  const cam = world.camera;
  if (!cam) return;

  if (world.followGunProjectileEnabled && world.cameraMode === "follow_gun" && !world.followProjectileTargetId) {
    const projs = registry.query?.(["Projectile","Transform"]) || [];
    if (projs.length) {
      let pick = projs[0];
      for (const e of projs) {
        const ca = e.components.Projectile?.createdAt ?? 0;
        const cb = pick.components.Projectile?.createdAt ?? 0;
        if (ca > cb || (ca === cb && e.id > pick.id)) pick = e;
      }
      world.prevCameraModeBeforeProjectile = world.cameraMode;
      world.cameraMode = "follow_gun_projectile";
      world.followProjectileTargetId = pick.id;
    }
  }

  const isChasing = world.cameraMode === "follow_gun_projectile" && world.followProjectileTargetId;
  if (!isChasing) {
    if (world.cameraMode !== "follow_gun") return;
    const guns = registry.query(["Gun", "Transform"]);
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

  const target = registry.getById?.(world.followProjectileTargetId);
  if (!target) { world.followProjectileTargetId = null; return; }
  const t = registry.getComponent(target, "Transform");
  if (!t) { world.followProjectileTargetId = null; return; }

  const yaw = t.rotation?.yaw || 0;
  const pitch = t.rotation?.pitch || 0;
  const fwd = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));

  const backDist = 2.5, up = 0.6;
  const tx = t.position.x - fwd.x * backDist;
  const ty = t.position.y + up;
  const tz = t.position.z - fwd.z * backDist;

  cam.position.x = lerp(cam.position.x, tx, 0.25);
  cam.position.y = lerp(cam.position.y, ty, 0.25);
  cam.position.z = lerp(cam.position.z, tz, 0.25);
  cam.lookAt(t.position.x + fwd.x * 5, t.position.y + fwd.y * 5, t.position.z + fwd.z * 5);
}
