import * as THREE from "three";
export function createRenderer(canvas) {
  // Be robust in headless/node test environments:
  // - Only pass canvas if non-null
  // - Guard window access
  const opts = { antialias: true };
 if (canvas && typeof canvas.addEventListener === "function") {
   opts.canvas = canvas;
 }

  const renderer = new THREE.WebGLRenderer(opts);

  const dpr = (typeof window !== "undefined" && window.devicePixelRatio) ? window.devicePixelRatio : 1;
  renderer.setPixelRatio(Math.min(2, dpr));

  if (typeof window !== "undefined" && window.innerWidth && window.innerHeight) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  } else {
    renderer.setSize(800, 600); // sensible default for tests
  }

  if (renderer.shadowMap) renderer.shadowMap.enabled = true;
  return renderer;
}
