import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: game boots", () => {
  it("creates world and registers tank with ArrowGizmo", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const game = createGame(document.getElementById("app"));
    expect(game.registry.entities.size).toBeGreaterThanOrEqual(1);
    const ent = Array.from(game.registry.entities.values())[0];
    expect(ent.components.ArrowGizmo).toBeTruthy();
    // systems wired
    expect(game.loop.systems.length).toBeGreaterThanOrEqual(5);
  });
});
