import { Collider } from "../../components/collider.js";
import { computeObjectAABB, expandHalf } from "../../utils/aabb.js";

export function autoColliderAttachSystem(dt, world, registry){
  if (world._autoCollidersOnce) return;
  const ents = registry.query ? registry.query(["Transform"]) : [];
  for (const e of ents) {
    const has = registry.getComponent(e, "Collider");
    if (has) continue;
    const needs = !!registry.getComponent(e, "Vehicle") || !!registry.getComponent(e, "Gun") || !!registry.getComponent(e, "Turret");
    if (!needs) continue;
    const obj = e.object3D;
    if (!obj) continue;
    try {
      const aabb = computeObjectAABB(obj);
      const t = registry.getComponent(e, "Transform");
      const localCenter = t ? { x: aabb.center.x - t.position.x, y: aabb.center.y - t.position.y, z: aabb.center.z - t.position.z } : aabb.center;
      registry.addComponent(e, "Collider", Collider({ center: localCenter, half: expandHalf(aabb.half, 0.2) }));
    } catch {}
  }
  world._autoCollidersOnce = true;
}
