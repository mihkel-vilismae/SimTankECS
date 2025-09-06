import { createPanel, mountPanel, destroyPanel, ensureHudRoot } from "./hudCommon.js";

/**
 * Simple message HUD used for short hints.
 * Uniform interface: { mount, unmount, update({text}) }
 * Back-compat: setMessage(text)
 */
export function createHud() {
  const panel = createPanel({ id: "hud-message", title: "HUD" });

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
  }

  function unmount() {
    destroyPanel(panel);
  }

  function update({ text } = {}) {
    panel.body.textContent = text ?? "";
  }

  // Backward-compat alias
  const setMessage = (text) => update({ text });

  return { mount, unmount, update, setMessage };
}
