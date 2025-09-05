export function createHud(root = document.getElementById("hud-root")) {
  if (root) root.textContent = "WSAD/Arrows drive, Q/E fly, Mouse to aim. Camera auto-follows the tank.";
  return {
    setMessage(msg) { if (root) root.textContent = msg; }
  };
}
