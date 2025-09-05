import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: ecs frame advance", () => {
  it("applies movement and mirrors to object3D", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const { loop, registry } = createGame(document.getElementById("app"));
    const ent = Array.from(registry.entities.values())[0];
    // simulate input: forward
    loop.world.input.keys["KeyW"] = true;
    const z0 = ent.components.Transform.position.z;
    loop.step(0.1, loop.world);
    expect(ent.components.Transform.position.z).toBeGreaterThan(z0);
    expect(ent.object3D.rotation.y).toBeCloseTo(ent.components.Transform.rotation.yaw, 5);
  });
});
