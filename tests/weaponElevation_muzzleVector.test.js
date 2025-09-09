import { describe, it, expect } from "vitest";
import { weaponElevationSystem } from "../src/systems/aim/weaponElevationSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";
import { createHardpoints } from "../src/components/hardpoints.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

function addHullWithTurret(registry) {
  const hull = {
    id: registry.nextId(),
    components: {
      Transform: createTransform(0,0,0,0,0,0),
      Hardpoints: createHardpoints([{ id:"hp_turret", localPos:{x:0,y:0,z:0}, localYaw:0 }])
    }
  };
  const turret = {
    id: registry.nextId(),
    components: {
      Transform: createTransform(0,0,0,0,0,0),
      Turret: { yaw: 0, yawSpeed: 10, yawMin: -Math.PI, yawMax: Math.PI },
      Mount: { parent: hull.id, slotId: "hp_turret" },
    }
  };
  registry.add(hull); registry.add(turret);
  return { hull, turret };
}

/** Compute world muzzle forward from yaw/pitch consistent with our hardpoint/VFX usage.
  * Local forward is +Z; yaw rotates around Y, pitch tilts barrel up when pitch < 0.
  * That means vertical component is -sin(pitch).
  */
function muzzleForward(yaw, pitch) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return { x: cp * Math.sin(yaw), y: -sp, z: cp * Math.cos(yaw) };
}

describe("weaponElevationSystem muzzle vector (end-to-end)", () => {
  it("mouse up -> muzzle vector points above horizon (positive Y)", () => {
    const registry = makeReg();
    const { hull, turret } = addHullWithTurret(registry);
    const gun = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ pitch: 0, pitchSpeed: 5, pitchMin: -Math.PI/2, pitchMax: Math.PI/2 }),
        Mount: { parent: turret.id, slotId: "hp_cannon" },
      }
    };
    registry.add(gun);
    const world = { control: { entityId: hull.id }, mouse: { worldPoint: { x: 0, y: 1, z: 5 } } };
    weaponElevationSystem(1/60, world, registry);
    const yaw = 0;
    const pitch = gun.components.Gun.pitch;
    const dir = muzzleForward(yaw, pitch);
    expect(dir.y).toBeGreaterThan(0); // above horizon
  });

  it("mouse down -> muzzle vector points below horizon (negative Y)", () => {
    const registry = makeReg();
    const { hull, turret } = addHullWithTurret(registry);
    const gun = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ pitch: 0, pitchSpeed: 5, pitchMin: -Math.PI/2, pitchMax: Math.PI/2 }),
        Mount: { parent: turret.id, slotId: "hp_cannon" },
      }
    };
    registry.add(gun);
    const world = { control: { entityId: hull.id }, mouse: { worldPoint: { x: 0, y: -1, z: 5 } } };
    weaponElevationSystem(1/60, world, registry);
    const yaw = 0;
    const pitch = gun.components.Gun.pitch;
    const dir = muzzleForward(yaw, pitch);
    expect(dir.y).toBeLessThan(0); // below horizon
  });
});
