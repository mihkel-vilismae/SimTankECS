import * as THREE from "three";
import { describe, it, expect, beforeEach } from "vitest";
import { createRegistry } from "../src/engine/registry.js";
import { createTank } from "../src/entities/tankFactory.js";

describe("Tank factory -> turret visibility", () => {
  let registry, scene, hull;

  beforeEach(() => {
    registry = createRegistry();
    scene = new THREE.Scene();
    hull = createTank(registry, scene);
  });

  it("creates a turret entity and its mesh is visible in the scene", () => {
    const turret = Array.from(registry.entities.values())
      .find(e => e.components?.Turret);
    expect(turret).toBeTruthy();
    expect(turret.object3D).toBeInstanceOf(THREE.Object3D);
    expect(turret.object3D.visible).toBe(true);
    // The turret object should have been added to the scene by the factory
    expect(scene.children.includes(turret.object3D)).toBe(true);
  });
});
