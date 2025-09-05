export function createLoop({ renderer, scene, camera, updatables = [], systems = [] }) {
  let running = false;
  let last = performance.now();

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;

    // legacy/updatable objects still supported
    for (const u of updatables) if (typeof u.tick === "function") u.tick(dt);

    // new: systems
    for (const s of systems) s(dt);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  return {
    start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } },
    stop() { running = false; },
    get isRunning() { return running; },
  };
}
