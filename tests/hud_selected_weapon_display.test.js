import { describe, it, expect, beforeEach } from 'vitest';

import { JSDOM } from 'jsdom';

import { mountSelectedWeaponHUD, updateSelectedWeaponHUD } from '../src/hud/SelectedWeaponHUD.js';

describe('Selected Weapon HUD', () => {
  let window, document, container;

  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    window = dom.window;
    document = window.document;
    container = document.getElementById('root');
    // expose globals for the module using DOM APIs
    global.document = document;
  });

  it('mounts and shows defaults', () => {
    const root = mountSelectedWeaponHUD(container);
    expect(root).toBeTruthy();
    expect(container.querySelector('.weapon-hud')).toBeTruthy();
  });

  it('updates with selected weapon info', () => {
    mountSelectedWeaponHUD(container);
    updateSelectedWeaponHUD({
      selectedWeaponName: '120mm Cannon',
      ammoInMag: 1,
      reserveAmmo: 14,
      cooldownMs: 0,
      canFire: true,
      triggerHeld: false,
    });
    expect(container.querySelector('.weapon-hud__name').textContent).toBe('120mm Cannon');
    expect(container.querySelector('.weapon-hud__ammo').textContent).toBe('1 | 14');
    expect(container.querySelector('.weapon-hud__status').textContent).toBe('READY');
    expect(container.querySelector('.weapon-hud__status').dataset.state).toBe('ready');
  });

  it('reflects trigger held & blocked state', () => {
    mountSelectedWeaponHUD(container);
    updateSelectedWeaponHUD({
      selectedWeaponName: 'MG',
      ammoInMag: 0,
      reserveAmmo: 200,
      cooldownMs: 500,
      canFire: false,
      triggerHeld: true,
    });
    const status = container.querySelector('.weapon-hud__status');
    expect(status.textContent).toContain('TRIGGER: HELD');
    expect(status.dataset.state).toBe('held');
  });

  it('reflects trigger held & firing state', () => {
    mountSelectedWeaponHUD(container);
    updateSelectedWeaponHUD({
      selectedWeaponName: 'MG',
      ammoInMag: 50,
      reserveAmmo: 150,
      cooldownMs: 0,
      canFire: true,
      triggerHeld: true,
    });
    const status = container.querySelector('.weapon-hud__status');
    expect(status.textContent).toBe('TRIGGER: HELD (FIRING)');
    expect(status.dataset.state).toBe('firing');
  });
});
