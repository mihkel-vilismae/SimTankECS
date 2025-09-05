import { describe, it, expect } from "vitest";
import { flyInputSystem } from "../src/systems/flyInputSystem.js";

describe("flyInputSystem", () => {
  it("maps Q/E and Shift to Flight", () => {
    const world = { input: { keys: { KeyQ: true, ShiftLeft: true } } };
    const ent = { components: { Flight: { vertical: 0, boost: 1 } } };
    const registry = { query: () => [ent] };
    flyInputSystem(0.016, world, registry);
    expect(ent.components.Flight.vertical).toBe(1);
    expect(ent.components.Flight.boost).toBeGreaterThan(1);
  });
});
