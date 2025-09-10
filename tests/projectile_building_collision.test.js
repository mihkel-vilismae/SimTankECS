// tests/projectile_building_collision.test.js
import { describe, it, expect } from 'vitest';
import projectileCollisionSystem from '../src/systems/physics/projectileCollisionSystem.js';

class MockRegistry {
  constructor(){ this._ents=[]; this.components=new Map(); this.events=[]; }
  add(id){ this._ents.push({id}); }
  setComponent(id,name,data){ this.components.set(`${id}:${name}`,data); }
  getComponent(id,name){ return this.components.get(`${id}:${name}`); }
  query(){ return this._ents; }
}

describe('projectileCollisionSystem',()=>{
  it('emits HitEvent on overlap',()=>{
    const R=new MockRegistry();
    R.add('b1');
    R.setComponent('b1','Transform',{position:{x:0,y:0,z:0}});
    R.setComponent('b1','Collider',{type:'aabb',halfExtents:{x:1,y:1,z:1}});
    R.setComponent('b1','Building',{});
    R.add('p1');
    R.setComponent('p1','Transform',{position:{x:1.2,y:0,z:0}});
    R.setComponent('p1','Collider',{type:'sphere',radius:0.5});
    R.setComponent('p1','Projectile',{kind:'bullet'});
    projectileCollisionSystem({},R);
    expect(R.events.find(e=>e.type==='HitEvent')).toBeTruthy();
  });
});
