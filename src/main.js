import { createGame as _createGame } from "./app/createGame.js";
import ProjectileVFXSystem from './systems/vfx/ProjectileVFXSystem.js';

export function createGame(canvas) {
  // --- Auto-wired: Projectile VFX System ---
  const projectileVfxSystem = ProjectileVFXSystem(scene);
  if (world && world.loop && typeof world.loop.add === 'function') {
    world.loop.add((dt)=> projectileVfxSystem(dt, world, registry));
  } else if (Array.isArray(systems)) {
    systems.push((dt)=> projectileVfxSystem(dt, world, registry));
  }

  return _createGame(canvas);
}

export function startGame() {
  const { loop } = _createGame();
  loop.start();
}

if (!import.meta.vitest) {
  startGame();
}
