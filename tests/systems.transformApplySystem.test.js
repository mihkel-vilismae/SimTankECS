import { describe, it, expect } from "vitest";
import { transformApplySystem } from "../src/systems/motion/transformApplySystem.js";

describe("transformApplySystem", () => {
  it("mirrors Transform to object3D", () => {
    const ent = { components: {
      Transform: { position: {x:1,y:2,z:3}, rotation: {yaw:0.5,pitch:0.1,roll:0.2} }
    }, object3D: { position: { set(x,y,z){ this.x=x; this.y=y; this.z=z; }}, rotation: {x:0,y:0,z:0} } };
    const registry = { query: () => [ent] };
    transformApplySystem(0.016, {}, registry);
    expect(ent.object3D.position.x).toBe(1);
    expect(ent.object3D.rotation.y).toBeCloseTo(0.5, 5);
  });
});
