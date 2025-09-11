// tests/ui_selected_weapon_hud_system.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

import selectedWeaponHUDSystem from '../src/systems/ui/selectedWeaponHUDSystem.js';

class MockRegistry {
  constructor() { this.components = new Map(); }
  setComponent(id, name, data) {
    const key = `${id}:${name}`;
    this.components.set(key, data);
  }
  getComponent(id, name) {
    return this.components.get(`${id}:${name}`);
  }
}

describe('selectedWeaponHUDSystem', () => {
  let document, container, world, input, registry;

  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
    document = dom.window.document;
    global.document = document; // for HUD module

    registry = new MockRegistry();
    world = {
      weapons: { selectedId: null },
      registry,
    };
    input = { mouse: { down: false } };
    container = document.getElementById('app');
  });

  it('mounts and renders blanks when no selection', () => {
    selectedWeaponHUDSystem(world, input, container);
    expect(container.querySelector('.weapon-hud')).toBeTruthy();
    expect(container.querySelector('.weapon-hud__name').textContent).toBe('—');
  });

  it('shows selected weapon details and READY state', () => {
    world.weapons.selectedId = 'ent1';
    registry.setComponent('ent1', 'Gun', { ammo: 5, reserve: 15, cooldown: 0, cooldownMs: 0 });
    registry.setComponent('ent1', 'Name', { value: '120mm Cannon' });

    selectedWeaponHUDSystem(world, input, container);

    expect(container.querySelector('.weapon-hud__name').textContent).toBe('120mm Cannon');
    expect(container.querySelector('.weapon-hud__ammo').textContent).toBe('5 | 15');
    expect(container.querySelector('.weapon-hud__status').textContent).toBe('READY');
  });

  it('shows trigger held and firing/blocked correctly', () => {
    world.weapons.selectedId = 'ent2';
    registry.setComponent('ent2', 'Gun', { ammo: 50, reserve: 150, cooldown: 0, cooldownMs: 0 });
    registry.setComponent('ent2', 'Name', { value: 'MG' });

    // Held & firing
    input.mouse.down = true;
    selectedWeaponHUDSystem(world, input, container);
    let status = container.querySelector('.weapon-hud__status');
    expect(status.textContent).toBe('TRIGGER: HELD (FIRING)');

    // Blocked (cooldown)
    registry.setComponent('ent2', 'Gun', { ammo: 50, reserve: 150, cooldown: 0.2, cooldownMs: 200 });
    selectedWeaponHUDSystem(world, input, container);
    status = container.querySelector('.weapon-hud__status');
    expect(status.textContent).toBe('TRIGGER: HELD (BLOCKED)');
  });
});
