// src/systems/vfx/ProjectileVFXSystem.js
// Signature: factory(scene) -> system(dt, world, registry)
// Stylized-realistic projectile VFX: explosions, sparks, smoke, tracers, muzzle flashes.
// No external deps beyond three.js.

import {
  AdditiveBlending,
  Color,
  Group,
  NearestFilter,
  Sprite,
  SpriteMaterial,
  Texture,
  Vector3
} from 'three';

const V3 = (x=0,y=0,z=0)=>new Vector3(x,y,z);
const clamp01 = (v)=>Math.max(0,Math.min(1,v));
const rand = (min,max)=>Math.random()*(max-min)+min;

function colorHexToThree(c) { return new Color(c || 0xffffff); }

function makeSoftCircleTexture(size=96) {
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext('2d');
  const r = size*0.48;
  const cx = size/2, cy = size/2;
  const grad = ctx.createRadialGradient(cx,cy,0, cx,cy,r);
  grad.addColorStop(0.0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.fill();
  const tex = new Texture(cvs);
  tex.needsUpdate = true;
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;
  return tex;
}

class Pool {
  constructor(createFn) { this.createFn = createFn; this.free = []; this.live = new Set(); }
  obtain(){ const o=this.free.pop()||this.createFn(); this.live.add(o); o.visible=true; return o; }
  release(o){ this.live.delete(o); this.free.push(o); }
}

function makeAdditiveSprite(map, color=0xffffff){
  return new Sprite(new SpriteMaterial({ map, color, depthWrite:false, depthTest:true, transparent:true, blending:AdditiveBlending }));
}
function makeAlphaSprite(map, color=0xffffff, opacity=1){
  return new Sprite(new SpriteMaterial({ map, color, depthWrite:false, depthTest:true, transparent:true, opacity }));
}

function createFlash(tex){
  const s = makeAdditiveSprite(tex, 0xffffff);
  s.life=0; s.maxLife=0.06+Math.random()*0.04; s.scale.setScalar(0.5+Math.random()*0.4);
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife); const k=1.0-t;
    this.scale.setScalar(2.0+6.0*t); this.material.opacity=k; return this.life<this.maxLife;
  };
  return s;
}
function createShockwave(tex, tint=0xffe4b5){
  const s = makeAlphaSprite(tex, tint, 0.9);
  s.life=0; s.maxLife=0.45+Math.random()*0.2; s.scale.setScalar(0.2);
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife);
    this.scale.setScalar(0.2+6.0*t); this.material.opacity=0.9*(1.0-t); return this.life<this.maxLife;
  };
  return s;
}
function createFireball(tex, col=0xffaa55){
  const s = makeAdditiveSprite(tex, col);
  s.life=0; s.maxLife=0.35+Math.random()*0.25; s.scale.setScalar(0.6+Math.random()*0.4);
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife);
    const warm=new Color(0xffe38a), cool=new Color(0xff6a3c);
    s.material.color.copy(warm).lerp(cool, t);
    this.scale.setScalar(0.6+3.0*t); this.material.opacity=(1.0-t)*0.95; return this.life<this.maxLife;
  };
  return s;
}
function createSmoke(tex, tint=0x8a8f99){
  const s = makeAlphaSprite(tex, tint, 0.9);
  s.life=0; s.maxLife=1.8+Math.random()*1.2; s.scale.setScalar(0.8+Math.random()*0.5);
  s.vel=V3(rand(-0.2,0.2), rand(0.7,1.4), rand(-0.2,0.2));
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife);
    this.position.addScaledVector(this.vel, dt);
    this.rotation.z += dt * rand(-0.8,0.8);
    this.scale.multiplyScalar(1+dt*0.9);
    this.material.opacity=(1.0-t)*(0.9-0.4*t);
    const dark=new Color(0x5d6169), light=new Color(0xb8bdc7);
    s.material.color.copy(dark).lerp(light, t); return this.life<this.maxLife;
  };
  return s;
}
function createSpark(tex, tint=0xffcc77){
  const s = makeAdditiveSprite(tex, tint);
  s.life=0; s.maxLife=0.6+Math.random()*0.5; s.scale.setScalar(0.12+Math.random()*0.08);
  s.vel=V3(rand(-6,6), rand(3,10), rand(-6,6));
  s.update=function(dt, groundY=0){
    this.life+=dt; this.vel.y -= 9.8*1.2*dt; this.position.addScaledVector(this.vel, dt);
    if (this.position.y < groundY){ this.position.y=groundY; this.vel.y*=-0.25; this.vel.multiplyScalar(0.55); }
    const t=clamp01(this.life/this.maxLife);
    this.material.opacity=(1.0-t);
    const length=0.4+1.2*(1.0-t); this.scale.set(length*0.12, length*0.35, 1);
    return this.life<this.maxLife;
  };
  return s;
}
function createTracer(tex, color=0xff5533){
  const s = makeAdditiveSprite(tex, color);
  s.life=0; s.maxLife=0.12+Math.random()*0.08; s.scale.set(0.1,0.6,1);
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife);
    this.material.opacity=0.9*(1.0-t); this.scale.y = 0.6 + 1.8*t; return this.life<this.maxLife;
  };
  return s;
}
function createMuzzleSmoke(tex, tint=0x9aa2ad){
  const s = makeAlphaSprite(tex, tint, 0.8);
  s.life=0; s.maxLife=0.8+Math.random()*0.4; s.scale.setScalar(0.25+Math.random()*0.15);
  s.vel=V3(rand(-0.2,0.2), rand(0.4,0.8), rand(-0.2,0.2));
  s.update=function(dt){
    this.life+=dt; const t=clamp01(this.life/this.maxLife);
    this.position.addScaledVector(this.vel, dt); this.scale.multiplyScalar(1+dt*1.2);
    this.material.opacity=(1.0-t)*0.6; return this.life<this.maxLife;
  };
  return s;
}

