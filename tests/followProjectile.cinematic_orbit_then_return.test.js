import { describe, it, expect } from "vitest";

describe("Cinematic orbit then return", () => {
  it("sets banner and baseline on death, and cinematic system returns to baseline", () => {
    const world = {
      cameraMode: "follow_gun_projectile",
      cameraBaselineMode: "follow_gun",
      prevCameraModeBeforeProjectile: "follow_gun",
      camera: { position: {x:0,y:0,z:0}, lookAt(){} }
    };
    // Simulate lifespan death hook
    world.cinematicBanner = { active:true, text:"CINEMATIC MODE ON" };
    world.cameraReturnBaseline = "follow_gun";
    world.cinematicExplosion = { active:true, phase:"return", t: 2.0, returnDur: 1.0, returnTarget: { pos:{x:0,y:1,z:2}, look:{x:0,y:0,z:0} } };
    const { cameraExplosionCinematicSystem } = require("../src/systems/camera/cameraExplosionCinematicSystem.js");
    const registry = { query(){return [];}, getComponent(){return null;} };
    cameraExplosionCinematicSystem(0.5, world, registry);
    cameraExplosionCinematicSystem(0.6, world, registry);
    expect(world.cameraMode).toBe("follow_gun");
    expect(world.cinematicBanner).toBe(null);
  });
});
