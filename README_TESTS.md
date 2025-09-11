# Tests for Building Ground Placement (Real System Import)

This bundle updates/creates tests that import your actual system:

- `src/systems/world/buildingPlacementSystem.js`

## Files
- `tests/buildingPlacementSystem.test.js` — imports the real system and verifies ground snapping and air-gap rejection.
- `tests/groundSnap.test.js` — unit tests for the helper functions.
- `README_TESTS.md` — this file.

## Run
```bash
npm i -D vitest jsdom
npx vitest tests/buildingPlacementSystem.test.js tests/groundSnap.test.js
```
