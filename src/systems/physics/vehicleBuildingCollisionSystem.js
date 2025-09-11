// src/systems/physics/vehicleBuildingCollisionSystem.js
// Detect vehicle vs building collisions (AABB vs AABB) and emit CollisionEvent with MTV.
// Optionally, caller may resolve by moving the vehicle by -MTV.

import { aabbAabbMTV } from '../../physics/collision/geometry.js';

export function vehicleBuildingCollisionSystem(dt, world, registry){
  if (!registry) return;
  const ents = registry?.query?.(['Transform','Collider']) ?? [];
  const isBuilding = (id) => !!registry?.getComponent?.(id, 'Building') || registry?.getComponent?.(id, 'Tag')?.kind === 'Building';
  const isVehicle  = (id) => !!registry?.getComponent?.(id, 'Vehicle')  || registry?.getComponent?.(id, 'Tag')?.kind === 'Vehicle';

  const buildings = [];
  const vehicles = [];

  for (const e of ents){
    const id = e.id ?? e;
    const tr = registry.getComponent(id, 'Transform');
    const col = registry.getComponent(id, 'Collider');
    if (!tr || !col) continue;
    if (isBuilding(id) && col.type === 'aabb'){
      buildings.push({ id, tr, col });
    } else if (isVehicle(id) && col.type === 'aabb'){
      vehicles.push({ id, tr, col });
    }
  }

  registry.events = registry.events || [];
  for (const v of vehicles){
    for (const b of buildings){
      const mtv = aabbAabbMTV(v.tr.position, v.col.halfExtents, b.tr.position, b.col.halfExtents);
      if (mtv){
        registry.events.push({
          type: 'CollisionEvent',
          a: v.id,
          b: b.id,
          mtv,
        });
        // Optional immediate resolution (commented out; leave to motion/physics system)
        // v.tr.position.x -= mtv.x;
        // v.tr.position.y -= mtv.y;
        // v.tr.position.z -= mtv.z;
      }
    }
  }
}

export default vehicleBuildingCollisionSystem;
