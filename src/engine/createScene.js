import * as THREE from "three";
export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202530);
  return scene;
}
