import { Logger } from "../../utils/logger.js";

/**
 * Recoil recovery using critically damped spring.
 * Gun.recoilOffset is displaced on fire, then smoothly returns to 0.
 */
export function weaponRecoilSystem(dt, world, registry) {
  const guns = registry.query(["Gun"]);
  for (const e of guns) {
    const g = registry.getComponent(e, "Gun");
    const k = g.recoilRecover || 20; // spring constant (stiffness)
    const c = 2 * Math.sqrt(k);      // critical damping
    g._recoilVel = g._recoilVel || 0;

    // spring force towards 0
    const force = -k * g.recoilOffset - c * g._recoilVel;
    g._recoilVel += force * dt;
    g.recoilOffset += g._recoilVel * dt;

    // clamp very small values
    if (Math.abs(g.recoilOffset) < 1e-4 && Math.abs(g._recoilVel) < 1e-4) {
      g.recoilOffset = 0;
      g._recoilVel = 0;
    }
  }
  Logger.info("[weaponRecoilSystem] updated");
}