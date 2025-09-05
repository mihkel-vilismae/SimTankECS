import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: world boots with tank + ball", () => {
  it("has two entities (tank, ball)", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const game = createGame(document.getElementById("app"));
    expect(game.registry.entities.size).toBe(2);
  });
});
