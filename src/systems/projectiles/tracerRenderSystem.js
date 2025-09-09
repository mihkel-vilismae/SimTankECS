import * as THREE from "three";

export function tracerRenderSystem(dt, world, registry) {
  const ents = registry.query(["Tracer","Transform"]);
  for (const e of ents) {
    const t = e.components.Transform;
    const tr = e.components.Tracer;

    // Create a single line in LOCAL space, pointing along -Z.
    // Since the projectile entity is oriented by projectileFlightSystem,
    // this line always aligns to path.
    if (!e._tracerLine) {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ linewidth: tr.width, color: tr.color, transparent: true, opacity: 0.95 });
      const line = new THREE.Line(geom, mat);
      line.frustumCulled = false;
      e._tracerLine = line;
      if (e.object3D) e.object3D.add(line);
    }

    // Update local vertices: from origin to tail along local -Z
    const positions = e._tracerLine.geometry.attributes.position.array;
    positions[0] = 0; positions[1] = 0; positions[2] = 0;
    positions[3] = 0; positions[4] = 0; positions[5] = -tr.length;
    e._tracerLine.geometry.attributes.position.needsUpdate = true;
  }
}
