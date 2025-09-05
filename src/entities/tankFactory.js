import * as THREE from "three";
import { createTransform } from "../components/transform.js";
import { createInputMove, createLocomotion } from "../components/motion.js";
import { createArrowGizmo } from "../components/arrowGizmo.js";

export function createTank(registry) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x3388ff })
  );
  mesh.castShadow = true;
  mesh.position.y = 0.5;

  const entity = {
    id: registry.nextId(),
    object3D: mesh,
    components: {
      Transform: createTransform(0, 0.5, 0, 0, 0, 0),
      InputMove: createInputMove(),
      Locomotion: createLocomotion(4.0, 2.0),
      ArrowGizmo: createArrowGizmo({ length: 2.0 }),
    },
  };

  registry.add(entity);
  return entity;
}
