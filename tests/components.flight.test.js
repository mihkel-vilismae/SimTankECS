import { describe, it, expect } from "vitest";
import { createFlight } from "../src/components/flight.js";

describe("Flight component", () => {
  it("has sensible defaults and fields", () => {
    const f = createFlight();
    expect(f.climbRate).toBeGreaterThan(0);
    expect(f.vertical).toBe(0);
    expect(f.boost).toBe(1);
  });
});
