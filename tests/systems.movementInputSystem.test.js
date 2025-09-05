import { describe, it, expect } from "vitest";
import { movementInputSystem } from "../src/systems/movementInputSystem.js";

describe("movementInputSystem", () => {
  it("maps keys to InputMove", () => {
    const world = { input: { keys: { KeyW: true, KeyA: true } } };
    const ent = { components: { InputMove: { forward: 0, turn: 0 } } };
    const registry = { query: () => [ent] };
    movementInputSystem(0.016, world, registry);
    expect(ent.components.InputMove.forward).toBe(1);
    expect(ent.components.InputMove.turn).toBe(-1);
  });
});
