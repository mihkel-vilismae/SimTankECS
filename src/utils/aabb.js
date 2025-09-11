import * as THREE from "three";

export function computeObjectAABB(object3D){
  const box = new THREE.Box3();
  box.setFromObject(object3D);
  if (!isFinite(box.min.x) || !isFinite(box.max.x)) {
    return { center: {x:0,y:0,z:0}, half: {x:0.5,y:0.5,z:0.5} };
  }
  const center = { x:(box.min.x+box.max.x)/2, y:(box.min.y+box.max.y)/2, z:(box.min.z+box.max.z)/2 };
  const half = { x:(box.max.x-box.min.x)/2, y:(box.max.y-box.min.y)/2, z:(box.max.z-box.min.z)/2 };
  return { center, half };
}

export function expandHalf(h, eps){ return { x:h.x+eps, y:h.y+eps, z:h.z+eps }; }
