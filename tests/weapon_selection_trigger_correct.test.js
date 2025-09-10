
import { describe, it, expect } from "vitest";
import { weaponInputSystem } from "../src/systems/weapons/weaponInputSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("weapon selection is respected", () => {
  it("fires MG then Cannon after changing world.weapons.selectedId", () => {
    const registry = makeReg();

    const mg = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "MachineGun", ammo: 50, cooldownMs: 0 }),
      }
    };
    const cannon = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ type: "Cannon", ammo: 5, cooldownMs: 0 }),
      }
    };
    registry.add(mg); registry.add(cannon);

    const world = {
      weapons: { selectedId: mg.id },
      control: { entityId: mg.id },
      input: { mouse: { down: true }, keys: {} },
    };

    // First tick: MG
    weaponInputSystem(1/60, world, registry);
    expect(registry.getComponent(mg, "Gun").ammo).toBe(49);
    expect(registry.getComponent(cannon, "Gun").ammo).toBe(5);

    // Change selection to Cannon
    world.weapons.selectedId = cannon.id;
    world.control.entityId = cannon.id;
    weaponInputSystem(1/60, world, registry);

    expect(registry.getComponent(cannon, "Gun").ammo).toBe(4);
    expect(registry.getComponent(mg, "Gun").ammo).toBe(49);
  });
});
