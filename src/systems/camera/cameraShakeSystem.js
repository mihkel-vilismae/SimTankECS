import * as THREE from "three";
/** Applies a short camera shake when world.cameraShake.time > 0.
 *  Uses additive offset so it should run after follow/look systems.
 */
export function cameraShakeSystem(dt, world, registry) {
  const cam = world.camera;
  if (!cam) return;

  const s = world.cameraShake;
  if (!s || s.time <= 0) return;

  s.time = Math.max(0, s.time - dt);
  const k = s.time / s.duration;
  const amp = s.magnitude * (k*k); // ease out

  // Random small offset
  cam.position.x += (Math.random()-0.5) * amp;
  cam.position.y += (Math.random()-0.5) * amp * 0.6;
  cam.position.z += (Math.random()-0.5) * amp;
  cam.rotation.z += (Math.random()-0.5) * amp * 0.05;
}
