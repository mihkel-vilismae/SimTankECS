export function createPool(factory, size = 64, onAcquire, onRelease) {
  const free = [];
  const all = [];
  for (let i=0;i<size;i++) { const o = factory(); free.push(o); all.push(o); }
  return {
    get() {
      const o = free.pop() || factory();
      onAcquire && onAcquire(o);
      return o;
    },
    put(o) {
      onRelease && onRelease(o);
      free.push(o);
    },
    all, free,
  };
}
