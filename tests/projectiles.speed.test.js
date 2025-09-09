import { describe, it, expect, vi } from 'vitest';
import { createProjectile } from './components/projectile.js';

describe('Projectile speeds', () => {
  it('bullet default speed is slower (300)', () => {
    const p = createProjectile({ kind:'bullet' });
    expect(p.speed).toBe(300);
  });
  it('shell default speed is slower (120)', () => {
    const p = createProjectile({ kind:'shell', speed: 120 });
    expect(p.speed).toBe(120);
  });
});
