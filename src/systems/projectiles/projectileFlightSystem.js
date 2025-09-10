export function projectileFlightSystem(dt, world, registry) {
  const ents = registry.query(["Projectile","Direction","Transform"]);
  for (const e of ents) {
    const p = e.components.Projectile;
    const d = e.components.Direction;
    const t = e.components.Transform;

    t.position.x += d.x * p.speed * dt;
    t.position.y += d.y * p.speed * dt;
    t.position.z += d.z * p.speed * dt;

    // Orient to travel direction
    const yaw = Math.atan2(d.x, d.z);
    const pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
    t.rotation.yaw = yaw;
    t.rotation.pitch = pitch;
  }
}
