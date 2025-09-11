import { describe, it, expect, vi } from 'vitest';

// Minimal Three.js scene stub with required API
class Group { constructor(){ this.children=[]; this.name=''; } add(o){ this.children.push(o); } }
class Scene extends Group {}
// Shallow mock for three imports used by the module
vi.mock('three', () => ({
  AdditiveBlending: 1,
  Color: class { constructor(c){ this.c=c; } copy(){ return this; } lerp(){ return this; } set(){ return this; } },
  Group,
  NearestFilter: 0,
  Sprite: class { constructor(mat){ this.material=mat; this.position={x:0,y:0,z:0, addScaledVector(){}, set(){}}; this.rotation={z:0}; this.scale={set(){}, setScalar(){}, multiplyScalar(){}}; this.visible=true; } },
  SpriteMaterial: class { constructor(opts){ Object.assign(this, opts); this.opacity=1; this.color={ copy(){return this;}, set(){return this;}, lerp(){return this;}}; } },
  Texture: class { constructor(){ this.needsUpdate=false; } },
  Vector3: class { constructor(x=0,y=0,z=0){ this.x=x; this.y=y; this.z=z; } addScaledVector(){ return this; } normalize(){ return this; } multiplyScalar(){ return this; } },
}));

import ProjectileVFXSystem from '../../../src/systems/vfx/ProjectileVFXSystem.js';

describe('ProjectileVFXSystem', () => {
  it('initializes queue and API on world and consumes events', () => {
    const scene = new Scene();
    const system = ProjectileVFXSystem(scene);
    const world = {};
    const registry = {};

    // before tick: queue created on first run
    system(0.016, world, registry);
    expect(Array.isArray(world.vfxQueue)).toBe(true);
    expect(world.vfx).toBeTruthy();
    const len0 = world.vfxQueue.length;

    // push events
    world.vfx.explosion({x:0,y:0,z:0}, {x:0,y:1,z:0}, 1, '#ffcc66');
    world.vfx.tracer({x:0,y:0,z:0}, {x:0,y:0,z:1}, '#ff5533');

    // queue must have items now
    expect(world.vfxQueue.length).toBeGreaterThan(len0);

    // consume
    system(0.016, world, registry);
    expect(world.vfxQueue.length).toBe(0);
  });
});
