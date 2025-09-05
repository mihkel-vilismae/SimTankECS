import { describe, it, expect } from "vitest";
import { createLoop } from "../src/engine/loop.js";

describe("loop", () => {
  it("runs systems in order", () => {
    const calls = [];
    const renderer = { render: () => {} };
    const loop = createLoop(renderer, {}, {}, { query(){ return []; } });
    loop.addSystem((dt) => calls.push("A"));
    loop.addSystem((dt) => calls.push("B"));
    loop.step(0.016, loop.world);
    expect(calls).toEqual(["A","B"]);
  });
});
