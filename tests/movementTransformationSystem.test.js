
import { describe, it, expect, beforeEach } from "vitest";
import { movementTransformationSystem } from "../src/systems/motion/movementTransformationSystem.js";
import { createTransform } from "../src/components/transform.js";
import { createInputMove, createLocomotion } from "../src/components/motion.js";
import { createRegistry } from "../src/engine/registry.js";

function makeWorld(entityId) {
  return {
    input: { keys: {} },
    control: { entityId },
  };
}

function makeEntity(registry) {
  const id = registry.nextId();
  const entity = {
    id,
    components: {
      Transform: createTransform(0, 0, 0, 0, 0, 0),
      InputMove: createInputMove(),
      Locomotion: createLocomotion(4, 2),
    },
  };
  registry.add(entity);
  return entity;
}

describe("movementTransformationSystem steering", () => {
  let registry;
  let world;
  let ent;
  const dt = 1 / 60;

  beforeEach(() => {
    registry = createRegistry();
    ent = makeEntity(registry);
    world = makeWorld(ent.id);
  });

  it("A / Left should steer right (negative yaw delta); D / Right should steer left (positive yaw delta)", () => {
    const startYaw = registry.getComponent(ent, "Transform").rotation.yaw;

    // Simulate 'A' (turn right)
    registry.getComponent(ent, "InputMove").turn = -1;
    movementTransformationSystem(dt, world, registry);
    const yawAfterA = registry.getComponent(ent, "Transform").rotation.yaw;
    expect(yawAfterA).toBeLessThan(startYaw);

    // Reset yaw
    registry.getComponent(ent, "Transform").rotation.yaw = startYaw;

    // Simulate 'D' (turn left)
    registry.getComponent(ent, "InputMove").turn = 1;
    movementTransformationSystem(dt, world, registry);
    const yawAfterD = registry.getComponent(ent, "Transform").rotation.yaw;
    expect(yawAfterD).toBeGreaterThan(startYaw);
  });
});