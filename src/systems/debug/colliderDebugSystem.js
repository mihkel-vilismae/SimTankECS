import * as THREE from "three";

export function colliderDebugSystem(dt, world, registry) {
  if (!world.debugColliders && world._colliderHelpers) {
    // remove helpers
    for (const h of world._colliderHelpers) {
      if (h.parent) h.parent.remove(h);
    }
    world._colliderHelpers = null;
    return;
  }
  if (!world.debugColliders) return;

  const scene = world.scene;
  if (!scene) return;

  if (!world._colliderHelpers) world._colliderHelpers = [];

  // refresh helpers list to match colliders (lightweight: clear & rebuild)
  for (const h of world._colliderHelpers) {
    if (h.parent) h.parent.remove(h);
  }
  world._colliderHelpers = [];

  const ents = registry.query ? registry.query(["Collider","Transform"]) : [];
  for (const e of ents) {
    const t = registry.getComponent(e, "Transform");
    const c = registry.getComponent(e, "Collider");
    if (!t || !c) continue;
    const center = new THREE.Vector3(
      t.position.x + c.center.x,
      t.position.y + c.center.y,
      t.position.z + c.center.z
    );
    const size = new THREE.Vector3(c.half.x*2, c.half.y*2, c.half.z*2);
    const box = new THREE.Box3();
    box.min.copy(center).sub(size.clone().multiplyScalar(0.5));
    box.max.copy(center).add(size.clone().multiplyScalar(0.5));
    const helper = new THREE.Box3Helper(box, 0x00ff88);
    scene.add(helper);
    world._colliderHelpers.push(helper);
  }
}
