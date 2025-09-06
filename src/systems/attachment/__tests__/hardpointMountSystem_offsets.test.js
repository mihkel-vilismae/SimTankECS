import { describe, it, expect } from "vitest";
import { hardpointMountSystem } from "../hardpointMountSystem.js";
import { createTransform } from "../../../components/transform.js";
import { createHardpoints, createMount } from "../../../components/hardpoints.js";

function makeReg() {
  const { createRegistry } = require("../../../engine/registry.js");
  return createRegistry();
}

describe("hardpointMountSystem offsets", () => {
  it("respects slot localPos and mount offset", () => {
    const registry = makeReg();
    const parent = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(1,2,3,0,Math.PI/4,0),
        Hardpoints: createHardpoints([{ id: "slot", localPos: {x:1,y:2,z:3}, localYaw:0 }])
      }
    };
    const child = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Mount: createMount({ parent: parent.id, slotId: "slot", offset: { pos: {x:0.1,y:0.2,z:0.3} } }),
      }
    };
    registry.add(parent); registry.add(child);
    hardpointMountSystem(1/60, {}, registry);
    // Just ensure it's not at origin and Y includes local + offset
    expect(registry.getComponent(child, "Transform").position.y).toBeCloseTo(2 + 2 + 0.2, 3);
  });
});