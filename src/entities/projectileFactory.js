import * as THREE from "three";
import { createTransform } from "../components/transform.js";
import { createDirection } from "../components/direction.js";
import { createProjectile } from "../components/projectile.js";
import { createLifespan } from "../components/lifespan.js";
import { createTracer } from "../components/tracer.js";

export function spawnBullet(registry, scene, position, forward) {
  return spawnProjectile(registry, scene, position, forward, {
    kind: "bullet", speed: 800, tracer: { length: 5, width: 0.04, color: 0xFFD080 }
  });
}
export function spawnShell(registry, scene, position, forward) {
  return spawnProjectile(registry, scene, position, forward, {
    kind: "shell", speed: 250, tracer: { length: 7, width: 0.08, color: 0xFFA500 }
  });
}

function spawnProjectile(registry, scene, position, forward, opts) {
  const eid = registry.nextId();
  const group = new THREE.Group();
  // tiny visible core
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(opts.kind === "shell" ? 0.06 : 0.03, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
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
