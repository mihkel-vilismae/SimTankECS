import { describe, it, expect, vi } from "vitest";

describe("Chase timeout (>5s flight)", () => {
  it("returns to baseline without cinematic if projectile alive >5s", () => {
    const now = 100000;
    global.performance = { now: () => now + 6000 };
    const world = {
      followGunProjectileEnabled: true,
      cameraMode: "follow_gun",
      cameraBaselineMode: "follow_gun",
      camera: { position:{x:0,y:0,z:0}, lookAt(){} }
    };
    const registry = {
      _e: { id: 7, components: { Projectile: { createdAt: now }, Transform: { position:{x:0,y:0,z:0}, rotation:{yaw:0,pitch:0} } } },
      query(){ return [this._e]; },
      getById(id){ return this._e; },
      getComponent(e, n){ return e.components[n]; }
    };
    const { cameraFollowGunProjectileSystem } = require("../src/systems/camera/cameraFollowGunProjectileSystem.js");
    // First tick: start chasing
    cameraFollowGunProjectileSystem(0.016, world, registry);
    expect(world.cameraMode).toBe("follow_gun_projectile");
    // Simulate time >5s with projectile still present
    world.followProjectileStartTime = performance.now() - 6001;
    cameraFollowGunProjectileSystem(0.016, world, registry);
    expect(world.cameraMode).toBe("follow_gun"); // back to baseline
    expect(world.followProjectileTargetId).toBe(null);
  });
});
