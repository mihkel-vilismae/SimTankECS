import { describe, it, expect } from "vitest";
import { createRegistry } from "../src/engine/registry.js";
import { createTank } from "../src/entities/tankFactory.js";

describe("entities/tankFactory", () => {
  it("creates a tank entity with expected components and adds to registry", () => {
    const registry = createRegistry();
    const entity = createTank(registry);
    expect(entity.components.Transform).toBeTruthy();
    expect(entity.components.InputMove).toBeTruthy();
    expect(entity.components.Locomotion).toBeTruthy();
    expect(entity.components.ArrowGizmo).toBeTruthy();
    expect(registry.getById(entity.id)).toBe(entity);
  });
});
