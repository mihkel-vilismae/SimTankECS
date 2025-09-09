import { describe, it, expect } from "vitest";
import { weaponElevationSystem } from "../src/systems/aim/weaponElevationSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";
import { createHardpoints, createMount } from "../src/components/hardpoints.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

function addHullWithTurret(registry) {
  // minimal hull + turret structure so Mount.parent resolves
  const hull = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Hardpoints: createHardpoints([{ id:"hp_turret", localPos:{x:0,y:0,z:0}, localYaw:0 }]) } };
  const turret = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Turret: { yaw:0, yawSpeed: 10, yawMin:-Math.PI, yawMax: Math.PI }, Mount: { parent: hull.id, slotId:"hp_turret" } } };
  registry.add(hull); registry.add(turret);
  return {hull, turret};
}

describe("weaponElevationSystem direction", () => {
  it("mouse up (higher Y) results in negative pitch (gun tilts up)", () => {
    const registry = makeReg();
    const { hull, turret } = addHullWithTurret(registry);
    const gun = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Gun: createGun({ pitch:0, pitchSpeed: 2, pitchMin: -Math.PI/2, pitchMax: Math.PI/2 }), Mount: { parent: turret.id, slotId: "hp_cannon" } } };
    registry.add(gun);
    const world = { control: { entityId: hull.id }, mouse: { worldPoint: { x: 0, y: 1, z: 5 } } };
    weaponElevationSystem(1/60, world, registry);
    expect(gun.components.Gun.pitch).toBeLessThan(0); // negative -> up
  });

  it("mouse down (lower Y) results in positive pitch (gun tilts down)", () => {
    const registry = makeReg();
    const { hull, turret } = addHullWithTurret(registry);
    const gun = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Gun: createGun({ pitch:0, pitchSpeed: 2, pitchMin: -Math.PI/2, pitchMax: Math.PI/2 }), Mount: { parent: turret.id, slotId: "hp_cannon" } } };
    registry.add(gun);
    const world = { control: { entityId: hull.id }, mouse: { worldPoint: { x: 0, y: -1, z: 5 } } };
    weaponElevationSystem(1/60, world, registry);
    expect(gun.components.Gun.pitch).toBeGreaterThan(0); // positive -> down
  });
});
