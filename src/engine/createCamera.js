import * as THREE from "three";

export function createCamera({
  fov = 75,
  aspect = 1,
  near = 0.1,
  far = 1000,
  position = { x: 0, y: 3, z: 6 },
  lookAt = { x: 0, y: 0, z: 0 }
} = {}) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  return camera;
}
