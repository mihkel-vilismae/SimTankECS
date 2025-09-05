import * as THREE from "three";
import { Logger } from "./utils/logger.js";
import { createScene } from "./engine/createScene.js";
import { createRenderer } from "./engine/createRenderer.js";
import { createCamera } from "./engine/createCamera.js";
import { createGround } from "./engine/createGround.js";
import { addBasicLighting } from "./engine/createLighting.js";
import { createSky } from "./engine/createSky.js";
import { setupResize } from "./engine/resize.js";
import { createRegistry } from "./engine/registry.js";
import { createLoop } from "./engine/loop.js";

import { createTransform } from "./components/transform.js";
import { createInputMove, createLocomotion } from "./components/motion.js";
import { createArrowGizmo } from "./components/arrowGizmo.js";

import { movementInputSystem } from "./systems/movementInputSystem.js";
import { movementTransformationSystem } from "./systems/movementTransformationSystem.js";
import { transformApplySystem } from "./systems/transformApplySystem.js";
import { cameraFollowSystem } from "./systems/cameraFollowSystem.js";
import { arrowGizmoSystemFactory } from "./systems/arrowGizmoSystem.js";

Logger.setLevel("info");

export function createGame(canvas = document.getElementById("app")) {
  const scene = createScene();
  const renderer = createRenderer(canvas);
  const camera = createCamera();
  const registry = createRegistry();
  const loop = createLoop(renderer, scene, camera, registry);

  // World
  const ground = createGround();
  scene.add(ground);
  addBasicLighting(scene);
  scene.add(createSky());

  // Entity: tank (box)
  const bodyGeo = new THREE.BoxGeometry(1.2, 0.6, 2.0);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3388ff });
  const tankMesh = new THREE.Mesh(bodyGeo, bodyMat);
  tankMesh.castShadow = true;
  tankMesh.position.y = 0.5;
  scene.add(tankMesh);

  const tank = {
    id: registry.nextId(),
    object3D: tankMesh,
    components: {
      Transform: createTransform(0, 0.5, 0, 0, 0, 0),
      InputMove: createInputMove(),
      Locomotion: createLocomotion(4.0, 2.0),
      ArrowGizmo: createArrowGizmo({ length: 2.0 }),
    },
  };
  registry.add(tank);

  // Systems
  const arrowGizmoSystem = arrowGizmoSystemFactory(scene);
  loop.addSystem(movementInputSystem);
  loop.addSystem(movementTransformationSystem);
  loop.addSystem(transformApplySystem);
  loop.addSystem(cameraFollowSystem);
  loop.addSystem(arrowGizmoSystem);

  // HUD
  const hud = document.getElementById("hud-root");
  if (hud) hud.textContent = "WSAD/Arrows to drive. Camera auto-follows the tank.";

  // Input
  window.addEventListener("keydown", (e) => (loop.world.input.keys[e.code] = true));
  window.addEventListener("keyup",   (e) => (loop.world.input.keys[e.code] = false));

  // Resize
  const detachResize = setupResize(renderer, camera);

  Logger.info("[boot] World initialized. Ready.");
  return { scene, renderer, camera, registry, loop, detachResize };
}

export function startGame() {
  const { loop } = createGame();
  loop.start();
}

if (!import.meta.vitest) {
  // Auto-start only when not under Vitest
  startGame();
}
