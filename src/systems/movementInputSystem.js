import { Logger } from "../utils/logger.js";

export function movementInputSystem(dt, world, registry) {
  const { keys } = world.input;
  const forward = (keys["KeyW"] ? 1 : 0) + (keys["ArrowUp"] ? 1 : 0) - ((keys["KeyS"] ? 1 : 0) + (keys["ArrowDown"] ? 1 : 0));
  const turn = (keys["KeyD"] ? 1 : 0) + (keys["ArrowRight"] ? 1 : 0) - ((keys["KeyA"] ? 1 : 0) + (keys["ArrowLeft"] ? 1 : 0));

  const targetId = world.control?.entityId;
  const ents = registry.query(["InputMove"]);
  for (const ent of ents) {
    if (targetId && ent.id !== targetId) continue; // only apply to controlled entity when set
    ent.components.InputMove.forward = forward;
    ent.components.InputMove.turn = turn;
  }
  Logger.info("[movementInputSystem] keys", { forward, turn, targetId });
}
