import { describe, it, expect } from "vitest";
import { flyInputSystem } from "../src/systems/flyInputSystem.js";

describe("flyInputSystem", () => {
  it("maps Q/E and Shift to Flight of controlled only", () => {
    const world = { input: { keys: { KeyQ: true, ShiftLeft: true } }, control: { entityId: 1 } };
    const ent = { id: 1, components: { Flight: { vertical: 0, boost: 1 } } };
    const other = { id: 2, components: { Flight: { vertical: 5, boost: 5 } } };
    const registry = { query: () => [ent, other], getById:(id)=> id===1?ent:other };
    flyInputSystem(0.016, world, registry);
    expect(ent.components.Flight.vertical).toBe(1);
    expect(ent.components.Flight.boost).toBeGreaterThan(1);
    expect(other.components.Flight.vertical).toBe(0);
  });
});
