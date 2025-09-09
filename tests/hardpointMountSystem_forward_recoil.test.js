import { describe, it, expect } from "vitest";
import { hardpointMountSystem } from "../src/systems/attachment/hardpointMountSystem.js";
import { createTransform } from "../src/components/transform.js";
import { createHardpoints, createMount } from "../src/components/hardpoints.js";
import { createGun } from "../src/components/gun.js";
import { muzzleForward } from "../src/aim/math.js";

function makeReg() {
  const { createRegistry } = require("../src/engine/registry.js");
  return createRegistry();
}

describe("hardpointMountSystem uses helpers & applies recoil opposite to muzzleForward", () => {
  it("recoil displaces position opposite forward", () => {
    const registry = makeReg();
    const parent = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Hardpoints: createHardpoints([{ id: "slot", localPos: {x:0,y:0,z:0}, localYaw: 0 }])
      }
    };
    const child = {
      id: registry.nextId(),
      components: {
        Transform: createTransform(0,0,0,0,0,0),
        Mount: createMount({ parent: parent.id, slotId: "slot"}),
        Gun: createGun({ pitch: -Math.PI/6 }) // up 30 degrees
      }
    };
    registry.add(parent); registry.add(child);
    // with zero recoil, baseline
    hardpointMountSystem(0, {}, registry);
    const base = { ...child.components.Transform.position };
    // apply recoil
    child.components.Gun.recoilOffset = 0.1;
    hardpointMountSystem(0, {}, registry);
    const after = child.components.Transform.position;
    const fwd = muzzleForward(0, child.components.Gun.pitch);
    // displacement vector
    const dx = after.x - base.x;
    const dy = after.y - base.y;
    const dz = after.z - base.z;
    // dot with forward should be negative (moved backward)
    const dot = dx*fwd.x + dy*fwd.y + dz*fwd.z;
    expect(dot).toBeLessThan(0);
  });
});
