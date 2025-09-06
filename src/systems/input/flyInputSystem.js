export function flyInputSystem(dt, world, registry) {
  const k = world.input.keys || {};
  const up = k["KeyQ"] ? 1 : 0;
  const down = k["KeyE"] ? 1 : 0;
  const boost = (k["ShiftLeft"] || k["ShiftRight"]) ? 1.5 : 1;

  const targetId = world.control?.entityId;
  const ents = registry.query(["Flight"]);

  for (const e of ents) {
    const f = registry.getComponent(e, "Flight");
    f.vertical = 0;
    f.boost = 1;
  }

  if (!targetId) return;
  const target = registry.getById?.(targetId);
  if (!target || !registry.getComponent(target, "Flight")) return;
  registry.getComponent(target, "Flight").vertical = up - down;
  registry.getComponent(target, "Flight").boost = boost;
}