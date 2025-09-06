import { movementInputSystem } from "../systems/input/movementInputSystem.js";
import { flyInputSystem } from "../systems/input/flyInputSystem.js";
import { movementTransformationSystem } from "../systems/motion/movementTransformationSystem.js";
import { flyMovementSystem } from "../systems/motion/flyMovementSystem.js";
import { transformApplySystem } from "../systems/motion/transformApplySystem.js";
import { mouseRaycastSystem } from "../systems/perception/mouseRaycastSystem.js";
import { lookAtMouseSystem } from "../systems/perception/lookAtMouseSystem.js";
import { lookAtTargetSystem } from "../systems/camera/lookAtTargetSystem.js";
import { createOrbitControlsSystem } from "../systems/camera/orbitControlsSystem.js";
import { cameraFollowSystem } from "../systems/camera/cameraFollowSystem.js";
import { arrowGizmoSystemFactory } from "../systems/rendering/arrowGizmoSystem.js";
import { hardpointMountSystem } from "../systems/attachment/hardpointMountSystem.js";
import { turretAimingSystem } from "../systems/aim/turretAimingSystem.js";
import { weaponElevationSystem } from "../systems/aim/weaponElevationSystem.js";
import { weaponInputSystem } from "../systems/weapons/weaponInputSystem.js";

export function registerSystems({ loop, scene, registry, camera, renderer }){
  const arrowGizmoSystem = arrowGizmoSystemFactory(scene);

  loop.addSystem(movementInputSystem);        // WASD
  loop.addSystem(flyInputSystem);             // Q/E (+ boost)
  loop.addSystem(movementTransformationSystem);
  loop.addSystem(flyMovementSystem);
  // Aiming & mounting happen before we mirror Transforms to object3D
  loop.addSystem(mouseRaycastSystem);
  loop.addSystem(turretAimingSystem);
  loop.addSystem(weaponElevationSystem);
  loop.addSystem(hardpointMountSystem);
  // Fire input (ammo/cooldowns)
  loop.addSystem(weaponInputSystem);
  // Apply transforms to meshes last
  loop.addSystem(transformApplySystem);
  loop.addSystem(lookAtTargetSystem);
  const orbitSystem = createOrbitControlsSystem(camera, renderer.domElement);
  loop.addSystem(orbitSystem);         // camera LOOK mode
  loop.addSystem(lookAtMouseSystem);          // face mouse ground
  loop.addSystem(cameraFollowSystem);
  loop.addSystem(arrowGizmoSystem);
}
