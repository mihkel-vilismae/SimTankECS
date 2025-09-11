# ECS Wire-up for Selected Weapon HUD

This package wires the Selected Weapon HUD directly into your ECS loop with a system:
`selectedWeaponHUDSystem(world, input, uiRoot?)`

## Files
- `src/hud/SelectedWeaponHUD.js` — DOM HUD component
- `src/hud/selected-weapon-hud.css` — HUD styles
- `src/systems/ui/selectedWeaponHUDSystem.js` — **ECS system** that mounts once and updates every frame
- `tests/ui_selected_weapon_hud_system.test.js` — jsdom-based integration test

## Usage

```js
// Somewhere during initialization:
import { gameLoop } from './mainLoop'; // your loop
import selectedWeaponHUDSystem from './src/systems/ui/selectedWeaponHUDSystem.js';

// inside your tick()
function tick(dt) {
  // ... other systems
  selectedWeaponHUDSystem(world, input, document.body);
}
```

### Mapping rules
The system expects:
- `world.weapons.selectedId` — id of current weapon entity (or `null`)
- `world.registry.getComponent(entityId, name)` — returns components
- Components used:
  - `Gun` with fields `{ ammo, reserve, cooldown, cooldownMs }`
  - `Name` with `{ value | name }`

It is tolerant to missing fields; it shows placeholders when data is absent.

## Tests
Run with Vitest:
```bash
npx vitest tests/ui_selected_weapon_hud_system.test.js
```
