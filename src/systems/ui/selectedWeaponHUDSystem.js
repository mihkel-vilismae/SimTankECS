// src/systems/ui/selectedWeaponHUDSystem.js
// This system mounts the HUD once and updates it each frame from `world` + `input`.
// It is defensive: it works if your world has `weapons.selectedId`, a `registry`
// with getComponent(entityId, name) and an optional Name + Gun components.

import { mountSelectedWeaponHUD, updateSelectedWeaponHUD } from '../../hud/SelectedWeaponHUD.js';
import '../../hud/selected-weapon-hud.css';

let _mounted = false;

function mapFromWorld(world, input) {
  const triggerHeld = !!(input && input.mouse && input.mouse.down === true);
  const selectedId = world?.weapons?.selectedId ?? null;

  if (!selectedId || !world?.registry?.getComponent) {
    return {
      selectedWeaponName: '—',
      ammoInMag: 0,
      reserveAmmo: 0,
      cooldownMs: 0,
      canFire: false,
      triggerHeld,
    };
  }

  const gun = world.registry.getComponent(selectedId, 'Gun');
  const nameC = world.registry.getComponent(selectedId, 'Name');

  const ammo = gun?.ammo ?? 0;
  const reserve = gun?.reserve ?? 0;
  const cooldownMs = Math.max(0, gun?.cooldownMs ?? ((gun?.cooldown ?? 0) * 1000) || 0);
  const cooldown = gun?.cooldown ?? 0;

  const canFire = ammo > 0 && cooldown <= 0;

  return {
    selectedWeaponName: nameC?.value ?? nameC?.name ?? 'Weapon',
    ammoInMag: ammo,
    reserveAmmo: reserve,
    cooldownMs,
    canFire,
    triggerHeld,
  };
}

export function selectedWeaponHUDSystem(world, input, uiRoot = document.body) {
  if (!_mounted) {
    mountSelectedWeaponHUD(uiRoot);
    _mounted = true;
  }
  const state = mapFromWorld(world, input);
  updateSelectedWeaponHUD(state);
}

export default selectedWeaponHUDSystem;
