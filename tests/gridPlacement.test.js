// tests/gridPlacement.test.js
import { describe, it, expect } from 'vitest';
import { quantizeToGrid, validateInsideGrid } from '../src/systems/world/placement/groundSnap.js';

describe('Grid helpers', () => {
  it('quantizes to grid centers using properties', () => {
    const world = { grid: { originX: 0, originZ: 0, cellSize: 2, width: 5, height: 3 } };
    const p = quantizeToGrid(world, { x: 2.4, y: 0, z: 2.6 });
    expect(p.x).toBe(2);
    expect(p.z).toBe(2);
  });

  it('validates inside rectangular grid bounds', () => {
    const world = { grid: { originX: 0, originZ: 0, cellSize: 1, width: 3, height: 2 } };
    expect(validateInsideGrid(world, { x: 0, y: 0, z: 0 })).toBe(true);
    expect(validateInsideGrid(world, { x: 2, y: 0, z: 1 })).toBe(true);
    expect(validateInsideGrid(world, { x: -1, y: 0, z: 0 })).toBe(false);
    expect(validateInsideGrid(world, { x: 3, y: 0, z: 1 })).toBe(false);
  });

  it('uses custom isInside when provided', () => {
    const world = { grid: { isInside: (x, z) => x >= 0 && x <= 10 && z >= 0 && z <= 5 } };
    expect(validateInsideGrid(world, { x: 10, y: 0, z: 5 })).toBe(true);
    expect(validateInsideGrid(world, { x: 11, y: 0, z: 5 })).toBe(false);
  });

  it('returns false if width/height missing and no isInside', () => {
    const world = { grid: { originX: 0, originZ: 0, cellSize: 1 } };
    expect(validateInsideGrid(world, { x: 0, y: 0, z: 0 })).toBe(false);
  });
});
