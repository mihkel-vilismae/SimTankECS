import { describe, it, expect } from "vitest";
import { createTank } from "../../entities/tankFactory.js";
import { hardpointMountSystem } from "../../systems/attachment/hardpointMountSystem.js";
import { weaponInputSystem } from "../../systems/weapons/weaponInputSystem.js";
import { weaponRecoilSystem } from "../../systems/weapons/weaponRecoilSystem.js";
import { transformApplySystem } from "../../systems/motion/transformApplySystem.js";

function makeReg() {
  const { createRegistry } = require("../../engine/registry.js");
  return createRegistry();
}

function step(dt, world, registry) {
  weaponInputSystem(dt, world, registry);
  weaponRecoilSystem(dt, world, registry);
  hardpointMountSystem(dt, world, registry);
  transformApplySystem(dt, world, registry);
}

describe("Integration: sustained MG burst recoils and returns", () => {
  it("MG recoils backwards and returns near baseline after burst", () => {
    const registry = makeReg();
    const scene = { add(){} };
    const hull = createTank(registry, scene);
    const guns = registry.query(["Gun"]);
    const mg = guns.find(e => registry.getComponent(e, "Gun").type === "MachineGun");
    const world = { control: { entityId: hull.id }, input: { mouse: { down: true }, keys:{} } };

    // Fire for 0.5s then release
    for (let i=0;i<30;i++) step(1/60, world, registry);
    world.input.mouse.down = false;
    const peak = registry.getComponent(mg, "Gun").recoilOffset;
    expect(peak).toBeGreaterThan(0);
    // Let it recover for 2s
    for (let i=0;i<120;i++) step(1/60, world, registry);
    expect(registry.getComponent(mg, "Gun").recoilOffset).toBeLessThan(0.02);
  });
});
