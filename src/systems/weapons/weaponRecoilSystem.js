import { Logger } from "../../utils/logger.js";

/** Critically-damped spring recoil recovery back to 0 (independent of framerate). */
export function weaponRecoilSystem(dt, world, registry) {
  const guns = registry.query(["Gun"]);
  for (const e of guns) {
    const g = e.components.Gun;

    // State
    g.recoilOffset = g.recoilOffset || 0;
    g._recoilVel = g._recoilVel || 0;

    // Tunable: use recoilRecover as natural frequency (rad/s)
    // Higher -> snappier return. Example values: 6..14
    const wn = Math.max(0.1, g.recoilRecover || 8); // rad/s
    const c = 2 * wn; // critical damping for unit mass
    const k = wn * wn; // spring constant for unit mass

    // Semi-implicit Euler integration
    // x' = v
    // v' = -c*v - k*x
    const x = g.recoilOffset;
    let v = g._recoilVel;

    // Integrate
    v += (-c * v - k * x) * dt;
    let xNew = x + v * dt;

    // Clamp and snap
    if (xNew < 0) {
      xNew = 0;
      v = 0;
    } else if (xNew < 1e-5 && Math.abs(v) < 1e-4) {
      xNew = 0;
      v = 0;
    }

    g.recoilOffset = xNew;
    g._recoilVel = v;
  }
  Logger.info("[weaponRecoilSystem] updated");
}
