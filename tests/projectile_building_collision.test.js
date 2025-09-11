// tests/projectile_building_collision.test.js
import { describe, it, expect } from 'vitest';
import projectileCollisionSystem from '../src/systems/physics/projectileCollisionSystem.js';

class MockRegistry {
  constructor(){
    this._ents = [];
    this.components = new Map();
    this.events = [];
  }
  add(id){ this._ents.push({ id }); }
  setComponent(id, name, data){ this.components.set(`${id}:${name}`, data); }
  getComponent(id, name){ return this.components.get(`${id}:${name}`); }
  query(){ return this._ents; }
}

describe('projectileCollisionSystem — bullets/shells vs buildings', () => {
  it('emits HitEvent when a sphere projectile overlaps a building AABB', () => {
    const R = new MockRegistry();

    R.add('b1');
    R.setComponent('b1','Transform',{ position:{x:0,y:0,z:0} });
    R.setComponent('b1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('b1','Building',{});

    R.add('p1');
    R.setComponent('p1','Transform',{ position:{x:1.2,y:0,z:0} });
    R.setComponent('p1','Collider',{ type:'sphere', radius:0.5 });
    R.setComponent('p1','Projectile',{ kind:'bullet' });

    projectileCollisionSystem({}, R);
    const hits = R.events.filter(e => e.type==='HitEvent');
    expect(hits.length).toBe(1);
    expect(hits[0].projectileId).toBe('p1');
    expect(hits[0].targetId).toBe('b1');
    expect(hits[0].projectileKind).toBe('bullet');
  });

  it('no event when projectile misses', () => {
    const R = new MockRegistry();
    R.add('b1');
    R.setComponent('b1','Transform',{ position:{x:0,y:0,z:0} });
    R.setComponent('b1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('b1','Building',{});

    R.add('p1');
    R.setComponent('p1','Transform',{ position:{x:5,y:0,z:0} });
    R.setComponent('p1','Collider',{ type:'sphere', radius:0.4 });
    R.setComponent('p1','Projectile',{ kind:'shell' });

    projectileCollisionSystem({}, R);
    const hits = R.events.filter(e => e.type==='HitEvent');
    expect(hits.length).toBe(0);
  });
});
