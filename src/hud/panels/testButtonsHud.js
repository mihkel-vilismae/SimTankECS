import {  mountPanel, destroyPanel, ensureHudRoot } from "../core/hudCommon.js";
import {createButton} from "../elements/createButton.js";
import {createPanel} from "../elements/createPanel.js";

/**
 * TestButtonsHUD
 * Buttons to spawn/switch/remove entities.
 * Uniform interface: { mount, unmount, update(actions) }
 */
export function createTestButtonsHUD(actions) {
  const panel = createPanel({ id: "hud-testbuttons", title: "TestButtonsHUD" });

  function renderButtons(a) {
    panel.body.innerHTML = "";
    panel.body.appendChild(createButton("add new ball", a?.addBall));
    panel.body.appendChild(createButton("add new tank", a?.addTank));
    panel.body.appendChild(createButton("switch Controlled object", a?.switchControlled));
    panel.body.appendChild(createButton("remove all balls and tank from world", a?.removeAll));
  }

  function mount(container) {
    mountPanel(panel, container ?? ensureHudRoot());
    renderButtons(actions);
  }

  function unmount() {
    destroyPanel(panel);
  }

  function update(newActions) {
    actions = { ...actions, ...newActions };
    renderButtons(actions);
  }

  return { mount, unmount, update };
}
