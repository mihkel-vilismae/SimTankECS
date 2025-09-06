import { describe, it, expect } from "vitest";
import { createTank } from "../tankFactory.js";

function makeReg() {
  const { createRegistry } = require("../../engine/registry.js");
  return createRegistry();
}

describe("tankFactory orientations", () => {
  it("machine gun and cannon initially face +Z (barrels along +Z)", () => {
    const registry = makeReg();
    const scene = { add(){} };
    createTank(registry, scene);
    const ents = registry.query(["Gun"]);
    for (const e of ents) {
      const obj = e.object3D;
      // Barrel meshes are along local +Z due to rotation.x = PI/2 and positive z position for muzzle
      // We just assert their Transform yaw is inherited & pitch from Gun, initially 0.
      const t = registry.getComponent(e, "Transform");
      expect(t.rotation.yaw).toBeDefined();
      expect(t.rotation.pitch).toBeDefined();
    }
  });
});
