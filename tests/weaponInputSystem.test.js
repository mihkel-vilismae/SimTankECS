import { describe, it, expect } from "vitest";
import { weaponInputSystem } from "../src/systems/weapons/weaponInputSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("weaponInputSystem", () => {
  it("applies a recoil velocity impulse on fire", () => {
    const registry = makeReg();
    const gunEnt = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "MachineGun", recoilKick: 0.02, recoilImpulseScale: 60, recoilMax: 0.15, fireRate: 1000 }),
      }
    };
    registry.add(gunEnt);
    const world = { control: { entityId: gunEnt.id }, input: { mouse: { down: true }, keys:{} } };
    // call once, should fire and set _recoilVel negative
    weaponInputSystem(1/60, world, registry);
    expect(registry.getComponent(gunEnt, "Gun")._recoilVel).toBeLessThan(0);
    expect(registry.getComponent(gunEnt, "Gun").recoilOffset).toBeGreaterThanOrEqual(0);
    expect(registry.getComponent(gunEnt, "Gun").recoilOffset).toBeLessThanOrEqual(registry.getComponent(gunEnt, "Gun").recoilMax);
  });

  it("clamps recoilOffset within recoilMax immediately", () => {
    const registry = makeReg();
    const gunEnt = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "MachineGun", recoilKick: 1.0, recoilImpulseScale: 1000, recoilMax: 0.05, fireRate: 1000 }),
      }
    };
    registry.add(gunEnt);
    const world = { control: { entityId: gunEnt.id }, input: { mouse: { down: true }, keys:{} } };
    weaponInputSystem(1/60, world, registry);
    expect(registry.getComponent(gunEnt, "Gun").recoilOffset).toBeLessThanOrEqual(0.05);
  });
});