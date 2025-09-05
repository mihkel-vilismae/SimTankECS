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
import { registerSystems } from "./registerSystems.js";
import { attachInput } from "./attachInput.js";
import { createHud } from "../hud/createHud.js";

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
  const tank = createTank(registry);
  scene.add(tank.object3D);

  // Systems
  registerSystems({ loop, scene, registry, camera });

  // Input + HUD
  const detachInput = attachInput(loop.world);
  const hud = createHud();

  const detachResize = setupResize(renderer, camera);
  Logger.info("[createGame] world ready");

  return { scene, renderer, camera, registry, loop, hud, detachInput, detachResize };
}
