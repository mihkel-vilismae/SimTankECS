import * as THREE from "three";

export function tracerRenderSystem(dt, world, registry) {
  const ents = registry.query(["Tracer","Direction","Transform"]);
  for (const e of ents) {
    const t = e.components.Transform;
    const d = e.components.Direction;
    const tr = e.components.Tracer;

    if (!e._tracerLine) {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ linewidth: tr.width, color: tr.color, transparent: true, opacity: 0.9 });
      const line = new THREE.Line(geom, mat);
      line.frustumCulled = false;
      e._tracerLine = line;
      if (e.object3D) e.object3D.add(line);
    }
    const positions = e._tracerLine.geometry.attributes.position.array;
    positions[0] = 0; positions[1] = 0; positions[2] = 0; // from entity origin
    positions[3] = -d.x * tr.length;
    positions[4] = -d.y * tr.length;
    positions[5] = -d.z * tr.length;
    e._tracerLine.geometry.attributes.position.needsUpdate = true;
  }
}
