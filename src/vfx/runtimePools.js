import * as THREE from "three";
import { createPool } from "./pool.js";

let _pools = null;

function createSpriteMaterial(color=0xffffff, additive=false) {
  const mat = new THREE.SpriteMaterial({ color, depthWrite: false, transparent: true, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
  return mat;
}

function makeFlashSprite() {
  const s = new THREE.Sprite(createSpriteMaterial(0xffffff, true));
  s.visible = false;
  return s;
}
function makeSmokeSprite() {
  const s = new THREE.Sprite(createSpriteMaterial(0x888888, false));
  s.visible = false;
  return s;
}
function makeSpark() {
  const g = new THREE.SphereGeometry(0.01, 6, 6);
  const m = new THREE.MeshBasicMaterial({ color: 0xffd070 });
  const mesh = new THREE.Mesh(g, m);
  mesh.visible = false;
  return mesh;
}
function makeShockRing() {
  const g = new THREE.RingGeometry(0.1, 0.12, 16);
  const m = new THREE.MeshBasicMaterial({ color: 0xfff3c0, side: THREE.DoubleSide, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
  const mesh = new THREE.Mesh(g, m);
  mesh.visible = false;
  return mesh;
}

export function getPools(scene) {
  if (_pools) return _pools;
  const flash = createPool(makeFlashSprite, 32, s => { s.visible = true; }, s => { s.visible = false; });
  const smoke = createPool(makeSmokeSprite, 64, s => { s.visible = true; }, s => { s.visible = false; });
  const sparks = createPool(makeSpark, 64, s => { s.visible = true; }, s => { s.visible = false; });
  const shock = createPool(makeShockRing, 8, s => { s.visible = true; }, s => { s.visible = false; });
  const light = createPool(() => { const l = new THREE.PointLight(0xfff1c0, 0, 0, 2); l.visible=false; return l; }, 12, l=>{l.visible=true;}, l=>{l.visible=false;});
  // attach to scene
  for (const p of [flash, smoke, sparks, shock, light]) {
    for (const o of p.all) scene.add(o);
  }
  _pools = { flash, smoke, sparks, shock, light };
  return _pools;
}
