import { describe, it, expect } from "vitest";
import { registerSystems } from "../src/app/registerSystems.js";

describe("app/registerSystems", () => {
  it("adds expected systems to loop", () => {
    const loop = { systems: [], addSystem(fn){ this.systems.push(fn); } };
    const scene = { children: [], add(){} };
    const registry = { query(){ return []; } };
    registerSystems({ loop, scene, registry, camera: {} });
    expect(loop.systems.length).toBeGreaterThanOrEqual(5);
  });
});
