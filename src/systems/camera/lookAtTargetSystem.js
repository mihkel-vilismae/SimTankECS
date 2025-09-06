import { Logger } from "../../utils/logger.js";

/**
 * Keeps camera position fixed, but orients it to look at the controlled entity.
 * Active only when world.cameraMode === "look".
 */
export function lookAtTargetSystem(dt, world, registry) {
  if (world.cameraMode !== "look") return;
  const id = world.control?.entityId;
  if (!id) return;
  const ent = registry.getById?.(id);
  if (!ent?.components?.Transform) return;
  const t = registry.getComponent(ent, "Transform");
  world.camera.lookAt(t.position.x, t.position.y, t.position.z);
  Logger.info("[lookAtTargetSystem] look at target", { id });
}