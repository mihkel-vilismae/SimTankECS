import { Logger } from "../../utils/logger.js";

/** Smoothly recovers gun.recoilOffset back to 0. */
export function weaponRecoilSystem(dt, world, registry) {
  const guns = registry.query(["Gun"]);
  for (const e of guns) {
    const g = e.components.Gun;
    const rec = g.recoilRecover || 8;
    if (g.recoilOffset > 0) {
      g.recoilOffset = Math.max(0, g.recoilOffset - rec * dt * g.recoilOffset);
    }
  }
  Logger.info("[weaponRecoilSystem] updated");
}
