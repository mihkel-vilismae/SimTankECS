import { movementInputSystem } from "../systems/movementInputSystem.js";
import { flyInputSystem } from "../systems/flyInputSystem.js";
import { movementTransformationSystem } from "../systems/movementTransformationSystem.js";
import { flyMovementSystem } from "../systems/flyMovementSystem.js";
import { transformApplySystem } from "../systems/transformApplySystem.js";
import { mouseRaycastSystem } from "../systems/mouseRaycastSystem.js";
import { lookAtMouseSystem } from "../systems/lookAtMouseSystem.js";
import { cameraFollowSystem } from "../systems/cameraFollowSystem.js";
import { arrowGizmoSystemFactory } from "../systems/arrowGizmoSystem.js";

export function registerSystems({ loop, scene, registry }) {
  const arrowGizmoSystem = arrowGizmoSystemFactory(scene);

  loop.addSystem(movementInputSystem);        // WASD
  loop.addSystem(flyInputSystem);             // Q/E (+ boost)
  loop.addSystem(movementTransformationSystem);
  loop.addSystem(flyMovementSystem);
  loop.addSystem(transformApplySystem);
  loop.addSystem(mouseRaycastSystem);         // camera → ground hit
  loop.addSystem(lookAtMouseSystem);          // face mouse ground
  loop.addSystem(cameraFollowSystem);
  loop.addSystem(arrowGizmoSystem);
}
