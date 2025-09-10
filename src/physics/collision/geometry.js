// src/physics/collision/geometry.js
export function vec3(x=0,y=0,z=0){ return {x,y,z}; }
export function aabbOverlap(centerA, heA, centerB, heB){
  const dx = Math.abs(centerA.x - centerB.x) - (heA.x + heB.x);
  const dy = Math.abs(centerA.y - centerB.y) - (heA.y + heB.y);
  const dz = Math.abs(centerA.z - centerB.z) - (heA.z + heB.z);
  return (dx <= 0 && dy <= 0 && dz <= 0);
}
export function sphereAabbOverlap(centerS, r, centerB, heB){
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
export function aabbAabbMTV(centerA, heA, centerB, heB){
  const overlapX = (heA.x + heB.x) - Math.abs(centerA.x - centerB.x);
  const overlapY = (heA.y + heB.y) - Math.abs(centerA.y - centerB.y);
  const overlapZ = (heA.z + heB.z) - Math.abs(centerA.z - centerB.z);
  if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) return null;
  if (overlapX <= overlapY && overlapX <= overlapZ){
    return { x: (centerA.x < centerB.x) ? -overlapX : overlapX, y:0, z:0 };
  } else if (overlapY <= overlapX && overlapY <= overlapZ){
    return { x:0, y: (centerA.y < centerB.y) ? -overlapY : overlapY, z:0 };
  } else {
    return { x:0, y:0, z: (centerA.z < centerB.z) ? -overlapZ : overlapZ };
  }
}
