import { describe, it, expect } from "vitest";
import { mouseRaycastSystem } from "../src/systems/mouseRaycastSystem.js";

describe("mouseRaycastSystem", () => {
  it("writes world.mouse.worldPoint when mouse present", () => {
    const world = { input: { mouse: { x: 0, y: -0.2 } }, camera: { position: { x:0,y:5,z:-5 } } };
    const registry = { query: () => [] };
    mouseRaycastSystem(0.016, world, registry);
    expect(world.mouse.worldPoint).toBeTruthy();
    expect(world.mouse.worldPoint.y).toBeCloseTo(0, 5);
  });
});
