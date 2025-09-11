// src/physics/collision/geometry.js
// Basic collision helpers: AABB<->AABB, Sphere<->Sphere, Sphere<->AABB, and MTV for AABB<->AABB

export function vec3(x=0,y=0,z=0){ return {x,y,z}; }
export function sub(a,b){ return { x:a.x-b.x, y:a.y-b.y, z:a.z-b.z }; }
export function abs(v){ return { x:Math.abs(v.x), y:Math.abs(v.y), z:Math.abs(v.z) }; }

export function aabbOverlap(centerA, heA, centerB, heB){
  const dx = Math.abs(centerA.x - centerB.x) - (heA.x + heB.x);
  const dy = Math.abs(centerA.y - centerB.y) - (heA.y + heB.y);
  const dz = Math.abs(centerA.z - centerB.z) - (heA.z + heB.z);
  return (dx <= 0 && dy <= 0 && dz <= 0);
}

export function sphereSphereOverlap(centerA, rA, centerB, rB){
  const dx = centerA.x - centerB.x;
  const dy = centerA.y - centerB.y;
  const dz = centerA.z - centerB.z;
  const d2 = dx*dx + dy*dy + dz*dz;
  const r = rA + rB;
  return d2 <= r*r;
}

export function sphereAabbOverlap(centerS, r, centerB, heB){
  // compute closest point on AABB to sphere center, then compare distance
  const minB = { x: centerB.x - heB.x, y: centerB.y - heB.y, z: centerB.z - heB.z };
  const maxB = { x: centerB.x + heB.x, y: centerB.y + heB.y, z: centerB.z + heB.z };
  const cx = Math.max(minB.x, Math.min(centerS.x, maxB.x));
  const cy = Math.max(minB.y, Math.min(centerS.y, maxB.y));
  const cz = Math.max(minB.z, Math.min(centerS.z, maxB.z));
  const dx = centerS.x - cx;
  const dy = centerS.y - cy;
  const dz = centerS.z - cz;
  return (dx*dx + dy*dy + dz*dz) <= r*r;
}

/**
 * Minimum Translation Vector (axis-aligned) to separate A from B for overlapping AABBs.
 * Returns { x, y, z } pointing A->out (smallest axis). If not overlapping, returns null.
 */
export function aabbAabbMTV(centerA, heA, centerB, heB){
  if (!aabbOverlap(centerA, heA, centerB, heB)) return null;
  const dx = (heA.x + heB.x) - Math.abs(centerA.x - centerB.x);
  const dy = (heA.y + heB.y) - Math.abs(centerA.y - centerB.y);
  const dz = (heA.z + heB.z) - Math.abs(centerA.z - centerB.z);
  // choose axis with smallest penetration
  if (dx <= dy && dx <= dz){
    return { x: (centerA.x < centerB.x) ? -dx : dx, y: 0, z: 0 };
  } else if (dy <= dx && dy <= dz){
    return { x: 0, y: (centerA.y < centerB.y) ? -dy : dy, z: 0 };
  } else {
    return { x: 0, y: 0, z: (centerA.z < centerB.z) ? -dz : dz };
  }
}
