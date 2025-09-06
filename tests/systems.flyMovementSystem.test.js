
import { describe, it, expect } from "vitest";
import { flyMovementSystem } from "../src/systems/flyMovementSystem.js";

describe("flyMovementSystem", () => {
  it("applies vertical, forward, and lateral movement for controlled flyer", () => {
    const ent = { id: 1, components: {
      Transform: { position:{x:0,y:1,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      Flight: { vertical: 1, climbRate: 2, boost: 2, speed: 10 },
      InputMove: { forward: 1, turn: 1 }
    }};
    const registry = { getById:(id)=> id===1?ent:null };
    const world = { control: { entityId: 1 } };
    flyMovementSystem(1.0, world, registry);
    // yaw=0 => forward along +Z, right along +X
    expect(ent.components.Transform.position.y).toBeCloseTo(1 + 2*2*1.0, 5);
    expect(ent.components.Transform.position.z).toBeGreaterThan(0); // forward
    expect(ent.components.Transform.position.x).toBeGreaterThan(0); // strafe right
  });
});
