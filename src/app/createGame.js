import * as THREE from "three";
import { Logger } from "../utils/logger.js";
import { createScene } from "../engine/createScene.js";
import { createRenderer } from "../engine/createRenderer.js";
import { createCamera } from "../engine/createCamera.js";
import { createGround } from "../engine/createGround.js";
import { addBasicLighting } from "../engine/createLighting.js";
import { createSky } from "../engine/createSky.js";
import { setupResize } from "../engine/resize.js";
import { createRegistry } from "../engine/registry.js";
import { createLoop } from "../engine/loop.js";

import { createTank } from "../entities/tankFactory.js";
import { createBall } from "../entities/ballFactory.js";
import { registerSystems } from "./registerSystems.js";
import { createFloatingTextHUD } from "../hud/floatingTextHud.js";
import { createHealthBarsHUD } from "../hud/healthBarsHud.js";
import { createCityGeneratorHUD } from "../hud/cityGeneratorHud.js";
import { attachInput } from "./attachInput.js";
import { attachMouse } from "./attachMouse.js";
import { createHud } from "../hud/createHud.js";
import { createControlledObjectHUD } from "../hud/controlledObjectHud.js";
import { createTestButtonsHUD } from "../hud/testButtonsHud.js";
import { hudUpdateSystemFactory } from "../systems/ui/hudUpdateSystem.js";
import { createCameraModesHUD } from "../hud/cameraModesHud.js";

export function createGame(canvas = document.getElementById("app")) {
  const scene = createScene();
  const renderer = createRenderer(canvas);
  const camera = createCamera();
  const registry = createRegistry();
  const loop = createLoop(renderer, scene, camera, registry);

  // World content
  scene.add(createGround());
  addBasicLighting(scene);
  scene.add(createSky());

  // Entities
  const tank = createTank(registry, scene);
  scene.add(tank.object3D);
  const ball = createBall(registry);
  scene.add(ball.object3D);

  // Controlled entity state (default: tank)
  loop.world.cameraMode = "default";
  loop.world.control = {
    entityId: tank.id,
  };

  function getControlledEntity() {
    const id = loop.world.control?.entityId;
    return id ? registry.getById(id) : null;
  }

  function addTank() {
    const t2 = createTank(registry); scene.add(t2.object3D); return t2;
  }
  function addBall() {
    const b2 = createBall(registry); scene.add(b2.object3D); return b2;
  }
  function switchControlled() {
    // cycle through entities that have InputMove
    const list = Array.from(registry.entities.values()).filter(e => registry.getComponent(e, "InputMove"));
    if (list.length === 0) return;
    const current = getControlledEntity();
    const idx = Math.max(0, list.findIndex(e => current && e.id === current.id));
    const next = list[(idx + 1) % list.length];
    loop.world.control.entityId = next.id;
  }
  function removeAll() {
    for (const e of Array.from(registry.entities.values())) {
      if (e.object3D) scene.remove(e.object3D);
      registry.remove(e.id);
    }
    loop.world.control.entityId = undefined;
  }

  // Systems
  registerSystems({ loop, scene, registry, camera, renderer });
  const controlledHud = createControlledObjectHUD();
  controlledHud.mount();
  controlledHud.update(getControlledEntity());
  const hudUpdateSystem = hudUpdateSystemFactory(controlledHud, getControlledEntity);
  loop.addSystem(hudUpdateSystem);

  // Input + HUD
  const detachInput = attachInput(loop.world);
  const detachMouse = attachMouse(loop.world, canvas);
  const hud = createHud();
  hud.mount();
  hud.update({ text: "Tank: WSAD (A/D turn).  Ball: WSAD (A/D slide) + Q/E up/down + Mouse aim." });
  const testButtons = createTestButtonsHUD({ addBall, addTank, switchControlled, removeAll });
  testButtons.mount();

  // Camera modes HUD (always shown)
  const cameraHud = createCameraModesHUD({ initialMode: loop.world.cameraMode, onChange: (mode) => { loop.world.cameraMode = mode; } });
  cameraHud.mount();
  const dmgHud = createFloatingTextHUD({ getWorld: () => loop.world, getRegistry: () => registry });
  dmgHud.mount();
  const hpHud = createHealthBarsHUD({ getWorld: () => loop.world, getRegistry: () => registry });
  hpHud.mount();
  const cityHud = createCityGeneratorHUD({ getWorld: () => loop.world, getRegistry: () => registry });
  cityHud.mount();

  window.addEventListener("keydown", (e) => {
    const map = { Digit1: "default", Digit2: "look", Digit3: "follow", Digit4: "orbit", Digit5: "follow_gun" };
    const m = map[e.code];
    if (m) { loop.world.cameraMode = m; cameraHud.update({ mode: m }); }
  });

  const detachResize = setupResize(renderer, camera);
  Logger.info("[createGame] world ready (tank + ball)");

  return { scene, renderer, camera, registry, loop, hud, detachInput, detachMouse, detachResize };
}