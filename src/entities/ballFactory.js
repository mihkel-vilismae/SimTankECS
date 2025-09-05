import * as THREE from "three";
import { createTransform } from "../components/transform.js";
import { createInputMove } from "../components/motion.js";
import { createFlight } from "../components/flight.js";
import { createMouseFollower } from "../components/mouseFollower.js";
import { createArrowGizmo } from "../components/arrowGizmo.js";

export function createBall(registry) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xff5555 })
  );
  mesh.castShadow = true;
  mesh.position.y = 2;

  const ent = {
    id: registry.nextId(),
    object3D: mesh,
    components: {
      Transform: createTransform(2, 2, 0, 0, 0, 0),
      InputMove: createInputMove(),            // reuse WASD for forward/turn
      Flight: createFlight(5, 2.5, 3.5),       // Q/E vertical control + boost
      MouseFollower: createMouseFollower({ yawLerp: 0.18 }),
      ArrowGizmo: createArrowGizmo({ length: 1.4, color: 0xffaa00 }),
    },
  };
  registry.add(ent);
  return ent;
}
