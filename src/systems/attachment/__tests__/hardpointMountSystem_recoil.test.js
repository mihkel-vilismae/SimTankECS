import { describe, it, expect } from "vitest";
import { hardpointMountSystem } from "../hardpointMountSystem.js";
import { createTransform } from "../../../components/transform.js";
import { createHardpoints, createMount } from "../../../components/hardpoints.js";
import { createGun } from "../../../components/gun.js";

function makeReg() {
  const { createRegistry } = require("../../../engine/registry.js");
  return createRegistry();
}

describe("hardpointMountSystem recoil vector", () => {
  it("applies recoil along -Z when yaw=0, pitch=0 (moves only in -Z)", () => {
    const registry = makeReg();
    const parent = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Hardpoints: createHardpoints([{ id: "slot", localPos: {x:0,y:0,z:0}, localYaw:0 }])
      }
    };
    const child = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Mount: createMount({ parent: parent.id, slotId: "slot"}),
        Gun: createGun({})
      }
    };
    child.components.Gun.recoilOffset = 0.1;
    registry.add(parent); registry.add(child);
    hardpointMountSystem(1/60, {}, registry);
    expect(child.components.Transform.position.z).toBeLessThan(0); // moved back along -Z
    expect(child.components.Transform.position.x).toBeCloseTo(0, 6);
  });

  it("with pitch 30deg moves back and slightly down", () => {
    const registry = makeReg();
    const parent = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Hardpoints: createHardpoints([{ id: "slot", localPos: {x:0,y:0,z:0}, localYaw:0 }])
      }
    };
    const child = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Mount: createMount({ parent: parent.id, slotId: "slot"}),
        Gun: createGun({ pitch: Math.PI/6 })
      }
    };
    child.components.Gun.recoilOffset = 0.1;
    registry.add(parent); registry.add(child);
    hardpointMountSystem(1/60, {}, registry);
    expect(child.components.Transform.position.z).toBeLessThan(0);
    expect(child.components.Transform.position.y).toBeLessThan(0);
  });
});
