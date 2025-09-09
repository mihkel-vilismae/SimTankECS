import { describe, it, expect } from "vitest";
import { createTank } from "../src/entities/tankFactory.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("tankFactory gun parameters", () => {
  it("MG and Cannon have different recoil tuning", () => {
    const registry = makeReg();
    const scene = { add(){} };
    const hull = createTank(registry, scene);
    const ents = registry.query(["Gun"]);
    const mg = ents.find(e => registry.getComponent(e, "Gun").type === "MachineGun");
    const cn = ents.find(e => registry.getComponent(e, "Gun").type === "Cannon");
    expect(mg).toBeTruthy();
    expect(cn).toBeTruthy();
    const gmg = registry.getComponent(mg, "Gun");
    const gcn = registry.getComponent(cn, "Gun");
    expect(gmg.recoilMax).not.toEqual(gcn.recoilMax);
    expect(gmg.recoilRecover).not.toEqual(gcn.recoilRecover);
    expect(gmg.recoilImpulseScale).not.toEqual(gcn.recoilImpulseScale);
  });
});
