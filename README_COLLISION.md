# Collision Package — Buildings, Projectiles, Vehicles (per AI_START_HERE)

This package adds **collision checks** and **tests**:
- Bullets/shells → Buildings
- Tanks/vehicles → Buildings

It does **not** implement damage/explosions yet, but the events are shaped to support that later.

## Files
- `src/physics/collision/geometry.js` — basic overlap tests + MTV for AABB vs AABB
- `src/systems/physics/projectileCollisionSystem.js` — bullets/shells vs buildings
- `src/systems/physics/vehicleBuildingCollisionSystem.js` — vehicles vs buildings w/ MTV
- Tests (Vitest):
  - `tests/projectile_building_collision.test.js`
  - `tests/vehicle_building_collision.test.js`

## Event shapes
- Projectile hits:
  ```js
  { type: 'HitEvent', projectileId, targetId, projectileKind } // projectileKind: 'bullet' | 'shell'
  ```
- Vehicle/building collision:
  ```js
  { type: 'CollisionEvent', a: vehicleId, b: buildingId, mtv: { x, y, z } }
  ```

These events make it easy to add later:
- Health reduction on buildings/vehicles
- Explosions on shell impact or self-detonation
- Projectile destruction on impact

## Expected components
Minimal set used by the systems (adapt to your ECS names as needed):
- `Transform` → `{ position: { x, y, z } }`
- `Collider` → one of:
  - Building: `{ type: 'aabb', halfExtents: { x, y, z } }`
  - Projectile (bullet/shell): `{ type: 'sphere', radius }`
  - Vehicle: `{ type: 'aabb', halfExtents: { x, y, z } }`
- `Projectile` (for bullets/shells) → `{ kind: 'bullet' | 'shell' }`
- `Tag` or separate components for entity kind: `'Building'`, `'Vehicle'`

## Integration
Call these systems per tick, after motion updates:
```js
projectileCollisionSystem(world, registry);
vehicleBuildingCollisionSystem(world, registry);
```
