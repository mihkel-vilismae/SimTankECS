import * as THREE from "three";

/**
 * Adds a directional "sun" light with shadows to the scene.
 * Returns { sun } for further customization.
 */
export function createSky(scene, {
  sunPosition = { x: 15, y: 25, z: 10 },
  sunIntensity = 1.1
} = {}) {
  const sun = new THREE.DirectionalLight(0xffffff, sunIntensity);
  sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  sun.castShadow = true;

  // Shadow map quality
  sun.shadow.mapSize.set(2048, 2048);

  // Shadow camera tuning
  const cam = sun.shadow.camera;
  cam.near = 0.5;
  cam.far = 200;
  cam.left = -50;
  cam.right = 50;
  cam.top = 50;
  cam.bottom = -50;
  scene.add(sun);
  return { sun };
}
