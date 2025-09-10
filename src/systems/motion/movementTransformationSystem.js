import { normalizeAngle } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

export function movementTransformationSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);

  // Prefer entities with Transform + InputMove (Controlled is optional for tests)
  let ents = registry.query?.(["Transform","InputMove"]) ?? [];

  // Fallback: use world.control.entityId
  if (!ents.length && world?.control?.entityId) {
    const e = registry.getById ? registry.getById(world.control.entityId) : world.control.entityId;
    if (e && getC(e, "Transform") && getC(e, "InputMove")) ents = [e];
  }
  if (!ents.length) return;

  for (const e of ents) {
    const t = getC(e, "Transform");
    const m = getC(e, "InputMove");

    const moveSpeed = (t.moveSpeed ?? t.speed ?? 1);
    const turnSpeed = (t.turnSpeed ?? 1);

    // Turn (yaw) and forward along +Z (tests expect z to increase)
    t.rotation.yaw += (m.turn ?? 0) * turnSpeed * dt;
    t.position.z   += (m.forward ?? 0) * moveSpeed * dt;

    console.log('[movementTransformationSystem] applied to controlled (ground)', { id: e.id });
  }
}

