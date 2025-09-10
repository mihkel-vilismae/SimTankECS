import { describe, it, expect } from "vitest";

function fakeRegistryWithProjectile(id, createdAt=1000) {
  return {
    query(keys){ return [{ id, components: { Projectile: { createdAt }, Transform: { position:{x:0,y:0,z:0}, rotation: { yaw:0, pitch:0 } } } }]; },
    getById(i){ return { id: i, components: { Projectile: { createdAt }, Transform: { position:{x:0,y:0,z:0}, rotation:{ yaw:0, pitch:0 } } } }; },
    getComponent(e, name){ return e.components[name]; }
  };
}

describe("Follow Gun / Projectile - fire chases projectile", () => {
  it("switches to follow_gun_projectile and stores target id", () => {
    const registry = fakeRegistryWithProjectile(42);
    const world = { cameraMode:"follow_gun", followGunProjectileEnabled:true, camera:{ position:{x:0,y:0,z:0}, lookAt(){} } };
    const { cameraFollowGunProjectileSystem } = require("../src/systems/camera/cameraFollowGunProjectileSystem.js");
    cameraFollowGunProjectileSystem(0.016, world, registry);
    expect(world.cameraMode).toBe("follow_gun_projectile");
    expect(world.followProjectileTargetId).toBe(42);
  });
});
