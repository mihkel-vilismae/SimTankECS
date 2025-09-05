export function createInputMove() {
  return { forward: 0, turn: 0 }; // W/S, A/D -> forward, turn
}
export function createLocomotion(speed=4, turnRate=2) {
  return { speed, turnRate };
}
