import { createCityClassifier } from "./cityPlanner.js";
import * as THREE from "three";
import { Building } from "../../components/building.js";
import { Collider } from "../../components/collider.js";
import { computeObjectAABB, expandHalf } from "../../utils/aabb.js";
function rand(a,b){ return a + Math.random()*(b-a); }
function choose(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
const COLORS=[0x9aa4ad,0xbfc7cf,0x8f9aa6,0xcccccc,0xdedede,0xa79f8e,0x6f7c85];
export function buildingSpawnSystem(dt, world, registry){
  if(world._buildingsSpawned) return;
  const scene=world.scene; if(!scene||!registry) return;
  const R=world.worldRadius ?? 220; const count=world.buildingCount ?? 24; const classify = (world.cityLayoutEnabled? createCityClassifier({ blockSize: world.cityBlockSize||16, roadWidth: world.cityRoadWidth||4, radius:R, noBuildZones: world.noBuildZones||[] }): null);
  for(let i=0;i<count;i++){
    const x=Math.round(rand(-R,R)/2)*2, z=Math.round(rand(-R,R)/2)*2;
    if(Math.hypot(x,z)<12) continue; if(classify){ const kind=classify(x,z); if(kind!=="buildable") continue; }
    const baseW=Math.round(rand(1,3)); const baseD=Math.round(rand(1,3)); const floors=Math.round(rand(2,7));
    const group=new THREE.Group();
    const mat=new THREE.MeshStandardMaterial({ color: choose(COLORS), roughness:0.9, metalness:0.05 });
    const s=1.5;
    for(let fx=0;fx<baseW;fx++){ for(let fz=0;fz<baseD;fz++){ for(let fy=0;fy<floors;fy++){ const geom=new THREE.BoxGeometry(s,s,s); const mesh=new THREE.Mesh(geom,mat); mesh.castShadow=mesh.receiveShadow=true; mesh.position.set((fx-(baseW-1)/2)*s,(fy+0.5)*s,(fz-(baseD-1)/2)*s); group.add(mesh);} } }
    group.position.set(x,0,z); scene.add(group);
    const e = { id: registry.nextId(), components: {} }; registry.add(e); registry.addComponent(e,"Building",Building({ maxHp: 200+Math.floor(rand(0,300)) }));
    registry.addComponent(e,"Transform",{ position:{x,y:0,z}, rotation:{yaw:0,pitch:0,roll:0}, scale:{x:1,y:1,z:1} });
    e.object3D=group;
  }
  world._buildingsSpawned=true;
}
