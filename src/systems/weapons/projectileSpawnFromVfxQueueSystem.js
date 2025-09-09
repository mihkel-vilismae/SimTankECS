import { Logger } from "../../utils/logger.js";
import { spawnBullet, spawnShell } from "../../entities/projectileFactory.js";

/** Spawns bullets/shells based on weaponFireEventSystem's world.vfxQueue entries. */
export function projectileSpawnFromVfxQueueSystem(dt, world, registry) {
  if (!world.vfxQueue || world.vfxQueue.length === 0) return;
  const scene = world.scene;

  const toProcess = world.vfxQueue.slice();
  for (const it of toProcess) {
    // Determine type: prefer preset; fallback to source gun type
    const src = registry.getById(it.entityId);
    const gun = src?.components?.Gun;
    const isCannon = (it.preset === "CANNON_MUZZLE") || (gun?.type === "Cannon");
    const forward = it.forward || { x:0,y:0,z:1 };
    const pos = it.worldPos || { x:0,y:0,z:0 };

    if (isCannon) spawnShell(registry, scene, pos, forward);
    else spawnBullet(registry, scene, pos, forward);

    Logger.info("[projectileSpawnFromVfxQueue] spawned", { cannon: !!isCannon });
  }
  // do not clear vfxQueue here; vfx systems will still use it this frame
}
