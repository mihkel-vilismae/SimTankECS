export function setupResize({ renderer, camera }) {
  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    if (camera && camera.isPerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }
  window.addEventListener("resize", onResize);
  onResize();

  // Return a disposer for completeness (useful for hot-reload/cleanup)
  return () => window.removeEventListener("resize", onResize);
}
