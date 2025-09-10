// src/systems/physics/projectileCollisionSystem.js
import { sphereAabbOverlap } from '../../physics/collision/geometry.js';

export function projectileCollisionSystem(world, registry){
  const ents = registry.query?.(['Transform','Collider']) ?? [];
  const isBuilding = (id) => !!registry.getComponent(id, 'Building') || registry.getComponent(id, 'Tag')?.kind === 'Building';
  const isProjectile = (id) => !!registry.getComponent(id, 'Projectile');

  const buildings = [];
  const projectiles = [];

  for (const e of ents){
    const id = e.id ?? e;
    const tr = registry.getComponent(id, 'Transform');
    const col = registry.getComponent(id, 'Collider');
    if (!tr || !col) continue;
    if (isBuilding(id) && col.type === 'aabb'){
      buildings.push({ id, tr, col });
    } else if (isProjectile(id) && col.type === 'sphere'){
      const pj = registry.getComponent(id, 'Projectile');
      projectiles.push({ id, tr, col, pj });
    }
  }

  registry.events = registry.events || [];
  for (const p of projectiles){
    for (const b of buildings){
      const hit = sphereAabbOverlap(p.tr.position, p.col.radius, b.tr.position, b.col.halfExtents);
      if (hit){
        registry.events.push({
          type: 'HitEvent',
          projectileId: p.id,
          targetId: b.id,
          projectileKind: p.pj?.kind || 'unknown',
        });
        break;
      }
    }
  }
}
export default projectileCollisionSystem;
