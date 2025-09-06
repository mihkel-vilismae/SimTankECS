import { Logger } from "../../utils/logger.js";

export function movementInputSystem(dt, world, registry) {
  const { keys } = world.input;
  const forward = (keys["KeyW"] ? 1 : 0) + (keys["ArrowUp"] ? 1 : 0) - ((keys["KeyS"] ? 1 : 0) + (keys["ArrowDown"] ? 1 : 0));
  const turn = (keys["KeyD"] ? 1 : 0) + (keys["ArrowRight"] ? 1 : 0) - ((keys["KeyA"] ? 1 : 0) + (keys["ArrowLeft"] ? 1 : 0));

  const targetId = world.control?.entityId;
  const ents = registry.query(["InputMove"]);

  // Zero everyone first
  for (const ent of ents) {
    ent.components.InputMove.forward = 0;
    ent.components.InputMove.turn = 0;
  }

  if (!targetId) {
    Logger.info("[movementInputSystem] no controlled entity");
    return;
  }
  const target = registry.getById?.(targetId);
  if (!target || !target.components?.InputMove) {
    Logger.info("[movementInputSystem] target missing or not drivable", { targetId });
    return;
  }
  target.components.InputMove.forward = forward;
  target.components.InputMove.turn = turn;

  Logger.info("[movementInputSystem] applied to controlled", { forward, turn, targetId });
}
