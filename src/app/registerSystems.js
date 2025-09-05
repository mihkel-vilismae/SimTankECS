import { movementInputSystem } from "../systems/movementInputSystem.js";
import { movementTransformationSystem } from "../systems/movementTransformationSystem.js";
import { transformApplySystem } from "../systems/transformApplySystem.js";
import { cameraFollowSystem } from "../systems/cameraFollowSystem.js";
import { arrowGizmoSystemFactory } from "../systems/arrowGizmoSystem.js";

export function registerSystems({ loop, scene /* camera not used here */, registry }) {
  const arrowGizmoSystem = arrowGizmoSystemFactory(scene);

  loop.addSystem(movementInputSystem);
  loop.addSystem(movementTransformationSystem);
  loop.addSystem(transformApplySystem);
  loop.addSystem(cameraFollowSystem);
  loop.addSystem(arrowGizmoSystem);
}
