import { describe, it, expect } from 'vitest';
import { projectileFlightSystem } from '../src/systems/projectiles/projectileFlightSystem.js';

function makeReg(){
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
    },
    entities: ents
  };
}

describe('Shell gravity & trail', () => {
  it('shell drops in Y and enqueues trail puffs', () => {
    const reg = makeReg();
    const world = { vfxQueue: [] };
    const e = { id: reg.nextId(), components: {
      Transform: { position:{x:0,y:1,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Projectile: { kind:'shell', speed: 120 },
      Direction: { x:0, y:0, z:1 },
    } };
    reg.add(e);
    // simulate ~0.5s
    for (let i=0;i<30;i++) projectileFlightSystem(1/60, world, reg);
    expect(e.components.Transform.position.y).toBeLessThan(1); // dropped
    const trailPuffs = world.vfxQueue.filter(ev => ev.preset === 'SHELL_TRAIL_PUFF').length;
    expect(trailPuffs).toBeGreaterThan(0);
  });
});
