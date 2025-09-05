import * as THREE from "three";
export function createSky() {
  const geo = new THREE.SphereGeometry(250, 16, 12);
  const mat = new THREE.MeshBasicMaterial({ color: 0x223344, side: THREE.BackSide });
  return new THREE.Mesh(geo, mat);
}
