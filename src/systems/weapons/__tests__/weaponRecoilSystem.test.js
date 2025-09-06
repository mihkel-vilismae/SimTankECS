import { describe, it, expect } from "vitest";
import { weaponRecoilSystem } from "../../weapons/weaponRecoilSystem.js";
import { createGun } from "../../../components/gun.js";
import { createTransform } from "../../../components/transform.js";

function makeReg() {
  const { createRegistry } = require("../../../engine/registry.js");
  return createRegistry();
}

describe("weaponRecoilSystem (spring)", () => {
  it("recovers toward zero without going negative", () => {
    const registry = makeReg();
    const e = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ recoilRecover: 20, recoilMax: 0.2 })
      }
    };
    e.components.Gun.recoilOffset = 0.2;
    registry.add(e);
    const world = {};
    let t = 0;
    for (let i=0;i<240;i++) { // ~4s at 60fps
      weaponRecoilSystem(1/60, world, registry);
      t += 1/60;
    }
    expect(e.components.Gun.recoilOffset).toBeGreaterThanOrEqual(0);
    expect(e.components.Gun.recoilOffset).toBeLessThan(0.01);
  });

  it("clamps to recoilMax", () => {
    const registry = makeReg();
    const e = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Gun: createGun({ recoilRecover: 8, recoilMax: 0.1 })
      }
    };
    e.components.Gun.recoilOffset = 0.5;
    registry.add(e);
    const world = {};
    weaponRecoilSystem(1/60, world, registry);
    expect(e.components.Gun.recoilOffset).toBeLessThanOrEqual(0.1);
  });
});
