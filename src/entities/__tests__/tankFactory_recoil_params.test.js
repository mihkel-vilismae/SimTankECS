import { describe, it, expect } from "vitest";
import { createTank } from "../tankFactory.js";

function makeReg() {
  const { createRegistry } = require("../../engine/registry.js");
  return createRegistry();
}

describe("tankFactory gun parameters", () => {
  it("MG and Cannon have different recoil tuning", () => {
    const registry = makeReg();
    const scene = { add(){} };
    const hull = createTank(registry, scene);
    const ents = registry.query(["Gun"]);
    const mg = ents.find(e => e.components.Gun.type === "MachineGun");
    const cn = ents.find(e => e.components.Gun.type === "Cannon");
    expect(mg).toBeTruthy();
    expect(cn).toBeTruthy();
    const gmg = mg.components.Gun;
    const gcn = cn.components.Gun;
    expect(gmg.recoilMax).not.toEqual(gcn.recoilMax);
    expect(gmg.recoilRecover).not.toEqual(gcn.recoilRecover);
    expect(gmg.recoilImpulseScale).not.toEqual(gcn.recoilImpulseScale);
  });
});
