import { vi } from "vitest";

class Vector3 {
  constructor(x=0,y=0,z=0){ this.x=x; this.y=y; this.z=z; }
  copy(v){ this.x=v.x; this.y=v.y; this.z=v.z; return this; }
  set(x,y,z){ this.x=x; this.y=y; this.z=z; return this; }
  normalize(){ const l=Math.hypot(this.x,this.y,this.z)||1; this.x/=l; this.y/=l; this.z/=l; return this; }
}
class ArrowHelper {
  constructor(dir, origin, length, color, headLength, headWidth){
    this.position = new Vector3(origin.x, origin.y, origin.z);
    this.dir = dir;
    this.length = length;
    this.color = color;
    this.headLength = headLength;
    this.headWidth = headWidth;
    this.visible = true;
    this.line = { geometry: { dispose(){} }, material: { dispose(){} } };
    this.cone = { geometry: { dispose(){} }, material: { dispose(){} } };
    this.userData = {};
  }
  setDirection(d){ this.dir = d; }
  setLength(l,hl,hw){ this.length=l; this.headLength=hl; this.headWidth=hw; }
}
class Color { constructor(v){ this.v=v; } }
class Scene {
  constructor(){ this.children=[]; }
  add(o){ this.children.push(o); }
  remove(o){ const i=this.children.indexOf(o); if(i>=0) this.children.splice(i,1); }
}
class Mesh {
  constructor(geo, mat){ this.position=new Vector3(); this.rotation={x:0,y:0,z:0}; this.geo=geo; this.mat=mat; this.castShadow=false; }
}
class WebGLRenderer{
  constructor(){}
  setPixelRatio(){} setSize(){} get domElement(){ return {}; }
  render(){}
  get shadowMap(){ return { enabled: false, set enabled(v){} }; }
}
class PerspectiveCamera{
  constructor(){ this.position = new Vector3(); this.aspect=1; }
  updateProjectionMatrix(){} lookAt(){}
}
class PlaneGeometry{ constructor(w,h){ this.w=w; this.h=h; } }
class MeshStandardMaterial{ constructor(o){ this.o=o; } }
class SphereGeometry{ constructor(){} }
class MeshBasicMaterial{ constructor(o){ this.o=o; } }
const BackSide = "BackSide";
class BoxGeometry{ constructor(){} }

vi.mock("three", () => ({
  default: {},
  Vector3,
  ArrowHelper,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  PlaneGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  MeshBasicMaterial,
  BackSide,
  Mesh,
  Color,
  BoxGeometry,

class Ray {
  constructor(){ this.origin = new Vector3(); this.direction = new Vector3(0,0,1); }
  // intersect plane y=0: if direction.y == 0 => no hit; t = -origin.y / dir.y
  intersectPlane(plane, out){
    // plane is defined by normal (0,1,0) and constant (0) in our usage
    if (Math.abs(this.direction.y) < 1e-6) return null;
    const t = -this.origin.y / this.direction.y;
    if (t < 0) return null;
    out.x = this.origin.x + this.direction.x * t;
    out.y = this.origin.y + this.direction.y * t;
    out.z = this.origin.z + this.direction.z * t;
    return out;
  }
}
class Plane {
  constructor(normal, constant){ this.normal = normal; this.constant = constant; }
}
class Raycaster {
  constructor(){ this.ray = new Ray(); }
  setFromCamera(ndc, camera){
    // Very rough mock: map NDC to a ray starting at camera position towards forward Z
    this.ray.origin.set(camera.position.x, camera.position.y, camera.position.z);
    // Map ndc to a simple direction; ensure y negative points downward on screen
    this.ray.direction.set(ndc.x, -ndc.y, 1).normalize();
  }
}

return {
  default: {},
  Vector3,
  ArrowHelper,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  PlaneGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  MeshBasicMaterial,
  BackSide,
  Mesh,
  Color,
  BoxGeometry,
  Raycaster,
  Plane,
};
}));
