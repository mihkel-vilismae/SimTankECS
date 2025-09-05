import { createPanel, createButton, ensureHudRoot } from "./hudCommon.js";

export function createTestButtonsHUD(actions) {
  const { root, body } = createPanel({ id: "hud-testbuttons", title: "TestButtonsHUD" });
  ensureHudRoot().appendChild(root);

  const addBallBtn = createButton("add new ball", actions.addBall);
  const addTankBtn = createButton("add new tank", actions.addTank);
  const switchBtn  = createButton("switch Controlled object", actions.switchControlled);
  const removeBtn  = createButton("remove all balls and tank from world", actions.removeAll);

  body.appendChild(addBallBtn);
  body.appendChild(addTankBtn);
  body.appendChild(switchBtn);
  body.appendChild(removeBtn);

  return {};
}
