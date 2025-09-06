import { Logger } from "../../utils/logger.js";

export function movementInputSystem(dt, world, registry) {
  const { keys } = world.input;
  const forward = (keys["KeyW"] ? 1 : 0) + (keys["ArrowUp"] ? 1 : 0) - ((keys["KeyS"] ? 1 : 0) + (keys["ArrowDown"] ? 1 : 0));
  const turn = ((keys["KeyA"] ? 1 : 0) + (keys["ArrowLeft"] ? 1 : 0)) - ((keys["KeyD"] ? 1 : 0) + (keys["ArrowRight"] ? 1 : 0));

  const targetId = world.control?.entityId;
  const ents = registry.query(["InputMove"]);

  // Zero everyone first
  for (const ent of ents) {
    registry.getComponent(ent, "InputMove").forward = 0;
    registry.getComponent(ent, "InputMove").turn = 0;
  }

  if (!targetId) {
    Logger.info("[movementInputSystem] no controlled entity");
    return;
  }
  const target = registry.getById?.(targetId);
  if (!target || !registry.getComponent(target, "InputMove")) {
    Logger.info("[movementInputSystem] target missing or not drivable", { targetId });
    return;
  }
  registry.getComponent(target, "InputMove").forward = forward;
  registry.getComponent(target, "InputMove").turn = turn;

  Logger.info("[movementInputSystem] applied to controlled", { forward, turn, targetId });
}