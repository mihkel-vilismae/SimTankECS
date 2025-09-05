import { describe, it, expect } from "vitest";
import { clamp, lerp, normalizeAngle, yawToForward } from "../src/utils/math3d.js";

describe("math3d", () => {
  it("clamp limits values", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
  it("lerp interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
  it("normalizeAngle wraps to [-pi,pi]", () => {
    expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI, 5);
  });
  it("yawToForward maps yaw to unit forward", () => {
    const f = yawToForward(0);
    expect(f.z).toBeCloseTo(1, 5);
  });
});
