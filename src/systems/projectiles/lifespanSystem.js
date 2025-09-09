export function lifespanSystem(dt, world, registry) {
  const now = performance.now();
  const ents = registry.query(["Lifespan"]);
  for (const e of ents) {
    const life = e.components.Lifespan;
    if (now - life.bornAt >= life.ms) {
      // VFX on self-destruct
      const t = e.components.Transform;
      const pos = t?.position || {x:0,y:0,z:0};
      const d = e.components.Direction || { x:0,y:0,z:1 };
      world.vfxQueue = world.vfxQueue || [];
      const kind = e.components.Projectile?.kind || "bullet";
      if (kind === "shell") {
        world.vfxQueue.push({ preset: "SHELL_EXPLOSION_LARGE", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
      } else {
        if (Math.random() < 0.5) {
          world.vfxQueue.push({ preset: "BULLET_SPARK_STORM", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
          world.vfxQueue.push({ kind: "BALL_GROW", worldPos: { x:pos.x, y:pos.y, z:pos.z }, life: 10.0, size0: 0.15, size1: 3.5 });
        } else {
          world.vfxQueue.push({ preset: "BULLET_SPARK_STORM", worldPos: { x:pos.x, y:pos.y, z:pos.z }, forward: { x:d.x, y:d.y, z:d.z } });
        }
      }

      // remove from scene and registry
      if (e.object3D && e.object3D.parent) e.object3D.parent.remove(e.object3D);
      registry.remove(e.id);
    }
  }
}
