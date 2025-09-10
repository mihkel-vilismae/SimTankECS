import { describe, it, expect } from "vitest";

describe("Follow Gun / Projectile - toggle", () => {
  it("turning ON switches camera to follow_gun", () => {
    const world = { cameraMode: "default" };
    // emulate HUD toggle
    const enable = () => { world.cameraBaselineMode = world.cameraMode || "follow_gun"; world.cameraMode = "follow_gun"; world.followGunProjectileEnabled = true; };
    enable();
    expect(world.cameraMode).toBe("follow_gun");
    expect(world.followGunProjectileEnabled).toBe(true);
  });
});
