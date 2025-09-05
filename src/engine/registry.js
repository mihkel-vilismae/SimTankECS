import { Logger } from "../utils/logger.js";

export function createRegistry() {
  let _nextId = 1;
  const entities = new Map();

  function add(entity) {
    entities.set(entity.id, entity);
    Logger.info("[registry] add", { id: entity.id });
  }
  function remove(id) {
    entities.delete(id);
    Logger.info("[registry] remove", { id });
  }
  function getById(id) { return entities.get(id); }
  function query(componentNames) {
    const result = [];
    for (const ent of entities.values()) {
      const hasAll = componentNames.every((c) => ent.components && ent.components[c]);
      if (hasAll) result.push(ent);
    }
    return result;
  }
  function nextId() { return _nextId++; }

  return { add, remove, getById, query, nextId, entities };
}
