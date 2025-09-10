import { Logger } from "../../utils/logger.js";

export function movementInputSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);
  const { keys } = world.input;
  const forward = (keys["KeyW"] ? 1 : 0) + (keys["ArrowUp"] ? 1 : 0) - ((keys["KeyS"] ? 1 : 0) + (keys["ArrowDown"] ? 1 : 0));
  const turn = ((keys["KeyA"] ? 1 : 0) + (keys["ArrowLeft"] ? 1 : 0)) - ((keys["KeyD"] ? 1 : 0) + (keys["ArrowRight"] ? 1 : 0));

  const targetId = world.control?.entityId;
  const ents = registry.query(["InputMove"]);

  // Zero everyone first
  for (const ent of ents) {
    getC(ent, "InputMove").forward = 0;
    getC(ent, "InputMove").turn = 0;
  }

  if (!targetId) {
    Logger.info("[movementInputSystem] no controlled entity");
    return;
  }
  const target = registry.getById?.(targetId);
  if (!target || !getC(target, "InputMove")) {
    Logger.info("[movementInputSystem] target missing or not drivable", { targetId });
    return;
  }
  getC(target, "InputMove").forward = forward;
  getC(target, "InputMove").turn = turn;

  Logger.info("[movementInputSystem] applied to controlled", { forward, turn, targetId });
}