export function flyInputSystem(dt, world, registry) {
  const k = world.input.keys || {};
  const up = k["KeyQ"] ? 1 : 0;
  const down = k["KeyE"] ? 1 : 0;
  const boost = (k["ShiftLeft"] || k["ShiftRight"]) ? 1.5 : 1;
  for (const e of registry.query(["Flight"])) {
    e.components.Flight.vertical = up - down;
    e.components.Flight.boost = boost;
  }
}
