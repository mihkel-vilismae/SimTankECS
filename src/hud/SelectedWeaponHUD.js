// src/hud/SelectedWeaponHUD.js
let _root = null;
let _els = null;

function h(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}

export function mountSelectedWeaponHUD(parent) {
  if (!parent) throw new Error('mountSelectedWeaponHUD: parent element required');
  if (_root) return _root;
  const root = h('div', 'weapon-hud');
  const title = h('div', 'weapon-hud__title', 'Weapon');
  const name = h('div', 'weapon-hud__name', '—');
  const ammo = h('div', 'weapon-hud__ammo', '0 | 0');
  const status = h('div', 'weapon-hud__status', 'READY');
  const cooldownRow = h('div', 'weapon-hud__cooldown-row');
  const cooldownLabel = h('span', 'weapon-hud__cooldown-label', 'CD');
  const cooldownValue = h('span', 'weapon-hud__cooldown-value', '0ms');
  const cooldownBar = h('div', 'weapon-hud__cooldown');
  const cooldownBarFill = h('div', 'weapon-hud__cooldown-fill');

  cooldownBar.appendChild(cooldownBarFill);
  cooldownRow.appendChild(cooldownLabel);
  cooldownRow.appendChild(cooldownValue);

  root.appendChild(title);
  root.appendChild(name);
  root.appendChild(ammo);
  root.appendChild(status);
  root.appendChild(cooldownRow);
  root.appendChild(cooldownBar);

  parent.appendChild(root);
  _root = root;
  _els = { name, ammo, status, cooldownValue, cooldownBarFill };
  return root;
}

export function updateSelectedWeaponHUD(state) {
  if (!_root || !_els) return;
  const {
    selectedWeaponName = '—',
    ammoInMag = 0,
    reserveAmmo = 0,
    cooldownMs = 0,
    canFire = false,
    triggerHeld = false,
  } = state ?? {};

  _els.name.textContent = selectedWeaponName;
  _els.ammo.textContent = `${Math.max(0, ammoInMag)} | ${Math.max(0, reserveAmmo)}`;

  const cd = Math.max(0, Number(cooldownMs) || 0);
  _els.cooldownValue.textContent = `${cd}ms`;
  const pct = Math.max(0, Math.min(1, cd / 1000));
  _els.cooldownBarFill.style.transform = `scaleX(${1 - pct})`;

  if (triggerHeld) {
    _els.status.textContent = canFire && cd === 0 ? 'TRIGGER: HELD (FIRING)' : 'TRIGGER: HELD (BLOCKED)';
    _els.status.dataset.state = canFire && cd === 0 ? 'firing' : 'held';
  } else {
    _els.status.textContent = canFire && cd === 0 ? 'READY' : 'BLOCKED';
    _els.status.dataset.state = canFire && cd === 0 ? 'ready' : 'blocked';
  }
}
