
import { describe, it, expect } from "vitest";
import { weaponInputSystem } from "../src/systems/weapons/weaponInputSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("weapon trigger basic (selected weapon)", () => {
  it("fires the selected gun when trigger is held", () => {
    const registry = makeReg();
    const gunEnt = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "MachineGun", ammo: 5, cooldownMs: 0 }),
      }
    };
    registry.add(gunEnt);

    const world = {
      weapons: { selectedId: gunEnt.id },
      control: { entityId: gunEnt.id },
      input: { mouse: { down: true }, keys: {} }
    };

    weaponInputSystem(1/60, world, registry);
    // After firing once, ammo should reduce
    expect(registry.getComponent(gunEnt, "Gun").ammo).toBe(4);
  });

  it("does not fire when trigger is not held", () => {
    const registry = makeReg();
    const gunEnt = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "MachineGun", ammo: 5, cooldownMs: 0 }),
      }
    };
    registry.add(gunEnt);

    const world = {
      weapons: { selectedId: gunEnt.id },
      control: { entityId: gunEnt.id },
      input: { mouse: { down: false }, keys: {} }
    };

    weaponInputSystem(1/60, world, registry);
    expect(registry.getComponent(gunEnt, "Gun").ammo).toBe(5);
  });
});
