export function flyInputSystem(dt, world, registry) {
  const getC = registry.getComponent ? registry.getComponent.bind(registry) : ((e,n)=> e?.components?.[n]);
  const k = world.input.keys || {};
  const up = k["KeyQ"] ? 1 : 0;
  const down = k["KeyE"] ? 1 : 0;
  const boost = (k["ShiftLeft"] || k["ShiftRight"]) ? 1.5 : 1;

  const targetId = world.control?.entityId;
  const ents = registry.query(["Flight"]);

  for (const e of ents) {
    const f = getC(e, "Flight");
    f.vertical = 0;
    f.boost = 1;
  }

  if (!targetId) return;
  const target = registry.getById?.(targetId);
  if (!target || !getC(target, "Flight")) return;
  getC(target, "Flight").vertical = up - down;
  getC(target, "Flight").boost = boost;
}