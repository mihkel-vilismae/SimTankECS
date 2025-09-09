export function lifespanSystem(dt, world, registry) {
  const now = performance.now();
  const ents = registry.query(["Lifespan"]);
  for (const e of ents) {
    const life = e.components.Lifespan;
    if (now - life.bornAt >= life.ms) {
      // remove from scene and registry
      if (e.object3D && e.object3D.parent) e.object3D.parent.remove(e.object3D);
      registry.remove(e.id);
    }
  }
}
