export function createHud(root = document.getElementById("hud-root")) {
  if (root) root.textContent = "WSAD/Arrows to drive. Camera auto-follows the tank.";
  return {
    setMessage(msg) { if (root) root.textContent = msg; }
  };
}
