/**
 * OrbitControls system (lazy-loaded). Only initializes when cameraMode === 'orbit'.
 * This avoids hard dependency during unit tests and keeps bundle light.
 */
export function createOrbitControlsSystem(camera, rendererDom) {
  let controls = null;
  let loading = false;

  async function ensure() {
    if (controls || loading) return;
    loading = true;
    try {
      const mod = await import("three/examples/jsm/controls/OrbitControls.js");
      const OrbitControls = mod.OrbitControls;
      controls = new OrbitControls(camera, rendererDom);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = true;
      controls.enableZoom = true;
    } catch (e) {
      // swallow: if not available, orbit mode will be a no-op
    } finally {
      loading = false;
    }
  }

  return function orbitControlsSystem(dt, world, registry) {
    if (world.cameraMode !== "orbit") return;
    ensure();
    if (controls) controls.update();
  };
}
