export function createFlight(speed=5, turnRate=2.5, climbRate=3.5) {
  // speed, turnRate currently unused (forward/turn can reuse Locomotion) but kept for future parity
  return { speed, turnRate, climbRate, vertical: 0, boost: 1 };
}
