// tests/vehicle_building_collision.test.js
import { describe, it, expect } from 'vitest';
import vehicleBuildingCollisionSystem from '../src/systems/physics/vehicleBuildingCollisionSystem.js';

class MockRegistry {
  constructor(){ this._ents=[]; this.components=new Map(); this.events=[]; }
  add(id){ this._ents.push({id}); }
  setComponent(id,name,data){ this.components.set(`${id}:${name}`,data); }
  getComponent(id,name){ return this.components.get(`${id}:${name}`); }
  query(){ return this._ents; }
}

describe('vehicleBuildingCollisionSystem',()=>{
  it('emits CollisionEvent when overlapping',()=>{
    const R=new MockRegistry();
    R.add('b1');
    R.setComponent('b1','Transform',{position:{x:0,y:0,z:0}});
    R.setComponent('b1','Collider',{type:'aabb',halfExtents:{x:1,y:1,z:1}});
    R.setComponent('b1','Building',{});
    R.add('v1');
    R.setComponent('v1','Transform',{position:{x:1.6,y:0,z:0}});
    R.setComponent('v1','Collider',{type:'aabb',halfExtents:{x:1,y:1,z:1}});
    R.setComponent('v1','Vehicle',{});
    vehicleBuildingCollisionSystem({},R);
    expect(R.events.find(e=>e.type==='CollisionEvent')).toBeTruthy();
  });
});
