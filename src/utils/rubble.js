import * as THREE from "three";

export function spawnRubble(scene, pos, opts = {}) {
  const count = opts.count ?? 12;
  const sizeMin = opts.sizeMin ?? 0.15;
  const sizeMax = opts.sizeMax ?? 0.45;
  const life = opts.life ?? 5.0;
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x6e6a63, roughness: 0.95, metalness: 0.0 });
  for (let i=0; i<count; i++) {
    const s = sizeMin + Math.random()*(sizeMax - sizeMin);
    const g = new THREE.BoxGeometry(s, s, s);
    const m = new THREE.Mesh(g, mat);
    m.position.set((Math.random()-0.5)*1.6, Math.random()*0.6 + 0.05, (Math.random()-0.5)*1.6);
    group.add(m);
  }
  group.position.set(pos.x, Math.max(0.02, pos.y), pos.z);
  scene.add(group);
  return { group, life, t: 0 };
}
