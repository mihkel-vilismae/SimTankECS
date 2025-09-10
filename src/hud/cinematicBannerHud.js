import { ensureHudRoot } from "./hudCommon.js";

export function createCinematicBannerHUD({ getWorld } = {}) {
  const root = ensureHudRoot();
  const el = document.createElement("div");
  el.id = "hud-cinematic-banner";
  Object.assign(el.style, {
    position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
    padding: "6px 12px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontSize: "14px", letterSpacing: "1px", zIndex: "9999", pointerEvents: "none", display: "none",
  });
  el.textContent = "CINEMATIC MODE ON";

  function tick() {
    const w = getWorld?.();
    const active = !!(w && w.cinematicBanner && w.cinematicBanner.active);
    el.style.display = active ? "block" : "none";
    if (active && w.cinematicBanner.text) el.textContent = w.cinematicBanner.text;
    requestAnimationFrame(tick);
  }
  function mount() { if (!document.getElementById(el.id)) root.appendChild(el); requestAnimationFrame(tick); }
  function unmount(){ const n = document.getElementById(el.id); if (n && n.parentNode) n.parentNode.removeChild(n); }
  function update(){}
  return { mount, unmount, update };
}
