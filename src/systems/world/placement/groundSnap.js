// src/systems/world/placement/groundSnap.js
// Utilities for building placement: ground snapping + grid alignment/bounds.

export function cloneVec3(v) {
  return { x: Number(v?.x) || 0, y: Number(v?.y) || 0, z: Number(v?.z) || 0 };
}

/* -------------------- TERRAIN -------------------- */

export function groundSnapToTerrain(world, pos) {
  const p = cloneVec3(pos);
  let h = null;
  if (world?.terrain?.getHeightAt) {
    h = Number(world.terrain.getHeightAt(p.x, p.z));
  } else if (world?.heightmap?.sample) {
    h = Number(world.heightmap.sample(p.x, p.z));
  }
  if (Number.isFinite(h)) p.y = h;
  return p;
}

export function validateBuildingPlacement(world, pos, maxAirGap = 0.05) {
  const p = cloneVec3(pos);
  let h = null;
  if (world?.terrain?.getHeightAt) {
    h = Number(world.terrain.getHeightAt(p.x, p.z));
  } else if (world?.heightmap?.sample) {
    h = Number(world.heightmap.sample(p.x, p.z));
  }
  if (!Number.isFinite(h)) return false;
  return (p.y - h) <= maxAirGap;
}

/* ---------------------- GRID --------------------- */

export function quantizeToGrid(world, pos) {
  const p = cloneVec3(pos);
  const g = world?.grid || {};

  if (typeof g.quantize === 'function') {
    const q = g.quantize(p.x, p.z);
    if (q && Number.isFinite(q.x) && Number.isFinite(q.z)) {
      p.x = q.x; p.z = q.z;
      return p;
    }
  }

  const originX = Number.isFinite(g.originX) ? Number(g.originX) : 0;
  const originZ = Number.isFinite(g.originZ) ? Number(g.originZ) : 0;
  const cellSize = Number(g.cellSize) > 0 ? Number(g.cellSize) : 1;

  const cx = Math.round((p.x - originX) / cellSize);
  const cz = Math.round((p.z - originZ) / cellSize);

  p.x = originX + cx * cellSize;
  p.z = originZ + cz * cellSize;
  return p;
}

export function validateInsideGrid(world, pos) {
  const p = cloneVec3(pos);
  const g = world?.grid || {};

  if (typeof g.isInside === 'function') {
    return !!g.isInside(p.x, p.z);
  }

  const originX = Number.isFinite(g.originX) ? Number(g.originX) : 0;
  const originZ = Number.isFinite(g.originZ) ? Number(g.originZ) : 0;
  const cellSize = Number(g.cellSize) > 0 ? Number(g.cellSize) : 1;
  const width   = Number.isFinite(g.width)  ? Number(g.width)  : null;
  const height  = Number.isFinite(g.height) ? Number(g.height) : null;

  if (width == null || height == null) return false;

  const minX = originX - 0.5 * cellSize;
  const minZ = originZ - 0.5 * cellSize;
  const maxX = originX + (width  - 0.5) * cellSize;
  const maxZ = originZ + (height - 0.5) * cellSize;

  return (p.x >= minX && p.x <= maxX && p.z >= minZ && p.z <= maxZ);
}
