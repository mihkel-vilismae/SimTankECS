import { describe, it, expect } from "vitest";
import { lookAtMouseSystem } from "../src/systems/lookAtMouseSystem.js";

describe("lookAtMouseSystem", () => {
  it("lerps yaw toward mouse point", () => {
    const ent = { components: {
      Transform: { position:{x:0,y:0,z:0}, rotation:{yaw:0,pitch:0,roll:0} },
      MouseFollower: { yawLerp: 0.5 }
    }};
    const registry = { query: () => [ent] };
    const world = { mouse: { worldPoint: { x: 10, y:0, z: 0 } } };
    const yaw0 = ent.components.Transform.rotation.yaw;
    lookAtMouseSystem(1.0, world, registry);
    expect(ent.components.Transform.rotation.yaw).not.toBe(yaw0);
  });
});
