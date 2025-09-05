import { describe, it, expect } from "vitest";
import { movementTransformationSystem } from "../src/systems/movementTransformationSystem.js";

describe("movementTransformationSystem", () => {
  it("applies forward motion and turning", () => {
    const ent = { components: {
      Transform: { position: {x:0,y:0,z:0}, rotation: {yaw:0,pitch:0,roll:0} },
      InputMove: { forward: 1, turn: 1 },
      Locomotion: { speed: 10, turnRate: 1 }
    }};
    const registry = { query: () => [ent] };
    movementTransformationSystem(1.0, {}, registry);
    expect(ent.components.Transform.rotation.yaw).toBeGreaterThan(0);
    expect(ent.components.Transform.position.z).toBeGreaterThan(0);
  });
});
