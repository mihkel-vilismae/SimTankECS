export function createLifespan(ms=5000){ return { ms, bornAt: performance.now() }; }
