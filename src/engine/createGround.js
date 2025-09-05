import * as THREE from "three";
export function createGround() {
  const geo = new THREE.PlaneGeometry(200, 200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}
