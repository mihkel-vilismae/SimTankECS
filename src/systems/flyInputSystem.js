export function flyInputSystem(dt, world, registry) {
  const k = world.input.keys || {};
  const up = k["KeyQ"] ? 1 : 0;
  const down = k["KeyE"] ? 1 : 0;
  const boost = (k["ShiftLeft"] || k["ShiftRight"]) ? 1.5 : 1;

  const targetId = world.control?.entityId;
  const ents = registry.query(["Flight"]);

  for (const e of ents) {
    const f = e.components.Flight;
    f.vertical = 0;
    f.boost = 1;
  }

  if (!targetId) return;
  const target = registry.getById?.(targetId);
  if (!target || !target.components?.Flight) return;
  target.components.Flight.vertical = up - down;
  target.components.Flight.boost = boost;
}
