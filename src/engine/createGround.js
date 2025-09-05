import * as THREE from "three";

/**
 * Adds a simple ground plane.
 * Returns { ground }.
 */
export function createGround(scene, {
  size = 200,
  color = 0x808080,
  roughness = 1.0,
  metalness = 0.0
} = {}) {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = "Ground";
  scene.add(ground);
  return { ground };
}
