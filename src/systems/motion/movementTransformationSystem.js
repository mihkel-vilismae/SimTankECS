import { normalizeAngle } from "../../utils/math3d.js";
import { Logger } from "../../utils/logger.js";

export function movementTransformationSystem(dt, world, registry) {
  const targetId = world.control?.entityId;
  if (!targetId) return;
  const ent = registry.getById?.(targetId);
  if (!ent || !registry.getComponent(ent, "Transform") || !registry.getComponent(ent, "InputMove") || !registry.getComponent(ent, "Locomotion")) return;

  // If the controlled entity can fly, let flyMovementSystem handle horizontal motion.
  if (registry.getComponent(ent, "Flight")) return;

  const t = registry.getComponent(ent, "Transform");
  const im = registry.getComponent(ent, "InputMove");
  const loco = registry.getComponent(ent, "Locomotion");

  // Turn in place
  t.rotation.yaw = normalizeAngle(t.rotation.yaw + im.turn * loco.turnRate * dt);

  // Move forward in yaw
  const speed = im.forward * loco.speed;
  t.position.x += Math.sin(t.rotation.yaw) * speed * dt;
  t.position.z += Math.cos(t.rotation.yaw) * speed * dt;

  Logger.info("[movementTransformationSystem] applied to controlled (ground)", { id: ent.id });
}