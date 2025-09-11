import { segmentAabbHit } from "../../utils/segAabb.js";

export function projectileCollisionSystem(dt, world, registry){
  const ents = registry.query ? registry.query(["Projectile","Transform"]) : [];
  if (!ents.length) return;

  // Cache colliders list (static-ish)
  if (!world._collidersCache || world._collidersDirty) {
    world._collidersCache = (registry.query ? registry.query(["Collider","Transform"]) : []).map(e => ({
      id: e.id,
      t: registry.getComponent(e,"Transform"),
      c: registry.getComponent(e,"Collider"),
      h: registry.getComponent(e,"Health") // may be undefined
    }));
    world._collidersDirty = false;
  }

  const groundY = 0.0;
  world.damageQueue = world.damageQueue || [];
  world.vfxQueue = world.vfxQueue || [];

  for (const e of ents) {
    const t = registry.getComponent(e, "Transform");
    const p = registry.getComponent(e, "Projectile");
    const projRadius = (p && p.radius != null) ? p.radius : (p?.kind === 'shell' ? 0.15 : 0.05);
    if (!t || !p) continue;

    // previous position fallback
    const prev = e._prevPos || { x: t.position.x, y: t.position.y, z: t.position.z };
    const curr = { x: t.position.x, y: t.position.y, z: t.position.z };

    // Ground intersection check (segment vs plane y=groundY)
    let hit = false;
    let hitPoint = null;
    let hitEntityId = null;

    if (prev.y >= groundY && curr.y < groundY && (curr.y - prev.y) < 0) {
      const dy = curr.y - prev.y;
      const tParam = (groundY - prev.y) / dy; // dy negative -> positive tParam
      if (tParam >= 0 && tParam <= 1) {
        hit = true;
        hitPoint = {
          x: prev.x + (curr.x - prev.x) * tParam,
          y: groundY + 0.02,
          z: prev.z + (curr.z - prev.z) * tParam
        };
      }
    }

    // Collider sweep
    if (!hit && world._collidersCache && world._collidersCache.length) {
      let bestT = 2, best = null;
      for (const col of world._collidersCache) {
        if (!col.c || !col.t) continue;
        const center = {
          x: col.t.position.x + col.c.center.x,
          y: col.t.position.y + col.c.center.y,
          z: col.t.position.z + col.c.center.z
        };
        const tHit = segmentAabbHit(prev, curr, center, col.c.half, projRadius);
        if (tHit != null && tHit < bestT) {
          bestT = tHit; best = col;
        }
      }
      if (best) {
        hit = true;
        hitEntityId = best.id;
        hitPoint = {
          x: prev.x + (curr.x - prev.x) * bestT,
          y: prev.y + (curr.y - prev.y) * bestT,
          z: prev.z + (curr.z - prev.z) * bestT
        };
      }
    }

    // Resolve hit
    if (hit) {
      // Snap projectile to hit point (small offset)
      t.position.x = hitPoint.x;
      t.position.y = hitPoint.y;
      t.position.z = hitPoint.z;

      // VFX and damage
      const forward = p.forward || { x: 0, y: 0, z: 1 };
      if (hitEntityId != null) {
        // apply damage based on projectile kind
        let dmg = (p.kind === "shell") ? 85 : 15;
        world.damageQueue.push({ entityId: hitEntityId, amount: dmg });
        world.vfxQueue.push({ preset: "BULLET_SPARK_STORM", worldPos: hitPoint, forward });
      } else {
        // ground hit vfx
        world.vfxQueue.push({ preset: "SHELL_EXPLOSION_LARGE", worldPos: hitPoint, forward });
      }

      // Kill projectile immediately
      const life = registry.getComponent(e, "Lifespan");
      if (life) life.ms = 0;

      // Prevent underground
      if (t.position.y < groundY) t.position.y = groundY + 0.02;

      continue;
    }

    // No hit -> store prev for next frame
    e._prevPos = { x: curr.x, y: curr.y, z: curr.z };
  }
}
