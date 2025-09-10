import { describe, it, expect } from 'vitest';
import { projectileFlightSystem } from '../src/systems/projectiles/projectileFlightSystem.js';

function makeRegistry(){
  let next=1; const ents=new Map();
  return {
    nextId: () => next++,
    add: e => ents.set(e.id,e),
    remove: id => ents.delete(id),
    query: names => {
      const a=[];
      for (const e of ents.values()) {
        let ok=true;
        for (const n of names) if (!e.components[n]) ok=false;
        if (ok) a.push(e);
      }
      return a;
    }
  };
}

describe('Tracer orientation follows direction', () => {
  it('rotates yaw/pitch to match Direction', () => {
    const reg = makeRegistry();
    const e = { id: reg.nextId(), components: {
      Transform: { position:{x:0,y:0,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Direction: { x:0, y:1, z:1 },
      Projectile: { kind:'bullet', speed: 300 },
      Tracer: { length: 4, width: 0.03, color: 0xffffff },
    } };
    reg.add(e);
    const world = {};
    projectileFlightSystem(1.0, world, reg);
    // Expect yaw roughly 0 (x=0), pitch 45deg (y=z)
    expect(Math.abs(e.components.Transform.rotation.yaw - 0)).toBeLessThan(1e-3);
    expect(Math.abs(e.components.Transform.rotation.pitch - Math.PI/4)).toBeLessThan(1e-3);
  });
});
