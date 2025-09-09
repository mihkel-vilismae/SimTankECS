export function projectileFlightSystem(dt, world, registry) {
  const ents = registry.query(["Projectile","Transform"]);
  world.vfxQueue = world.vfxQueue || [];
  for (const e of ents) {
    const p = e.components.Projectile;
    const t = e.components.Transform;
    // Initialize velocity from Direction if needed
    if (!e._vel) {
      const d = e.components.Direction || { x:0, y:0, z:1 };
      const m = Math.hypot(d.x, d.y, d.z) || 1;
      e._vel = { x: (d.x/m)*p.speed, y: (d.y/m)*p.speed, z: (d.z/m)*p.speed };
    }
    const v = e._vel;

    if (p.kind === "shell") {
      // Gravity & drag
      const g = -9.8; // units/s^2
      const drag = 0.4; // linear drag
      v.y += g * dt;
      v.x *= (1 - drag*dt);
      v.y *= (1 - drag*dt);
      v.z *= (1 - drag*dt);

      // Smoke trail (emit ~20 puffs/sec max)
      e._trailAcc = (e._trailAcc || 0) + dt;
      const interval = 1/20;
      if (e._trailAcc >= interval) {
        e._trailAcc -= interval;
        world.vfxQueue.push({
          preset: "SHELL_TRAIL_PUFF",
          worldPos: { x: t.position.x, y: t.position.y, z: t.position.z },
          forward: { x: -v.x, y: -v.y, z: -v.z } // opposite of travel
        });
      }
    }

    // Integrate position
    t.position.x += v.x * dt;
    t.position.y += v.y * dt;
    t.position.z += v.z * dt;

    // Bullet faint trail
    if (p.kind === "bullet") {
      e._trailAcc = (e._trailAcc || 0) + dt;
      const interval = 1/10;
      if (e._trailAcc >= interval) {
        e._trailAcc -= interval;
        world.vfxQueue.push({
          preset: "BULLET_TRAIL_PUFF",
          worldPos: { x: t.position.x, y: t.position.y, z: t.position.z },
          forward: { x: -v.x, y: -v.y, z: -v.z }
        });
      }
    }

    // Orient to velocity
    const len = Math.hypot(v.x, v.y, v.z) || 1;
    const yaw = Math.atan2(v.x, v.z);
    const pitch = Math.atan2(v.y, Math.hypot(v.x, v.z));
    t.rotation.yaw = yaw;
    t.rotation.pitch = pitch;
  }
}
