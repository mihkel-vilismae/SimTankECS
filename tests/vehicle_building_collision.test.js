// tests/vehicle_building_collision.test.js
import { describe, it, expect } from 'vitest';
import vehicleBuildingCollisionSystem from '../src/systems/physics/vehicleBuildingCollisionSystem.js';

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

describe('vehicleBuildingCollisionSystem — AABB vs AABB', () => {
  it('emits CollisionEvent with MTV when vehicle overlaps building', () => {
    const R = new MockRegistry();

    R.add('b1');
    R.setComponent('b1','Transform',{ position:{x:0,y:0,z:0} });
    R.setComponent('b1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('b1','Building',{});

    R.add('v1');
    R.setComponent('v1','Transform',{ position:{x:1.6,y:0,z:0} }); // overlaps slightly along X
    R.setComponent('v1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('v1','Vehicle',{});

    vehicleBuildingCollisionSystem({}, R);

    const cols = R.events.filter(e => e.type==='CollisionEvent');
    expect(cols.length).toBe(1);
    expect(cols[0].a).toBe('v1');
    expect(cols[0].b).toBe('b1');
    // Smallest axis here is X, MTV should point outward for v1 (sign depends on relative centers)
    expect(Math.abs(cols[0].mtv.x) > 0).toBe(true);
  });

  it('no event when not overlapping', () => {
    const R = new MockRegistry();

    R.add('b1');
    R.setComponent('b1','Transform',{ position:{x:0,y:0,z:0} });
    R.setComponent('b1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('b1','Building',{});

    R.add('v1');
    R.setComponent('v1','Transform',{ position:{x:5,y:0,z:0} });
    R.setComponent('v1','Collider',{ type:'aabb', halfExtents:{x:1,y:1,z:1} });
    R.setComponent('v1','Vehicle',{});

    vehicleBuildingCollisionSystem({}, R);
    const cols = R.events.filter(e => e.type==='CollisionEvent');
    expect(cols.length).toBe(0);
  });
});
