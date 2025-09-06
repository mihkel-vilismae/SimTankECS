import { Logger } from "../../utils/logger.js";

/**
 * Handles firing input:
 * - Mouse left: MachineGun
 * - Mouse right: Cannon
 * Applies cooldown & ammo counters on Gun components.
 * (Projectiles/VFX can be added later.)
 */
export function weaponInputSystem(dt, world, registry) {
  const hullId = world.control?.entityId;
  if (!hullId) return;

  const mouse = world.input?.mouse;
  world.weapons = world.weapons || { lastDown: false };

  // collect guns under the controlled hull
  const guns = registry.query(["Gun", "Mount"]);
  for (const e of guns) {
    const parent = registry.getById(e.components.Mount.parent);
    if (!parent?.components?.Turret) continue;
    const g = e.components.Gun;
    // tick cooldown
    g.cooldown = Math.max(0, g.cooldown - dt);

    const wantFire =
      (g.type === "MachineGun" && mouse?.down) ||
      (g.type === "Cannon" && world.input?.keys?.["Space"]); // Space as secondary for now

    if (wantFire && g.cooldown <= 0 && (g.ammo === Infinity || g.ammo > 0)) {
      // spend ammo & set cooldown
      if (g.ammo !== Infinity) g.ammo -= 1;
      g.cooldown = 1.0 / Math.max(0.0001, g.fireRate);
      g._recoilVel = (g._recoilVel || 0) - ((g.recoilKick || 0.03) * (g.recoilImpulseScale || 60));
      g.recoilOffset = Math.max(0, Math.min(g.recoilMax ?? 0.2, g.recoilOffset || 0));
      Logger.info("[weaponInputSystem] fired", { type: g.type, ammo: g.ammo });
      // Raise a FireEvent for VFX
      e.components.FireEvent = { count: 1, time: world.time || 0 };
      // (spawn projectiles in a separate system later)
    }
  }
}
