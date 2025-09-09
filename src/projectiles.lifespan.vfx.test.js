import { describe, it, expect, beforeEach } from 'vitest';

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

import { lifespanSystem } from './systems/projectiles/lifespanSystem.js';

describe('Lifespan VFX', () => {
  let world, reg;
  beforeEach(() => {
    world = { time: 0, vfxQueue: [] };
    reg = makeRegistry();
  });

  it('enqueues shell explosion preset', () => {
    const e = { id: reg.nextId(), components: {
      Transform: { position:{x:1,y:2,z:3}, rotation:{yaw:0,pitch:0,roll:0} },
      Direction: { x:0, y:0, z:1 },
      Projectile: { kind:'shell', speed: 120 },
      Lifespan: { ms: 0, bornAt: 0 },
    } };
    reg.add(e);
    lifespanSystem(0.016, world, reg);
    const hasShell = world.vfxQueue.some(ev => ev.preset === 'SHELL_EXPLOSION_LARGE');
    expect(hasShell).toBe(true);
  });

  it('enqueues bullet storm or ballGrow', () => {
    const e = { id: reg.nextId(), components: {
      Transform: { position:{x:0,y:0.5,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Direction: { x:0, y:0, z:1 },
      Projectile: { kind:'bullet', speed: 300 },
      Lifespan: { ms: 0, bornAt: 0 },
    } };
    reg.add(e);
    lifespanSystem(0.016, world, reg);
    const hasBullet = world.vfxQueue.some(ev => ev.preset === 'BULLET_SPARK_STORM' || ev.kind === 'BALL_GROW');
    expect(hasBullet).toBe(true);
  });
});
