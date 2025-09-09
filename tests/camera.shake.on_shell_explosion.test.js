import { describe, it, expect } from 'vitest';
import { lifespanSystem } from '../src/systems/projectiles/lifespanSystem.js';

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
    }
  };
}

describe('Camera shake on shell explosion', () => {
  it('sets world.cameraShake when shell expires', () => {
    const reg = makeReg();
    const world = { vfxQueue: [] };
    const e = { id: reg.nextId(), components: {
      Transform: { position:{x:0,y:0.5,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Direction: { x:0, y:0, z:1 },
      Projectile: { kind:'shell', speed: 120 },
      Lifespan: { ms: 0, bornAt: 0 }
    } };
    reg.add(e);
    lifespanSystem(0.016, world, reg);
    expect(world.cameraShake && world.cameraShake.time).toBeGreaterThan(0);
  });
});
