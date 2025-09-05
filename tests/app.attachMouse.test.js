import { describe, it, expect } from "vitest";
import { attachMouse } from "../src/app/attachMouse.js";

describe("app/attachMouse", () => {
  it("tracks NDC and detaches listeners", () => {
    document.body.innerHTML = '<canvas id="app" width="100" height="100" style="width:100px;height:100px"></canvas>';
    const canvas = document.getElementById("app");
    canvas.getBoundingClientRect = () => ({ left:0, top:0, width:100, height:100, right:100, bottom:100 });
    const world = { input: { keys: {} } };
    const detach = attachMouse(world, canvas);

    const evt = new MouseEvent("mousemove", { clientX: 50, clientY: 50 });
    window.dispatchEvent(evt);
    expect(world.input.mouse.x).toBeCloseTo(0, 5);
    expect(world.input.mouse.y).toBeCloseTo(0, 5);

    detach();
    const evt2 = new MouseEvent("mousemove", { clientX: 10, clientY: 10 });
    window.dispatchEvent(evt2);
    // unchanged after detach
    expect(world.input.mouse.x).toBeCloseTo(0, 5);
  });
});
