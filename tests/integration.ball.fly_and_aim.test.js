import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: ball can fly and aim with mouse", () => {
  it("Q increases Y; mouse influences yaw", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const { loop, registry, camera } = createGame(document.getElementById("app"));
    const ents = Array.from(registry.entities.values());
    const ball = ents.find(e => e.components.Flight);
    const t = ball.components.Transform;

    // set mouse NDC center so ray hits ahead; also press Q for climb
    loop.world.input.mouse = { x: 0.2, y: -0.2, down: false, wheelDelta: 0 };
    loop.world.input.keys["KeyQ"] = true;

    const y0 = t.position.y;
    const yaw0 = t.rotation.yaw;

    loop.step(0.2, loop.world);

    expect(t.position.y).toBeGreaterThan(y0);
    expect(t.rotation.yaw).not.toBe(yaw0);
  });
});
