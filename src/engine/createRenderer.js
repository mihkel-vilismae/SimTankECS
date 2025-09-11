import * as THREE from "three";
export function createRenderer(canvas) {
  // Be robust in headless/node test environments:
  // - Only pass canvas if non-null
  // - Guard window access
  /*const opts = { antialias: true };
 if (canvas && typeof canvas.addEventListener === "function") {
   opts.canvas = canvas;
 }

  const renderer = new THREE.WebGLRenderer(opts);
*/
    // Headless detection: no DOM, no OffscreenCanvas → return a stub renderer
    const hasDOM = typeof document !== "undefined";
    const hasOffscreen = typeof OffscreenCanvas !== "undefined";
    if (!hasDOM && !hasOffscreen) {
        // Minimal interface used by the app/tests
        const stub = {
            setSize() {
            },
            setPixelRatio() {
            },
            render() {
            },
            get domElement() {
                return {
                    width: 1, height: 1, addEventListener() {
                    }
                };
            },
        };
        return stub;
    }

    const opts = {antialias: true};
    if (canvas && typeof canvas.addEventListener === "function") {
        opts.canvas = canvas;
    } else if (!hasDOM && hasOffscreen) {
        // Supply our own canvas in Node
        opts.canvas = new OffscreenCanvas(1, 1);
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
