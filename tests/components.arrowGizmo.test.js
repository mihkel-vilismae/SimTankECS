import { describe, it, expect } from "vitest";
import { createArrowGizmo } from "../src/components/arrowGizmo.js";

describe("ArrowGizmo component", () => {
  it("has sensible defaults", () => {
    const a = createArrowGizmo();
    expect(a.length).toBeGreaterThan(1);
    expect(a.visible).toBe(true);
  });
});
