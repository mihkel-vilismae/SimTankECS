import { describe, it, expect } from "vitest";
import { weaponRecoilSystem } from "../src/systems/weapons/weaponRecoilSystem.js";
import { createGun } from "../src/components/gun.js";
import { createTransform } from "../src/components/transform.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("weaponRecoil clamp on integrate", () => {
  it("never exceeds recoilMax during integration", () => {
    const registry = makeReg();
    const e = { id: registry.nextId(), components: { Transform: createTransform(0,0,0,0,0,0), Gun: createGun({ recoilMax: 0.05, recoilRecover: 20 }) } };
    registry.getComponent(e, "Gun").recoilOffset = 0.2;
    registry.add(e);
    const world = {};
    for (let i=0;i<5;i++) weaponRecoilSystem(1/120, world, registry);
    expect(registry.getComponent(e, "Gun").recoilOffset).toBeLessThanOrEqual(0.05);
  });
});