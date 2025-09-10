import * as THREE from "three";
import { lerp } from "../../utils/math3d.js";
import { muzzleForward } from "../../aim/math.js";

/**
 * When world.cinematicExplosion.active is true:
 *  - phase "orbit": orbit camera around center while looking at explosion
 *  - after 'duration', phase "return": smoothly fly back to follow_gun target pose,
 *    then set world.cameraMode = "follow_gun" and clear the cinematic.
 */
export function cameraExplosionCinematicSystem(dt, world, registry) {
  const cam = world.camera;
  const c = world.cinematicExplosion;
  if (!cam || !c || !c.active) return;

  c.t += dt;

  if (c.phase === "orbit") {
    // Snap immediately if requested by hotkey
    if (world.cinematicSnapRequest) { c.t = c.duration; }
    // Apply time slow during orbit
    world.timeScale = 0.6;
    const a = c.t * c.angVel;
    // subtle radial noise
    const r = c.radius * (1.0 + Math.sin(c.t * 2.73) * 0.07) + (Math.random()-0.5) * c.noise * 0.02;
    const x = c.center.x + Math.cos(a) * r;
    const z = c.center.z + Math.sin(a) * r;
    const y = c.center.y + c.height + Math.sin(c.t * 1.57) * 0.15;

    // Smoothly move camera
    cam.position.x = lerp(cam.position.x, x, 0.18);
    cam.position.y = lerp(cam.position.y, y, 0.18);
    cam.position.z = lerp(cam.position.z, z, 0.18);
    cam.lookAt(c.center.x, c.center.y, c.center.z);

    if (c.t >= c.duration) {
      const snap = !!world.cinematicSnapBack || !!world.cinematicSnapRequest;
      world.cinematicSnapRequest = false;
      if (snap) {
        // compute follow_gun target and snap immediately
        const guns = registry.query(["Gun", "Transform"]);
        if (guns.length) {
          const cannon = guns.find(e => e.components.Gun?.type === "Cannon");
          const preferred = cannon || guns[0];
          const gt = registry.getComponent(preferred, "Transform");
          const fwd = muzzleForward(preferred, registry);
          const backDist = 3.2;
          const up = 1.1;
          const pos = { x: gt.position.x - fwd.x * backDist,
                        y: gt.position.y + up,
                        z: gt.position.z - fwd.z * backDist };
          const look = { x: gt.position.x + fwd.x * 8,
                         y: gt.position.y + fwd.y * 8,
                         z: gt.position.z + fwd.z * 8 };
          // teleport camera to target pose
          world.timeScale = 1.0;
          const cam = world.camera;
          if (cam) {
            cam.position.set(pos.x, pos.y, pos.z);
            cam.lookAt(look.x, look.y, look.z);
          }
        } else {
          world.timeScale = 1.0;
        }
        world.cameraMode = "follow_gun";
        world.cinematicExplosion = null;
        return;
      }
      c.phase = "return";
      // Restore normal time for return
      world.timeScale = 1.0;
      c.t = 0;
      c.returnDur = 1.4; // seconds for smooth return
      // Capture follow_gun target pose now to fly towards
      const guns = registry.query(["Gun", "Transform"]);
      if (guns.length) {
        const cannon = guns.find(e => e.components.Gun?.type === "Cannon");
        const preferred = cannon || guns[0];
        const gt = registry.getComponent(preferred, "Transform");
        const fwd = muzzleForward(preferred, registry);
        const backDist = 3.2;
        const up = 1.1;
        c.returnTarget = {
          pos: { x: gt.position.x - fwd.x * backDist,
                 y: gt.position.y + up,
                 z: gt.position.z - fwd.z * backDist },
          look: { x: gt.position.x + fwd.x * 8,
                  y: gt.position.y + fwd.y * 8,
                  z: gt.position.z + fwd.z * 8 }
        };
      } else {
        c.returnTarget = {
          pos: { x: cam.position.x, y: cam.position.y, z: cam.position.z },
          look:{ x: c.center.x, y: c.center.y, z: c.center.z }
        };
      }
    }
    return;
  }

  if (c.phase === "return") {
    const k = Math.min(1, c.t / (c.returnDur || 1.2));
    const ease = 1 - Math.pow(1-k, 3); // ease-out
    const tp = c.returnTarget.pos;
    const tl = c.returnTarget.look;

    // Lerp to follow_gun target
    cam.position.x = cam.position.x + (tp.x - cam.position.x) * ease * 0.22;
    cam.position.y = cam.position.y + (tp.y - cam.position.y) * ease * 0.22;
    cam.position.z = cam.position.z + (tp.z - cam.position.z) * ease * 0.22;

    // Look-at smoothing: nudge towards target look point
    const look = new THREE.Vector3();
    look.set(
      cam.position.x + (tl.x - cam.position.x) * 0.7,
      cam.position.y + (tl.y - cam.position.y) * 0.7,
      cam.position.z + (tl.z - cam.position.z) * 0.7
    );
    cam.lookAt(look);

    if (c.t >= (c.returnDur || 1.2)) {
      // Hand over to follow_gun
      world.cameraMode = "follow_gun";
      // Ensure timescale normalized
      world.timeScale = 1.0;
      world.cinematicExplosion = null;
    }
  }
}
