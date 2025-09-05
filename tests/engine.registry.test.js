import { describe, it, expect } from "vitest";
import { createRegistry } from "../src/engine/registry.js";

describe("registry", () => {
  it("adds and queries entities by components", () => {
    const r = createRegistry();
    const e = { id: r.nextId(), components: { Transform: {}, Locomotion: {} } };
    r.add(e);
    const q = r.query(["Transform"]);
    expect(q.length).toBe(1);
    expect(q[0].id).toBe(e.id);
  });
});
