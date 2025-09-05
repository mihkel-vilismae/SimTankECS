import * as THREE from "three";
import { createScene } from "./engine/createScene.js";
import { createRenderer } from "./engine/createRenderer.js";
import { createCamera } from "./engine/createCamera.js";
import { createGround } from "./engine/createGround.js";
import { addBasicLighting } from "./engine/createLighting.js";
import { createSky } from "./engine/createSky.js";
import { createLoop } from "./engine/loop.js";
import { createRegistry } from "./engine/registry.js";
import { setupResize } from "./engine/resize.js";
import { Logger } from "./utils/logger.js";

// ===== Simplified ECS data =====
function makeEntity(object3D, components) {
  return { id: crypto.randomUUID(), object3D, components };
}

// Components
function makeTransform({ x=0, y=0, z=0, yaw=0, pitch=0, roll=0 } = {}) {
  return { position: { x, y, z }, rotation: { yaw, pitch, roll } };
}
function makeInputMove() { return { forward: 0, strafe: 0 }; }
function makeLocomotion({ speed=5, turnRate=Math.PI } = {}) { return { speed, turnRate }; }

// ===== World bootstrapping =====
const canvas = document.getElementById("app");
const renderer = createRenderer({ canvas });
const scene = createScene();
const camera = createCamera({ aspect: window.innerWidth / window.innerHeight, position: { x: 0, y: 4, z: 8 } });

addBasicLighting(scene);
createSky(scene);
createGround(scene, { size: 300, color: 0x6b6b6b });

const registry = createRegistry();

// Placeholder tank: a box with shadows
const tankMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.8, 2.2),
  new THREE.MeshStandardMaterial({ color: 0x3aa3ff })
);
tankMesh.castShadow = true;
tankMesh.receiveShadow = false;
scene.add(tankMesh);

const tank = makeEntity(tankMesh, {
  Transform: makeTransform({ y: 0.4 }),
  InputMove: makeInputMove(),
  Locomotion: makeLocomotion()
});
registry.add(tank);

// ===== Input handling =====
const keys = new Set();
window.addEventListener("keydown", (e) => { keys.add(e.key.toLowerCase()); });
window.addEventListener("keyup",   (e) => { keys.delete(e.key.toLowerCase()); });

// ===== Systems (dt, world, registry) =====
function movementInputSystem(dt, world, registry) {
  for (const e of registry.with("InputMove")) {
    const input = e.components.InputMove;
    input.forward = (keys.has("w") ? 1 : 0) + (keys.has("s") ? -1 : 0);
    input.strafe  = (keys.has("d") ? 1 : 0) + (keys.has("a") ? -1 : 0);
  }
}

function movementTransformationSystem(dt, world, registry) {
  for (const e of registry.with("Locomotion")) {
    const transform = e.components.Transform;
    const input = e.components.InputMove;
    const loco = e.components.Locomotion;

    // Turning is derived from strafe (A/D) for simplicity
    const turn = input.strafe * loco.turnRate * dt;
    transform.rotation.yaw += turn;

    // Forward/back along tank's facing
    const forward = input.forward * loco.speed * dt;
    const dirX = Math.sin(transform.rotation.yaw);
    const dirZ = Math.cos(transform.rotation.yaw);
    transform.position.x += dirX * forward;
    transform.position.z += dirZ * forward;
  }
}

function transformApplySystem(dt, world, registry) {
  for (const e of registry.with("Transform")) {
    const t = e.components.Transform;
    const o = e.object3D;
    o.position.set(t.position.x, t.position.y, t.position.z);
    o.rotation.set(t.rotation.pitch, t.rotation.yaw, t.rotation.roll);
  }
}

function cameraFollowSystem(dt, world, registry) {
  // Simple follow from behind the first entity with Transform
  const e = registry.with("Transform")[0];
  if (!e) return;
  const t = e.components.Transform;
  const dist = 6, height = 3;
  const behindX = t.position.x - Math.sin(t.rotation.yaw) * dist;
  const behindZ = t.position.z - Math.cos(t.rotation.yaw) * dist;
  world.camera.position.lerp(new THREE.Vector3(behindX, t.position.y + height, behindZ), Math.min(1, dt * 5));
  world.camera.lookAt(t.position.x, t.position.y, t.position.z);
}

// ===== Loop =====
const loop = createLoop({
  renderer, scene, camera,
  systems: [
    (dt)=>movementInputSystem(dt, { scene, camera, renderer }, registry),
    (dt)=>movementTransformationSystem(dt, { scene, camera, renderer }, registry),
    (dt)=>transformApplySystem(dt, { scene, camera, renderer }, registry),
    (dt)=>cameraFollowSystem(dt, { scene, camera, renderer }, registry),
  ],
});

setupResize({ renderer, camera });
Logger.info("[boot] World initialized. Starting loop…");
loop.start();

// Minimal HUD (top-left) to show state
const hud = document.getElementById("hud-root");
if (hud) {
  const div = document.createElement("div");
  div.className = "hud-badge";
  div.textContent = "W/S: forward/back, A/D: turn | Camera: follow";
  hud.appendChild(div);
}
