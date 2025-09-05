import { Logger } from "../utils/logger.js";

export function flyMovementSystem(dt, world, registry) {
  for (const e of registry.query(["Transform", "Flight"])) {
    const t = e.components.Transform;
    const f = e.components.Flight;
    t.position.y += f.vertical * f.climbRate * f.boost * dt;
    if (t.position.y < 0.5) t.position.y = 0.5; // simple ground clamp
  }
  Logger.info("[flyMovementSystem] applied");
}
