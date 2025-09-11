import { Logger } from "../../utils/logger.js";

/**
 * Recoil recovery using critically damped spring.
 * Gun.recoilOffset is displaced on fire, then smoothly returns to 0.
 */
export function weaponRecoilSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);

  for (const ent of (registry.query?.(["Gun"]) ?? [])) {
    const g = getC(ent, "Gun");
    if (!g) continue;

    const max = (typeof g.recoilMax === 'number') ? g.recoilMax : 0.1;

    let x = Math.max(0, Math.min(max, g.recoilOffset ?? 0));
    let v = g._recoilVel ?? 0;

    // Critically damped toward 0
    const wn = g.recoilWn ?? 14;
    const c  = 2 * wn;
    const a  = -(wn * wn) * x - c * v;

    v += a * dt;
    x += v * dt;

    if (x < 0) { x = 0; v = 0; }
    if (x > max) { x = max; v = Math.min(v, 0); }

    g.recoilOffset = x;
    g._recoilVel   = v;

    console.log('[weaponRecoilSystem] updated');
  }
}

