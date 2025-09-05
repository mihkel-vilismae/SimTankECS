import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: tank and ball spawn", () => {
  it("creates both tank and ball entities", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const { registry } = createGame(document.getElementById("app"));
    const ents = Array.from(registry.entities.values());
    const hasTank = ents.some(e => e.components.Locomotion);
    const hasBall = ents.some(e => e.components.Flight);
    expect(hasTank).toBe(true);
    expect(hasBall).toBe(true);
  });
});
