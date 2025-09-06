import { Logger } from "../../utils/logger.js";

export function flyMovementSystem(dt, world, registry) {
  const targetId = world.control?.entityId;
  if (!targetId) return;
  const e = registry.getById?.(targetId);
  if (!e || !e.components?.Transform || !e.components?.Flight) return;

  const t = e.components.Transform;
  const f = e.components.Flight;
  const im = e.components.InputMove; // forward (W/S), turn used here as lateral/strafe (A/D)

  // Vertical (Q/E with boost)
  t.position.y += f.vertical * f.climbRate * f.boost * dt;
  if (t.position.y < 0.5) t.position.y = 0.5; // simple ground clamp

  // Horizontal: forward/back along yaw; lateral strafe perpendicular to yaw
  if (im) {
    const forwardSpeed = (f.speed ?? 5) * (im.forward || 0);
    const strafeSpeed = (f.speed ?? 5) * (im.turn || 0); // reuse 'turn' as strafe input
    const yaw = t.rotation.yaw || 0;
    // forward vector
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    // right vector (perpendicular)
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);

    t.position.x += (fx * forwardSpeed + rx * strafeSpeed) * dt;
    t.position.z += (fz * forwardSpeed + rz * strafeSpeed) * dt;
  }

  Logger.info("[flyMovementSystem] applied to controlled (flying)", { id: e.id });
}
