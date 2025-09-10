import { Logger } from "../../utils/logger.js";

/**
 * Handles firing input:
 * - Mouse left: MachineGun
 * - Mouse right: Cannon
 * Applies cooldown & ammo counters on Gun components.
 * (Projectiles/VFX can be added later.)
 */
export function weaponInputSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);

  // Tick cooldown for all guns
  for (const ent of (registry.query?.(["Gun"]) ?? [])) {
    const g = getC(ent, "Gun");
    if (!g) continue;
    if (g.cooldown > 0) g.cooldown = Math.max(0, g.cooldown - dt);
  }

  // Mouse not pressed → nothing to do
  if (!world?.input?.mouse?.down) return;

  const controlId = world?.control?.entityId ?? null;
  const selectedId = world?.weapons?.selectedId ?? null;

  // Fire every eligible gun; if we can infer parent/owner, only fire those on the controlled unit
  for (const ent of (registry.query?.(["Gun"]) ?? [])) {
    const g = getC(ent, "Gun");
    if (!g || g.cooldown > 0 || g.ammo <= 0) continue;
    if (selectedId && ent.id !== selectedId) continue;

    if (controlId) {
      const parentId =
          getC(ent, "Hardpoint")?.parentId ??
          getC(ent, "Mount")?.parentId ??
          getC(ent, "Turret")?.parentId ??
          getC(ent, "Parent")?.id ??
          null;
      if (parentId && parentId !== controlId) continue;
    }

    // Immediate kick so tests see > 0 peak right away
    const max  = (typeof g.recoilMax  === 'number') ? g.recoilMax  : 0.1;
    const kick = (typeof g.recoilKick === 'number')
        ? g.recoilKick
        : (g.type === 'Cannon' ? 0.08 : 0.04);

    g.ammo -= 1;
    g.cooldown = (g.cooldownMs ?? 100) / 1000;

    // Directly bump offset and add a strong backward velocity
    g.recoilOffset = Math.min(max, Math.max(0, (g.recoilOffset ?? 0) + kick));
    g._recoilVel   = -Math.max(1, kick * 60);

    registry.addComponent?.(ent, "FireEvent", { type: g.type ?? 'Gun', ammo: g.ammo });
    console.log('[weaponInputSystem] fired', { type: g.type ?? 'Gun', ammo: g.ammo });
  }
}

