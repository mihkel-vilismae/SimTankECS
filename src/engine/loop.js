import { Logger } from "../utils/logger.js";

export function createLoop(renderer, scene, camera, registry) {
  const systems = [];
  let _raf = null;
  let _last = 0;

  function addSystem(sys) {
    systems.push(sys);
    Logger.info("[loop] addSystem", { count: systems.length });
  }

  function step(dt, world) {
    const s = (world && typeof world.timeScale === 'number') ? world.timeScale : 1.0;
    const sdt = dt * s;
    for (const sys of systems) sys(sdt, world, registry);
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  function frame(ts) {
    if (!_last) _last = ts;
    const dt = Math.min(0.05, (ts - _last) / 1000);
    _last = ts;
    step(dt, world);
    _raf = requestAnimationFrame(frame);
  }

  const world = { scene, camera, renderer, loop: { addSystem, step, stop, start }, input: { keys: {} } };

  function start() {
    if (_raf == null) {
      Logger.info("[loop] start");
      _raf = requestAnimationFrame(frame);
    }
  }
  function stop() {
    if (_raf != null) {
      cancelAnimationFrame(_raf);
      _raf = null;
      Logger.info("[loop] stop");
    }
  }

  return { addSystem, step, start, stop, systems, world };
}
