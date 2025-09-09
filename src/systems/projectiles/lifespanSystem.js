export function lifespanSystem(dt, world, registry) {
  const now = performance.now();
  const ents = registry.query(["Lifespan"]);
  for (const e of ents) {
    const life = e.components.Lifespan;
    if (now - life.bornAt >= life.ms) {
      const t = e.components.Transform;
      const pos = t?.position || {x:0,y:0,z:0};
      const d = e.components.Direction || { x:0,y:0,z:1 };
      const kind = e.components.Projectile?.kind || "bullet";
      world.vfxQueue = world.vfxQueue || [];

      // Clear projectile follow target if any
      if (world.followProjectileTargetId) world.followProjectileTargetId = null;

      // Start cinematic explosion camera orbit for 3 seconds (both shell and bullet)
      if (world.cinematicEnabled === false) { /* cinematic disabled */ } else {
      world.cinematicExplosion = {
        active: true,
        phase: "orbit",
        t: 0,
        duration: 3.0,
        center: { x: pos.x, y: pos.y, z: pos.z },
        // orbit radius based on explosion size
        radius: (kind === "shell" ? (3.0 + Math.random()*2.5) : (1.5 + Math.random()*0.8)),
        height: 0.6 + Math.random()*0.6,     // 0.6..1.2
        angVel: (Math.random() < 0.5 ? -1 : 1) * (0.9 + Math.random()*0.6), // rad/s
        noise: 0.35
      };

      }

      if (kind === "shell") {
        world.vfxQueue.push({ preset: "SHELL_EXPLOSION_LARGE", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
        // camera shake
        world.cameraShake = { time: 0.35, duration: 0.35, magnitude: 0.25 };
      } else {
        if (Math.random() < 0.5) {
          world.vfxQueue.push({ preset: "BULLET_SPARK_STORM", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
          world.vfxQueue.push({ kind: "BALL_GROW", worldPos: { x:pos.x, y:pos.y, z:pos.z }, life: 10.0, size0: 0.20, size1: 3.8 });
        } else {
          world.vfxQueue.push({ preset: "BULLET_SPARK_STORM", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
        }
      }

      if (e.object3D && e.object3D.parent) e.object3D.parent.remove(e.object3D);
      registry.remove(e.id);
    }
  }
}
