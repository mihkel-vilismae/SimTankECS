# Selected Weapon HUD Patch

This patch adds an on-screen HUD that reflects the **selected weapon** and the **trigger state**.
It is framework-agnostic vanilla JS + CSS so you can integrate it into your loop or ECS system.

## Files
- `src/hud/SelectedWeaponHUD.js` — DOM-based HUD module
- `src/hud/selected-weapon-hud.css` — minimal styles
- `tests/hud_selected_weapon_display.test.js` — jsdom test verifying UI updates

## Quick Start

1) Include the CSS and JS (ESM). Example with a bundler (Vite/Webpack/Parcel):

```js
// somewhere in your UI bootstrap:
import { mountSelectedWeaponHUD, updateSelectedWeaponHUD } from './src/hud/SelectedWeaponHUD.js';
import './src/hud/selected-weapon-hud.css';

// Create and mount HUD once (e.g., on app init)
const hud = mountSelectedWeaponHUD(document.body); // parent can be any container element

// In your main update loop or UI system, call update with your game's state:
updateSelectedWeaponHUD({
  selectedWeaponName: world.weapons?.selectedName ?? '—',
  ammoInMag: world.weapons?.selectedAmmo ?? 0,
  reserveAmmo: world.weapons?.selectedReserve ?? 0,
  cooldownMs: world.weapons?.selectedCooldownMs ?? 0,
  canFire: world.weapons?.canSelectedFire ?? false,
  triggerHeld: input.mouse?.down === true,
});
```

2) If you have an ECS/registry, map your data into that shape. For example:

```js
function mapFromWorld(world, input) {
  const id = world.weapons?.selectedId ?? null;
  if (!id) return {
    selectedWeaponName: '—',
    ammoInMag: 0,
    reserveAmmo: 0,
    cooldownMs: 0,
    canFire: false,
    triggerHeld: input.mouse?.down === true,
  };
  const gun = world.registry.getComponent(id, 'Gun');
  const name = world.registry.getComponent(id, 'Name')?.value ?? 'Weapon';
  return {
    selectedWeaponName: name,
    ammoInMag: gun?.ammo ?? 0,
    reserveAmmo: gun?.reserve ?? 0,
    cooldownMs: Math.max(0, gun?.cooldownMs ?? 0),
    canFire: gun ? gun.ammo > 0 && (gun.cooldown ?? 0) <= 0 : false,
    triggerHeld: input.mouse?.down === true,
  };
}

// then pass mapFromWorld(world, input) into updateSelectedWeaponHUD(...)
```

3) The HUD indicates:
- **Selected weapon name** (bold)
- **Ammo**: `mag | reserve`
- **Cooldown**: number + progress bar
- **Trigger**: shows **HELD** when the trigger button is held; **READY / BLOCKED** depending on `canFire`

## Test
Run with your existing Vitest/Jest in `tests/`:

```bash
npx vitest tests/hud_selected_weapon_display.test.js
# or
npm run test
```
