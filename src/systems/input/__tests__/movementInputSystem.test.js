
import { describe, it, expect, beforeEach } from "vitest";
import { movementInputSystem } from "../movementInputSystem.js";
import { createRegistry } from "../../../engine/registry.js";
import { createInputMove } from "../../../components/motion.js";

function makeWorld() {
  return {
    input: { keys: {} },
    control: { entityId: 1 },
  };
}

describe("movementInputSystem turn mapping", () => {
  let world, registry, ent;

  beforeEach(() => {
    world = makeWorld();
    registry = createRegistry();
    ent = { id: 1, components: { InputMove: createInputMove() } };
    registry.add(ent);
  });

  it("A / Left should set InputMove.turn positive (right turn intent)", () => {
    world.input.keys = { KeyA: true };
    movementInputSystem(1/60, world, registry);
    expect(ent.components.InputMove.turn).toBeGreaterThan(0);

    world.input.keys = { ArrowLeft: true };
    movementInputSystem(1/60, world, registry);
    expect(ent.components.InputMove.turn).toBeGreaterThan(0);
  });

  it("D / Right should set InputMove.turn negative (left turn intent)", () => {
    world.input.keys = { KeyD: true };
    movementInputSystem(1/60, world, registry);
    expect(ent.components.InputMove.turn).toBeLessThan(0);

    world.input.keys = { ArrowRight: true };
    movementInputSystem(1/60, world, registry);
    expect(ent.components.InputMove.turn).toBeLessThan(0);
  });
});
