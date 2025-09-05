import { describe, it, expect } from "vitest";
import { flyMovementSystem } from "../src/systems/flyMovementSystem.js";

describe("flyMovementSystem", () => {
  it("applies vertical movement", () => {
    const ent = { components: {
      Transform: { position:{x:0,y:1,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Flight: { vertical: 1, climbRate: 2, boost: 2 }
    }};
    const registry = { query: () => [ent] };
    flyMovementSystem(1.0, {}, registry);
    expect(ent.components.Transform.position.y).toBeCloseTo(1 + 2*2*1.0, 5);
  });
});
