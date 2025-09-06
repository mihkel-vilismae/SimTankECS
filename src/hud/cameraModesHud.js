import { createPanel, mountPanel, destroyPanel, ensureHudRoot, createSelectableButton, setActive } from "./hudCommon.js";

/**
 * CameraModesHUD
 * Buttons to toggle camera mode: default, look, follow
 * API: { mount, unmount, update({ mode }), onChange(fn) }
 */
export function createCameraModesHUD({ initialMode = "default", onChange } = {}) {
  const panel = createPanel({ id: "hud-cameramodes", title: "Camera Modes" });

  const buttons = {};
  function render(mode) {
    panel.body.innerHTML = "";
    const list = [
      ["default", "default"],
      ["look", "look at"],
      ["follow", "follow"],
      ["orbit", "orbit"],
    ];
    for (const [key, label] of list) {
      const btn = createSelectableButton(label, {
        active: mode === key,
        onClick: () => {
          update({ mode: key });
          onChange?.(key);
        },
      });
      buttons[key] = btn;
      panel.body.appendChild(btn);
    }
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    render(initialMode);
  }

  function unmount() {
    destroyPanel(panel);
  }

  function update({ mode } = {}) {
    if (!mode) return;
    for (const k in buttons) setActive(buttons[k], k === mode);
  }

  return { mount, unmount, update };
}
