// Maps keyboard input to InputMove for the controlled entity.
// Forward/back: W/S or Up/Down. Turn left/right: A/D or Left/Right.
export function movementInputSystem(dt, world, registry) {
  const control = world.control;
  if (!control || !control.entityId) {
    if (world.logger && world.logger.debug) world.logger.debug('[movementInputSystem] no controlled entity');
    return;
  }
  world.input = world.input || { keys: {}, mouse: { down:false, x:null, y:null, wheelDelta:0 } };
  const ent = registry.getById(control.entityId);
  if (!ent || !ent.components?.InputMove) return;

  const keys = world.input?.keys || {};

  const forward = (keys['KeyW'] ? 1 : 0)
    + (keys['ArrowUp'] ? 1 : 0)
    - (keys['KeyS'] ? 1 : 0)
    - (keys['ArrowDown'] ? 1 : 0);

  // Positive turn = right; A/Left means intent to turn right (tank-style steering).
  const turn = (keys['KeyA'] ? 1 : 0)
    + (keys['ArrowLeft'] ? 1 : 0)
    - (keys['KeyD'] ? 1 : 0)
    - (keys['ArrowRight'] ? 1 : 0);

  ent.components.InputMove.forward = Math.max(-1, Math.min(1, forward));
  ent.components.InputMove.turn = Math.max(-1, Math.min(1, turn));

  if (world.logger && world.logger.debug) {
    world.logger.debug('[movementInputSystem] applied to controlled', { forward: ent.components.InputMove.forward, turn: ent.components.InputMove.turn, targetId: ent.id });
  }
}
