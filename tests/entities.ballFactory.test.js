import { describe, it, expect } from "vitest";
import { createRegistry } from "../src/engine/registry.js";
import { createBall } from "../src/entities/ballFactory.js";

describe("entities/ballFactory", () => {
  it("creates a ball with flight and mouse follower", () => {
    const registry = createRegistry();
    const ball = createBall(registry);
    expect(ball.components.Flight).toBeTruthy();
    expect(ball.components.MouseFollower).toBeTruthy();
    expect(registry.getById(ball.id)).toBe(ball);
  });
});
