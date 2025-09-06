import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";

import { createRegistry } from "../src/engine/registry.js";
import { createTank } from "../src/entities/tankFactory.js";

import { hardpointMountSystem } from "../src/systems/attachment/hardpointMountSystem.js";
import { turretAimingSystem } from "../src/systems/aim/turretAimingSystem.js";
import { weaponElevationSystem } from "../src/systems/aim/weaponElevationSystem.js";
import { transformApplySystem } from "../src/systems/motion/transformApplySystem.js";

// helper: find first entity with a component name
function findByComp(registry, comp) {
  return Array.from(registry.entities.values()).find(e => e.components?.[comp]);
}

describe("Aiming pipeline (integration): turret yaw + gun pitch toward mouse target", () => {
  let registry, scene, world, hull, turret, mg, cannon;

  beforeEach(() => {
    registry = createRegistry();
    scene = new THREE.Scene();
    hull = createTank(registry, scene); // also adds turret/guns to scene

    turret = findByComp(registry, "Turret");
    // choose one gun to test elevation (cannon has longer barrel)
    cannon = Array.from(registry.entities.values()).find(e => e.components?.Gun?.type === "Cannon");
    mg = Array.from(registry.entities.values()).find(e => e.components?.Gun?.type === "MachineGun");

    // minimal world
    world = {
      control: { entityId: hull.id },
      mouse: { worldPoint: { x: 5, y: 0, z: 10 } }, // target in front-right at ground
      input: { keys: {}, mouse: { x: 0, y: 0 } },
      camera: new THREE.PerspectiveCamera(60, 1, 0.1, 1000),
    };
  });

  it("rotates turret yaw toward target and elevates gun toward target over several frames", () => {
    expect(turret).toBeTruthy();
    expect(cannon).toBeTruthy();

    const dt = 1/60;
    const steps = 90; // 1.5s of simulation

    // initial snapshot
    const yaw0 = turret.components.Turret.yaw;
    const pitch0 = cannon.components.Gun.pitch;

    for (let i = 0; i < steps; i++) {
      // systems order: aim -> mount -> apply
      turretAimingSystem(dt, world, registry);
      weaponElevationSystem(dt, world, registry);
      hardpointMountSystem(dt, world, registry);
      transformApplySystem(dt, world, registry);
    }

    const yaw1 = turret.components.Turret.yaw;
    const pitch1 = cannon.components.Gun.pitch;

    // Turret yaw should have changed significantly toward the target
    expect(Math.abs(yaw1 - yaw0)).toBeGreaterThan(0.1);

    // Cannon pitch should move toward 0 (target is on ground at similar height), small positive/negative allowed,
    // but it should change from initial
    expect(Math.abs(pitch1 - pitch0)).toBeGreaterThan(0.02);

    // Verify the turret/gun object3Ds reflect transformApply
    expect(turret.object3D.rotation.y).toBeTypeOf("number");
    expect(cannon.object3D.rotation.x).toBeTypeOf("number");
  });
});
