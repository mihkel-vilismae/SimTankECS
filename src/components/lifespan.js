export function createLifespan(ms = 2000) { // default 2s
  return { ms, bornAt: performance.now() };
}
