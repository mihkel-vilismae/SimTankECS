import * as THREE from "three";

export function createRenderer(options = {}) {
  const {
    canvas = document.createElement("canvas"),
    antialias = true,
    alpha = false,
    preserveDrawingBuffer = false,
  } = options;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias, alpha, preserveDrawingBuffer });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}
