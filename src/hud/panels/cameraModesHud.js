import { mountPanel, destroyPanel, ensureHudRoot, setActive } from "../core/hudCommon.js";
import {createSelectableButton} from "../elements/createButton.js";
import {createPanel} from "../elements/createPanel.js";

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
    const items = [
      ["default", "default"],
      ["look", "look at"],
      ["follow", "follow hull"],
      ["follow_gun", "follow gun"],
      ["orbit", "orbit"],
    ];
    items.forEach(([key, label]) => {
      const btn = createSelectableButton(label, {
        active: key === mode,
        onClick: () => { onChange && onChange(key); for (const k in buttons) setActive(buttons[k], k === key); }
      });
      panel.body.appendChild(btn);
      buttons[key] = btn;
    });
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
