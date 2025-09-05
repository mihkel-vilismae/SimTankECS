import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: arrow gizmo cleanup", () => {
  it("removes helper when component removed", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const { scene, loop, registry } = createGame(document.getElementById("app"));
    const ent = Array.from(registry.entities.values())[0];
    // run once to ensure helper exists
    loop.step(0.016, loop.world);
    const count0 = scene.children.length;
    // remove component
    delete ent.components.ArrowGizmo;
    loop.step(0.016, loop.world);
    const count1 = scene.children.length;
    expect(count1).toBeLessThan(count0);
  });
});
