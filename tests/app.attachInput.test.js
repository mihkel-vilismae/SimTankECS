import { describe, it, expect } from "vitest";
import { attachInput } from "../src/app/attachInput.js";

describe("app/attachInput", () => {
  it("captures keyboard events and disposes", () => {
    const world = { input: { keys: {} } };
    const detach = attachInput(world);
    // simulate events
    const down = new KeyboardEvent("keydown", { code: "KeyW" });
    const up = new KeyboardEvent("keyup", { code: "KeyW" });
    window.dispatchEvent(down);
    expect(world.input.keys["KeyW"]).toBe(true);
    window.dispatchEvent(up);
    expect(world.input.keys["KeyW"]).toBe(false);
    // detach
    detach();
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
    expect(world.input.keys["KeyW"]).toBe(false); // remains unchanged after detach
  });
});
