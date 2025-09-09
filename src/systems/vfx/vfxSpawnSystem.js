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

  // Drain queue once
  const initialQueue = world.vfxQueue.splice(0);

  // Handle special custom events immediately; collect preset events separately
  const presetEvents = [];
  for (const evt of initialQueue) {
    if (evt && evt.kind === "BALL_GROW") {
      const geom = new THREE.SphereGeometry(evt.size0 || 0.15, 16, 12);
      const mat  = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      scene.add(mesh);
      world.vfxActive.push({
        kind: "ballGrow", obj: mesh, t: 0,
        life: (evt.life || 10.0),
        size0: (evt.size0 || 0.15),
        size1: (evt.size1 || 3.5),
      });
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
      const count = Math.max(1, Math.floor(p.flash.sprites || 1));
      for (let i = 0; i < count; i++) {
        const s = pools.flash.get();
        s.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        s.material.color.setHex(p.flash.color || 0xffffff);
        const size = (p.flash.size && p.flash.size.length === 2)
          ? (p.flash.size[0] + Math.random() * (p.flash.size[1] - p.flash.size[0]))
          : 0.4;
        s.scale.set(size, size, size);
        world.vfxActive.push({ kind: "flash", obj: s, t: 0, life: p.flash.life || 0.06, size0: size });
      }
    }

    // Light
    if (p.light) {
      const l = pools.light.get();
      l.color.setHex(0xfff2c0);
      l.intensity = p.light.intensity || 2;
      l.distance  = p.light.radius || 3;
      l.decay     = p.light.decay  || 2;
      l.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      world.vfxActive.push({ kind: "light", obj: l, t: 0, life: p.light.life || 0.06, i0: l.intensity });
    }

    // Smoke
    if (p.smoke) {
      const cnt   = Math.max(1, Math.floor(p.smoke.count || 8));
      const life0 = (p.smoke.life && p.smoke.life[0]) || 0.6;
      const life1 = (p.smoke.life && p.smoke.life[1]) || 1.0;
      const size0 = (p.smoke.size && p.smoke.size[0]) || 0.2;
      const size1 = (p.smoke.size && p.smoke.size[1]) || 0.6;
      const drift0= (p.smoke.drift && p.smoke.drift[0]) || 0.2;
      const drift1= (p.smoke.drift && p.smoke.drift[1]) || 0.6;
      const upward= p.smoke.upward || 0.5;

      for (let i = 0; i < cnt; i++) {
        const s = pools.smoke.get();
        s.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        const size = size0 + Math.random() * (size1 - size0);
        s.scale.set(size, size, size);
        s.material.color.setHex(0x999999);
        const life  = life0 + Math.random() * (life1 - life0);
        const drift = drift0 + Math.random() * (drift1 - drift0);
        const v = new THREE.Vector3(evt.forward.x, evt.forward.y, evt.forward.z).multiplyScalar(0.5);
        v.x += (Math.random() - 0.5) * drift;
        v.z += (Math.random() - 0.5) * drift;
        v.y += upward;
        world.vfxActive.push({ kind: "smoke", obj: s, t: 0, life, size0: size, vel: v, alpha: 1 });
      }
    }

    // Sparks
    if (p.sparks) {
      const cnt    = Math.max(1, Math.floor(p.sparks.count || 8));
      const speed0 = (p.sparks.speed && p.sparks.speed[0]) || 3;
      const speed1 = (p.sparks.speed && p.sparks.speed[1]) || 7;
      const life0  = (p.sparks.life  && p.sparks.life[0])  || 0.1;
      const life1  = (p.sparks.life  && p.sparks.life[1])  || 0.25;
      const spread = p.sparks.spread || 0.3;
      const gravity= p.sparks.gravity || -9.8;

      for (let i = 0; i < cnt; i++) {
        const m = pools.sparks.get();
        m.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
        const spd  = speed0 + Math.random() * (speed1 - speed0);
        const life = life0  + Math.random() * (life1  - life0);
        const dir = new THREE.Vector3(
          evt.forward.x + (Math.random() - 0.5) * spread,
          Math.max(-0.2, evt.forward.y + (Math.random() - 0.5) * spread),
          evt.forward.z + (Math.random() - 0.5) * spread
        ).normalize();
        const vel = dir.multiplyScalar(spd);
        world.vfxActive.push({ kind: "spark", obj: m, t: 0, life, vel, g: gravity });
      }
    }

    // Shock ring (optional)
    if (p.shock?.enabled) {
      const ring = getPools(scene).shock.get();
      ring.position.set(evt.worldPos.x, evt.worldPos.y, evt.worldPos.z);
      const life = p.shock.life || 0.06;
      world.vfxActive.push({ kind: "ring", obj: ring, t: 0, life, r0: 0.1, r1: p.shock.radius || 1.0 });
    }
  }

  Logger.info("[vfxSpawnSystem] spawned", { count: presetEvents.length });
}
