import * as THREE from "three";
import { Logger } from "../../utils/logger.js";

const raycaster = new THREE.Raycaster();
const planeY0 = new THREE.Plane(new THREE.Vector3(0,1,0), 0); // y = 0 plane
const out = new THREE.Vector3();

export function mouseRaycastSystem(dt, world, registry) {
  const m = world.input?.mouse;
  if (!m || m.x == null || m.y == null) return;
  raycaster.setFromCamera({ x: m.x, y: m.y }, world.camera);
  const hit = raycaster.ray.intersectPlane(planeY0, out);
  world.mouse = world.mouse || {};
  world.mouse.worldPoint = hit ? { x: out.x, y: out.y, z: out.z } : null;
  world.mouse.hit = !!hit;
  Logger.info("[mouseRaycastSystem] updated", world.mouse.worldPoint);
}
