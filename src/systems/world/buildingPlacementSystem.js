// src/systems/world/buildingPlacementSystem.js
// Building placement system: grid-align -> ground-snap -> validate -> spawn.

import {
  quantizeToGrid,
  groundSnapToTerrain,
  validateBuildingPlacement,
  validateInsideGrid,
} from './placement/groundSnap.js';

export function buildingPlacementSystem(world, input, registry) {
  const desired = world?.placement?.desiredPos;
  if (!desired) return;

  // 1) Quantize X/Z to grid centers
  const q = quantizeToGrid(world, desired);

  // 2) Snap Y to terrain
  const onGround = groundSnapToTerrain(world, q);

  // 3) Validate ground + grid
  const okGround = validateBuildingPlacement(world, onGround, 0.05);
  const okGrid   = validateInsideGrid(world, onGround);

  // 4) Confirm to place
  if (input?.confirmPlace && okGround && okGrid) {
    registry.spawn('Building', { position: onGround });
  }

  // 5) UI feedback
  world.ui = world.ui || {};
  world.ui.buildingPlacementValid = !!(okGround && okGrid);
}
