import { getPools } from "../../vfx/runtimePools.js";

export function vfxUpdateSystem(dt, world, registry) {
  if (!world.vfxActive || world.vfxActive.length === 0) return;
  const pools = getPools(world.scene);
  const keep = [];
  for (const p of world.vfxActive) {
    p.t += dt;
    const a = Math.max(0, 1 - p.t / p.life);

    if (p.kind === "flash") {
      const s = p.obj;
      s.scale.setScalar(p.size0 * (0.6 + 0.4*a));
      s.material.opacity = a;
      if (p.t >= p.life) pools.flash.put(s); else keep.push(p);
    } else if (p.kind === "light") {
      const l = p.obj;
      l.intensity = p.i0 * a;
      if (p.t >= p.life) pools.light.put(l); else keep.push(p);
    } else if (p.kind === "smoke") {
      const s = p.obj;
      s.position.x += p.vel.x * dt;
      s.position.y += p.vel.y * dt;
      s.position.z += p.vel.z * dt;
      s.material.opacity = a * 0.8;
      s.scale.setScalar(p.size0 * (1.0 + 1.5*(1-a)));
      if (p.t >= p.life) pools.smoke.put(s); else keep.push(p);
    } else if (p.kind === "spark") {
      const m = p.obj;
      p.vel.y += p.g * dt;
      m.position.x += p.vel.x * dt;
      m.position.y += p.vel.y * dt;
      m.position.z += p.vel.z * dt;
      m.material.opacity = 0.8 * a;
      if (p.t >= p.life) pools.sparks.put(m); else keep.push(p);
    } else if (p.kind === "ring") {
      const r = p.obj;
      const radius = p.r0 + (p.r1 - p.r0) * (p.t / p.life);
      r.scale.set(radius, radius, 1);
      r.material.opacity = a;
      if (p.t >= p.life) pools.shock.put(r); else keep.push(p);
    }
  }
  world.vfxActive = keep;
}
