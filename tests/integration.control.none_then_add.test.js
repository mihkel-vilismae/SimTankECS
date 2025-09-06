
import { describe, it, expect } from "vitest";
import { createGame } from "../src/main.js";

describe("integration: no controlled entity means no movement", () => {
  it("after removeAll and add tank, WSAD should not move until controlled is set", () => {
    document.body.innerHTML = '<div id="hud-root"></div><canvas id="app"></canvas>';
    const { loop, registry } = createGame(document.getElementById("app"));
    // remove all
    const removeAll = () => {
      for (const e of Array.from(registry.entities.values())) {
        registry.remove(e.id);
      }
      loop.world.control.entityId = undefined;
    };
    removeAll();

    // add one tank manually via factory pattern used in app (simulate)
    const create = async () => {
      const mod = await import("../src/entities/tankFactory.js");
      const { createTank } = mod;
      const t = createTank(registry);
      return t;
    };

    return create().then((tank) => {
      const t = tank.components.Transform;
      const z0 = t.position.z;
      // press W but no controlled entity set
      loop.world.input.keys["KeyW"] = true;
      loop.step(0.2, loop.world);
      expect(t.position.z).toBeCloseTo(z0, 6); // no movement

      // now set control and step again -> should move
      loop.world.control.entityId = tank.id;
      loop.step(0.2, loop.world);
      expect(t.position.z).toBeGreaterThan(z0);
    });
  });
});
