import { describe, it, expect } from 'vitest';
import { createLifespan } from '../src/components/lifespan.js';

describe('Lifespan default', () => {
  it('defaults to 2000 ms', () => {
    const l = createLifespan();
    expect(l.ms).toBe(2000);
  });
});
