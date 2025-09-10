import * as THREE from "three";
import { createTransform } from "../components/transform.js";
import { createDirection } from "../components/direction.js";
import { createProjectile } from "../components/projectile.js";
import { createLifespan } from "../components/lifespan.js";
import { createTracer } from "../components/tracer.js";

export function spawnBullet(registry, scene, position, forward) {
  return spawnProjectile(registry, scene, position, forward, {
    kind: "bullet", speed: 300,
    tracer: { length: 4, width: 0.035, color: 0xE8F7A0 },
    coreRadius: 0.025, coreColor: 0xffffff
  });
}
export function spawnShell(registry, scene, position, forward) {
  return spawnProjectile(registry, scene, position, forward, {
    kind: "shell", speed: 120,
    tracer: { length: 8, width: 0.09, color: 0xFF8C00 },
    coreRadius: 0.07, coreColor: 0xFF5500
  });
}

function spawnProjectile(registry, scene, position, forward, opts) {
  const eid = registry.nextId();
  const group = new THREE.Group();

  // Visible core (distinct sizes/colors)
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(opts.coreRadius, 12, 8),
    new THREE.MeshBasicMaterial({ color: opts.coreColor })
  );
  core.name = "projectile-core";
  group.add(core);

  const ent = {
    id: eid,
    object3D: group,
    components: {
      Transform: createTransform(position.x, position.y, position.z, 0, 0, 0),
      Direction: createDirection(forward.x, forward.y, forward.z),
      Projectile: createProjectile({ kind: opts.kind, speed: opts.speed }),
      Lifespan: createLifespan(5000),
      Tracer: createTracer(opts.tracer),
    },
  };
  registry.add(ent);
  if (scene) scene.add(group);
  return ent;
}
