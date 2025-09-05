import * as THREE from "three";

// Ambient light for general fill
// Kept very basic. MeshBasicMaterial doesn't need lights, but this future-proofs.
export function addBasicLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  return { ambient };
}
