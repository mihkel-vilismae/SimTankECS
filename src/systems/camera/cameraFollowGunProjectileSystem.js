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

const WORLD = { R: 500, MAX_Y: 200 };
function outOfBounds(pos) {
  if (!pos) return true;
  if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y) || !Number.isFinite(pos.z)) return true;
  if (Math.abs(pos.x) > WORLD.R || Math.abs(pos.z) > WORLD.R) return true;
  if (Math.abs(pos.y) > WORLD.MAX_Y) return true;
  return false;
}

function safeFollowGun(dt, world, registry) {
  const cam = world.camera;
  const guns = registry.query?.(["Gun", "Transform"]) || [];
  if (!cam) return;
  const lerp = (a,b,t)=>a+(b-a)*t;
  const minY = 0.6, maxDist = 800;

  if (!guns.length) {
    if (!Number.isFinite(cam.position.x)) cam.position.x = 0;
    if (!Number.isFinite(cam.position.y)) cam.position.y = 2;
    if (!Number.isFinite(cam.position.z)) cam.position.z = -4;
    cam.position.y = Math.max(cam.position.y, minY);
    cam.lookAt(0,0,0);
    return;
  }
  const cannon = guns.find(e => e.components.Gun?.type === "Cannon");
  const preferred = cannon || guns[0];
  const gt = registry.getComponent(preferred, "Transform");
  if (!gt || !gt.position) { cam.lookAt(0,0,0); return; }

  let fwd = { x:0, y:0, z:1 };
  try {
    const { muzzleForward } = require("../../aim/math.js");
    fwd = muzzleForward(preferred, registry) || fwd;
  } catch {}

  const backDist = 3.2, up = 1.1;
  const tx = gt.position.x - fwd.x * backDist;
  const ty = gt.position.y + up;
  const tz = gt.position.z - fwd.z * backDist;

  const nx = Number.isFinite(tx) ? tx : 0;
  const ny = Number.isFinite(ty) ? Math.max(ty, minY) : 2;
  const nz = Number.isFinite(tz) ? tz : -4;

  cam.position.x = lerp(cam.position.x, nx, 0.18);
  cam.position.y = lerp(cam.position.y, ny, 0.18);
  cam.position.z = lerp(cam.position.z, nz, 0.18);

  const d2 = cam.position.x*cam.position.x + cam.position.y*cam.position.y + cam.position.z*cam.position.z;
  if (d2 > maxDist*maxDist) {
    cam.position.set(0,2,-4);
  }

  cam.lookAt(
    gt.position.x + fwd.x * 8,
    gt.position.y + fwd.y * 8,
    gt.position.z + fwd.z * 8
  );
}

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
  safeFollowGun(dt, world, registry);
  return;
}


  // Chasing logic
  const target = registry.getById?.(world.followProjectileTargetId);
  if (!target) { world.followProjectileTargetId = null; world.cameraMode = "follow_gun"; return; }
  const t = registry.getComponent(target, "Transform");
  if (!t) { world.followProjectileTargetId = null; world.cameraMode = "follow_gun"; safeFollowGun(dt, world, registry); return; }

  // If chasing for more than 5 seconds or leaving world bounds -> stop and return baseline
  const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  const started = world.followProjectileStartTime || now;
  const over5s = (now - started) > 5000;
  if (over5s || outOfBounds(t.position)) {
    world.followProjectileTargetId = null;
    world.followProjectileStartTime = null;
    world.cameraMode = world.cameraBaselineMode || "follow_gun";
    safeFollowGun(dt, world, registry);
    return;
  }

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
