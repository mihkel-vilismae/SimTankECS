// Axis-aligned bounding box collider
export function Collider({ center = {x:0,y:0,z:0}, half = {x:0.5,y:0.5,z:0.5} } = {}) {
  return { center, half };
}
