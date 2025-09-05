export function hudUpdateSystemFactory(hudControlled, getControlledEntity) {
  return function hudUpdateSystem(dt, world, registry) {
    const ent = getControlledEntity?.(registry, world) || null;
    hudControlled?.setData(ent);
  };
}
