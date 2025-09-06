import { describe, it, expect } from "vitest";
import { weaponRecoilSystem } from "../../weapons/weaponRecoilSystem.js";
import { createGun } from "../../../components/gun.js";
import { createTransform } from "../../../components/transform.js";

function makeReg() {
  const { createRegistry } = require("../../../engine/registry.js");
  return createRegistry();
}

describe("weaponRecoil velocity decay", () => {
  it("reduces recoil velocity magnitude over time", () => {
    const registry = makeReg();
    const e = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Gun: createGun({ recoilRecover: 12 }) } };
    e.components.Gun.recoilOffset = 0.1;
    e.components.Gun._recoilVel = -5;
    registry.add(e);
    const world = {};
    weaponRecoilSystem(1/60, world, registry);
    expect(Math.abs(e.components.Gun._recoilVel)).toBeLessThan(5);
  });
});
