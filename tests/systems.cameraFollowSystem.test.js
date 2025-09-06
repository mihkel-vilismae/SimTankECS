import { describe, it, expect } from "vitest";
import { cameraFollowSystem } from "../src/systems/camera/cameraFollowSystem.js";

describe("cameraFollowSystem", () => {
  it("moves camera toward target", () => {
    const ent = { components: { Transform: { position:{x:0,y:0,z:0}, rotation:{yaw:0,pitch:0,roll:0} } } };
    const registry = { query: () => [ent] };
    const cam = { position: { x:0, y:0, z:0 }, lookAt(){}};
    const world = { camera: cam };
    cameraFollowSystem(1.0, world, registry);
    expect(cam.position.y).toBeGreaterThan(0);
  });
});
