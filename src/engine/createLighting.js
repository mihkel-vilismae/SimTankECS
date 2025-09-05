import * as THREE from "three";
export function addBasicLighting(scene) {
  const amb = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(amb);
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(20, 40, -15);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  return { amb, sun };
}
