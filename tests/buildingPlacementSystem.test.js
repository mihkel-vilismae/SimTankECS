// tests/buildingPlacementSystem.test.js
import { describe, it, expect } from 'vitest';
import { buildingPlacementSystem } from '../src/systems/world/buildingPlacementSystem.js';

class MockRegistry {
  constructor(){ this.spawns = []; }
  spawn(type, data){ this.spawns.push({ type, data }); }
}

describe('buildingPlacementSystem — ground + grid', () => {
  it('quantizes, snaps to ground, and spawns when valid & confirmed', () => {
    const world = {
      placement: { desiredPos: { x: 2.4, y: 99, z: 2.6 } },
      terrain: { getHeightAt: () => 12 },
      grid: { originX: 0, originZ: 0, cellSize: 2, width: 5, height: 5 }
    };
    const input = { confirmPlace: true };
    const reg = new MockRegistry();

    buildingPlacementSystem(world, input, reg);

    expect(reg.spawns.length).toBe(1);
    const pos = reg.spawns[0].data.position;
    expect(pos.x).toBe(2);
    expect(pos.z).toBe(2);
    expect(pos.y).toBe(12);
    expect(world.ui.buildingPlacementValid).toBe(true);
  });

  it('prevents spawn when outside grid', () => {
    const world = {
      placement: { desiredPos: { x: 999, y: 0, z: 999 } },
      terrain: { getHeightAt: () => 0 },
      grid: { originX: 0, originZ: 0, cellSize: 1, width: 3, height: 3 }
    };
    const input = { confirmPlace: true };
    const reg = new MockRegistry();

    buildingPlacementSystem(world, input, reg);

    expect(reg.spawns.length).toBe(0);
    expect(world.ui.buildingPlacementValid).toBe(false);
  });

  it('no spawn when confirm not pressed even if valid', () => {
    const world = {
      placement: { desiredPos: { x: 0.2, y: 5, z: 0.2 } },
      terrain: { getHeightAt: () => 5 },
      grid: { originX: 0, originZ: 0, cellSize: 1, width: 3, height: 3 }
    };
    const input = { confirmPlace: false };
    const reg = new MockRegistry();

    buildingPlacementSystem(world, input, reg);

    expect(reg.spawns.length).toBe(0);
    expect(world.ui.buildingPlacementValid).toBe(true);
  });
});
