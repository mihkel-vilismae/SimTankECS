import { createGame as _createGame } from "./app/createGame.js";

export function createGame(canvas) {
  return _createGame(canvas);
}

export function startGame() {
  const { loop } = _createGame();
  loop.start();
}

if (!import.meta.vitest) {
  startGame();
}
