export function projectileFlightSystem(dt, world, registry) {
  const ents = registry.query(["Projectile","Direction","Transform"]);
  for (const e of ents) {
    const p = e.components.Projectile;
    const d = e.components.Direction;
    const t = e.components.Transform;

    t.position.x += d.x * p.speed * dt;
    t.position.y += d.y * p.speed * dt;
    t.position.z += d.z * p.speed * dt;

    // Shells: add simple gravity + trail puffs
    if (p.kind === 'shell') {
        // basic gravity (m/s^2) – simple and test-friendly
        t.position.y += -9.8 * dt;
        world.vfxQueue = world.vfxQueue || [];
        world.vfxQueue.push({
          preset: 'SHELL_TRAIL_PUFF',
          worldPos: { x: t.position.x, y: t.position.y, z: t.position.z }
        });
    }


    // Orient to travel direction
    const yaw = Math.atan2(d.x, d.z);
    const pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
    t.rotation.yaw = yaw;
    t.rotation.pitch = pitch;
  }
}
