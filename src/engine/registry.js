export function createRegistry() {
  const entities = new Set();
  return {
    add(entity) { entities.add(entity); return entity; },
    remove(entity) { entities.delete(entity); },
    with(componentKey) {
      return [...entities].filter(e => e.components && e.components[componentKey]);
    },
    all() { return entities; }
  };
}
