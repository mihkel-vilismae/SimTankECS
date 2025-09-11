// tests/groundSnap.test.js
import { describe, it, expect } from 'vitest';
import { groundSnapToTerrain, validateBuildingPlacement } from '../src/systems/world/placement/groundSnap.js';

describe('Ground helpers', () => {
  it('snaps y to terrain height', () => {
    const world = { terrain: { getHeightAt: () => 12.5 } };
    const pos = { x: 1, y: 999, z: 2 };
    const out = groundSnapToTerrain(world, pos);
    expect(out.y).toBe(12.5);
    expect(pos.y).toBe(999);
  });

  it('valid when within small air gap', () => {
    const world = { terrain: { getHeightAt: () => 10 } };
    expect(validateBuildingPlacement(world, { x: 0, y: 10.03, z: 0 })).toBe(true);
  });

  it('invalid when floating too high', () => {
    const world = { terrain: { getHeightAt: () => 10 } };
    expect(validateBuildingPlacement(world, { x: 0, y: 10.2, z: 0 })).toBe(false);
  });

  it('invalid when no terrain API', () => {
    expect(validateBuildingPlacement({}, { x: 0, y: 0, z: 0 })).toBe(false);
  });
});
