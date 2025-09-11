import { normalizeAngle } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

export function movementTransformationSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);
  const targetId = world.control?.entityId;
  if (!targetId) return;
  const ent = registry.getById?.(targetId);
  if (!ent || !getC(ent, "Transform") || !getC(ent, "InputMove") || !getC(ent, "Locomotion")) return;

  // If the controlled entity can fly, let flyMovementSystem handle horizontal motion.
  if (getC(ent, "Flight")) return;

  const t = getC(ent, "Transform");
  const im = getC(ent, "InputMove");
  const loco = getC(ent, "Locomotion");

  // Turn in place
  t.rotation.yaw = normalizeAngle(t.rotation.yaw + im.turn * loco.turnRate * dt);

  // Move forward in yaw
  const speed = im.forward * loco.speed;
  t.position.x += Math.sin(t.rotation.yaw) * speed * dt;
  t.position.z += Math.cos(t.rotation.yaw) * speed * dt;

  Logger.info("[movementTransformationSystem] applied to controlled (ground)", { id: ent.id });
}