export default function ProjectileVFXSystem(scene){
  const root = new Group(); root.name='ProjectileVFXRoot'; scene.add(root);
  const softTex = makeSoftCircleTexture(96);

  const poolFlash = new Pool(()=>{ const o=createFlash(softTex); root.add(o); return o; });
  const poolShock = new Pool(()=>{ const o=createShockwave(softTex); root.add(o); return o; });
  const poolFire  = new Pool(()=>{ const o=createFireball(softTex); root.add(o); return o; });
  const poolSmoke = new Pool(()=>{ const o=createSmoke(softTex); root.add(o); return o; });
  const poolSpark = new Pool(()=>{ const o=createSpark(softTex); root.add(o); return o; });
  const poolTracer= new Pool(()=>{ const o=createTracer(softTex); root.add(o); return o; });
  const poolMuzz  = new Pool(()=>{ const o=createMuzzleSmoke(softTex); root.add(o); return o; });

  function ensureQueue(world){
    if (!world.vfxQueue) world.vfxQueue = [];
    if (!world.vfx){
      world.vfx = {
        explosion: (pos, normal = V3(0,1,0), power=1, color='#ffcc66') =>
          world.vfxQueue.push({ kind:'explosion', pos, normal, power, color }),
        tracer: (pos, dir, color='#ff5533') =>
          world.vfxQueue.push({ kind:'tracer', pos, dir, color }),
        muzzleFlash: (pos, dir, power=1, color='#ffd18a') =>
          world.vfxQueue.push({ kind:'muzzleFlash', pos, dir, power, color }),
        impactSparks: (pos, normal=V3(0,1,0), count=18, color='#ffc877') =>
          world.vfxQueue.push({ kind:'sparks', pos, normal, count, color }),
        smokePuff: (pos, count=6, tint='#8a8f99') =>
          world.vfxQueue.push({ kind:'smokePuff', pos, count, tint })
      };
    }
  }

  function spawnExplosion(e){
    const p = new Vector3(e.pos.x, e.pos.y, e.pos.z);
    const n = e.normal ? new Vector3(e.normal.x, e.normal.y, e.normal.z).normalize() : V3(0,1,0);
    const power = e.power ?? 1; const tint = colorHexToThree(e.color || '#ffcc66');
    const flash = poolFlash.obtain(); flash.position.copy(p); flash.material.color.set(0xffffff);
    const sh = poolShock.obtain(); sh.position.copy(p); sh.material.color.copy(tint);
    const fireCount = Math.floor(3+3*power);
    for (let i=0;i<fireCount;i++){ const f=poolFire.obtain(); f.position.copy(p).addScaledVector(n, rand(0.0,0.2*power)); f.material.color.copy(tint); f.scale.multiplyScalar(rand(0.8,1.6)*power); }
    const smokeCount = Math.floor(6+8*power);
    for (let i=0;i<smokeCount;i++){ const s=poolSmoke.obtain(); s.position.copy(p).add(V3(rand(-0.4,0.4), rand(0.0,0.2), rand(-0.4,0.4))); s.scale.multiplyScalar(rand(0.8,1.5)*Math.sqrt(power)); }
    const sparkCount = Math.floor(12+22*power);
    for (let i=0;i<sparkCount;i++){ const sp=poolSpark.obtain(); sp.position.copy(p).add(V3(rand(-0.1,0.1), rand(0,0.1), rand(-0.1,0.1))); sp.material.color.set(tint);
      const tangent = V3(rand(-1,1),0,rand(-1,1)).normalize().multiplyScalar(rand(3,9)*power); tangent.y = rand(4,10)*power; sp.vel.copy(tangent); }
  }
  function spawnTracer(e){
    if (!e.pos || !e.dir) return;
    const p=new Vector3(e.pos.x,e.pos.y,e.pos.z);
    const t=poolTracer.obtain(); t.position.copy(p); t.material.color.set(colorHexToThree(e.color||'#ff5533'));
    if (Math.random()<0.25){ const s=poolSmoke.obtain(); s.position.copy(p); s.scale.multiplyScalar(0.4); s.maxLife*=0.65; }
  }
  function spawnMuzzleFlash(e){
    const p=new Vector3(e.pos.x,e.pos.y,e.pos.z);
    const power=e.power??1; const tint=colorHexToThree(e.color||'#ffd18a');
    for (let i=0;i<2;i++){ const f=poolFlash.obtain(); f.position.copy(p); f.material.color.copy(tint); f.scale.multiplyScalar(0.8+i*0.4*power); }
    const sCount=Math.floor(6+4*power);
    for (let i=0;i<sCount;i++){ const sp=poolSpark.obtain(); sp.position.copy(p); sp.material.color.copy(tint);
      const spread=V3(rand(-0.5,0.5), rand(-0.2,0.2), rand(1.5,3.0)).multiplyScalar(2.0*power); sp.vel.copy(spread); sp.maxLife*=0.6; }
    const mCount=Math.floor(3+2*power);
    for (let i=0;i<mCount;i++){ const m=poolMuzz.obtain(); m.position.copy(p).add(V3(rand(-0.05,0.05), rand(-0.02,0.02), rand(-0.05,0.05))); m.scale.multiplyScalar(0.8+0.4*power); }
  }
  function spawnSparks(e){
    const p=new Vector3(e.pos.x,e.pos.y,e.pos.z);
    const n=e.normal ? new Vector3(e.normal.x,e.normal.y,e.normal.z).normalize():V3(0,1,0);
    const tint=colorHexToThree(e.color||'#ffc877'); const count=e.count??18;
    for (let i=0;i<count;i++){ const sp=poolSpark.obtain(); sp.position.copy(p); sp.material.color.copy(tint);
      const tangent=V3(rand(-1,1),0,rand(-1,1)).normalize().multiplyScalar(rand(3,9)); tangent.y=rand(2,8); sp.vel.copy(tangent); }
    const d=poolSmoke.obtain(); d.position.copy(p).addScaledVector(n,0.02); d.scale.multiplyScalar(0.4); d.maxLife*=0.6;
  }
  function spawnSmokePuff(e){
    const p=new Vector3(e.pos.x,e.pos.y,e.pos.z); const count=e.count??6; const tint=colorHexToThree(e.tint||'#8a8f99');
    for (let i=0;i<count;i++){ const s=poolSmoke.obtain(); s.position.copy(p).add(V3(rand(-0.2,0.2), rand(0.0,0.1), rand(-0.2,0.2)));
      s.material.color.copy(tint); s.scale.multiplyScalar(rand(0.6,1.1)); }
  }

  return function ProjectileVFXSystem_dt_world_registry(dt, world, registry){
    ensureQueue(world);
    const q = world.vfxQueue;
    if (q.length){
      for (let i=0;i<q.length;i++){
        const e=q[i];
        switch(e.kind){
          case 'explosion': spawnExplosion(e); break;
          case 'tracer': spawnTracer(e); break;
          case 'muzzleFlash': spawnMuzzleFlash(e); break;
          case 'sparks': spawnSparks(e); break;
          case 'smokePuff': spawnSmokePuff(e); break;
        }
      }
      q.length=0;
    }
    const groundY = (world.physics && world.physics.groundY) || 0;
    const toRecycle=[];
    function step(pool){ pool.live.forEach(o=>{ const alive=o.update?o.update(dt, groundY):false; if(!alive) toRecycle.push([pool,o]); }); }
    [poolFlash,poolShock,poolFire,poolSmoke,poolSpark,poolTracer,poolMuzz].forEach(step);
    for (const [pool,o] of toRecycle){ o.visible=false; o.position.set(0,-9999,0); if (o.material) o.material.opacity=0; pool.release(o); }
  };
}
