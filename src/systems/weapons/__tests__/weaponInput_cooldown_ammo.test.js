import { describe, it, expect } from "vitest";
import { weaponInputSystem } from "../../weapons/weaponInputSystem.js";
import { createGun } from "../../../components/gun.js";
import { createTransform } from "../../../components/transform.js";

function makeReg() {
  const { createRegistry } = require("../../../engine/registry.js");
  return createRegistry();
}

describe("weaponInputSystem ammo/cooldown", () => {
  it("reduces ammo and sets cooldown", () => {
    const registry = makeReg();
    const e = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Gun: createGun({ fireRate: 10, ammo: 5 }) } };
    registry.add(e);
    const world = { control: { entityId: e.id }, input: { mouse: { down: true }, keys:{} } };
    weaponInputSystem(0, world, registry);
    expect(registry.getComponent(e, "Gun").ammo).toBe(4);
    expect(registry.getComponent(e, "Gun").cooldown).toBeGreaterThan(0);
  });
});