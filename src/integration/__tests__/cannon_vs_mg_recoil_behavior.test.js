import { describe, it, expect } from "vitest";
import { createTank } from "../../entities/tankFactory.js";
import { weaponInputSystem } from "../../systems/weapons/weaponInputSystem.js";
import { weaponRecoilSystem } from "../../systems/weapons/weaponRecoilSystem.js";

function makeReg() {
  const { createRegistry } = require("../../engine/registry.js");
  return createRegistry();
}

describe("Integration: cannon vs mg recoil peaks", () => {
  it("cannon peak recoilOffset > mg peak after one shot", () => {
    const registry = makeReg();
    const scene = { add(){} };
    const hull = createTank(registry, scene);
    const guns = registry.query(["Gun"]);
    const mg = guns.find(e => registry.getComponent(e, "Gun").type === "MachineGun");
    const cn = guns.find(e => registry.getComponent(e, "Gun").type === "Cannon");
    const world = { control: { entityId: hull.id }, input: { mouse: { down: false }, keys: { "Space": true } } };

    // Fire cannon once
    weaponInputSystem(1/60, world, registry);
    const cannonPeak = registry.getComponent(cn, "Gun").recoilOffset;

    // Fire MG once
    world.input.keys["Space"] = false;
    world.input.mouse = { down: true };
    weaponInputSystem(1/60, world, registry);
    const mgPeak = registry.getComponent(mg, "Gun").recoilOffset;

    expect(cannonPeak).toBeGreaterThan(mgPeak);
  });
});
