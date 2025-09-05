import { Logger } from "../utils/logger.js";

export function movementInputSystem(dt, world, registry) {
  const { keys } = world.input;
  const forward = (keys["KeyW"] ? 1 : 0) + (keys["ArrowUp"] ? 1 : 0) - ((keys["KeyS"] ? 1 : 0) + (keys["ArrowDown"] ? 1 : 0));
  const turn = (keys["KeyD"] ? 1 : 0) + (keys["ArrowRight"] ? 1 : 0) - ((keys["KeyA"] ? 1 : 0) + (keys["ArrowLeft"] ? 1 : 0));

  for (const ent of registry.query(["InputMove"])) {
    ent.components.InputMove.forward = forward;
    ent.components.InputMove.turn = turn;
  }
  // One-line structured log (debug-level would be better; we keep info per style)
  Logger.info("[movementInputSystem] keys", { forward, turn });
}
