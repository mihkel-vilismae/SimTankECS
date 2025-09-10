import * as THREE from "three";
import { VFX_PRESETS } from "../../vfx/presets.js";
import { getPools } from "../../vfx/runtimePools.js";
import { Logger } from "../../utils/logger.js";

function rand(a,b){ return a + Math.random()*(b-a); }
function choose(n){ return Math.max(1, Math.floor(n)); }

export function vfxSpawnSystem(dt, world, registry) {
  if (!world.vfxQueue || world.vfxQueue.length === 0) return;
  const scene = world.scene;
  const pools = getPools(scene);

  world.vfxActive = world.vfxActive || [];

  const queue = world.vfxQueue.splice(0);
  const presetEvents = [];
  for (const evt of queue) {
    if (evt && evt.kind === 'BALL_GROW') {
      const geom = new THREE.SphereGeometry(evt.size0 || 0.15, 16, 12);
      const mat  = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      scene.add(mesh);
      world.vfxActive.push({ kind:'ballGrow', obj: mesh, t: 0, life: (evt.life || 10.0), size0: (evt.size0 || 0.15), size1: (evt.size1 || 3.5) });
    } else if (evt && evt.preset) {
      presetEvents.push(evt);
    }
  }
  if (presetEvents.length === 0) return;
  for (const evt of presetEvents) {
    const p = VFX_PRESETS[evt.preset];
    if (!p) continue;

    // Flash sprites
    if (p.flash) {
      const count = choose(p.flash.sprites || 1);
      for (let i=0;i<count;i++){
        const s = pools.flash.get();
        s.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        s.material.color.setHex(p.flash.color || 0xffffff);
        const size = rand(p.flash.size[0], p.flash.size[1]);
        s.scale.set(size, size, size);
        world.vfxActive.push({ kind:"flash", obj:s, t:0, life:p.flash.life || 0.06, size0:size });
      }
    }

    // Light
    if (p.light) {
      const l = pools.light.get();
      l.color.setHex(0xfff2c0);
      l.intensity = p.light.intensity || 2;
      l.distance = p.light.radius || 3;
      l.decay = p.light.decay || 2;
      l.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      world.vfxActive.push({ kind:"light", obj:l, t:0, life:p.light.life || 0.06, i0:l.intensity });
    }

    // Smoke
    if (p.smoke) {
      const c = choose(p.smoke.count || 8);
      for (let i=0;i<c;i++){
        const s = pools.smoke.get();
        s.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        const size = rand(p.smoke.size[0], p.smoke.size[1]);
        s.scale.set(size, size, size);
        s.material.color.setHex(0x999999);
        const life = rand(p.smoke.life[0], p.smoke.life[1]);
        const drift = rand(p.smoke.drift[0], p.smoke.drift[1]);
        const upward = p.smoke.upward || 0.5;
        const v = new THREE.Vector3(evt.forward.x, evt.forward.y, evt.forward.z).multiplyScalar(0.5);
        v.x += (Math.random()-0.5)*drift;
        v.z += (Math.random()-0.5)*drift;
        v.y += upward;
        world.vfxActive.push({ kind:"smoke", obj:s, t:0, life, size0:size, vel:v, alpha:1 });
      }
    }

    // Sparks
    if (p.sparks) {
      const c = choose(p.sparks.count || 8);
      const spread = p.sparks.spread || 0.3;
      for (let i=0;i<c;i++){
        const m = pools.sparks.get();
        m.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        const spd = rand(p.sparks.speed[0], p.sparks.speed[1]);
        const life = rand(p.sparks.life[0], p.sparks.life[1]);
        const dir = new THREE.Vector3(
          evt.forward.x + (Math.random()-0.5)*spread,
          Math.max(-0.2, evt.forward.y + (Math.random()-0.5)*spread),
          evt.forward.z + (Math.random()-0.5)*spread
        ).normalize();
        const vel = dir.multiplyScalar(spd);
        world.vfxActive.push({ kind:"spark", obj:m, t:0, life, vel, g: (p.sparks.gravity || -9.8) });
      }
    }

    // Shock ring (optional)
    if (p.shock?.enabled) {
      const ring = getPools(scene).shock.get();
      ring.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      const life = p.shock.life || 0.06;
      world.vfxActive.push({ kind:"ring", obj:ring, t:0, life, r0:0.1, r1:p.shock.radius || 1.0 });
    }
  }
  Logger.info("[vfxSpawnSystem] spawned", { count: queue.length });
}
