import { describe, it, expect } from "vitest";
import { arrowGizmoSystemFactory } from "../src/systems/rendering/arrowGizmoSystem.js";

describe("arrowGizmoSystem", () => {
  it("creates and removes helpers", () => {
    const scene = { children: [], add(o){ this.children.push(o); }, remove(o){ const i=this.children.indexOf(o); if(i>=0) this.children.splice(i,1);} };
    const sys = arrowGizmoSystemFactory(scene);
    const ent = { id: 1, components: { Transform: { position:{x:0,y:0,z:0}, rotation:{yaw:0,pitch:0,roll:0} }, ArrowGizmo: { length: 1.5, headLength:0.3, headWidth:0.2, color:0xffaa00, visible:true } } };
    const registry = {
      _arr: [ent],
      query(){ return this._arr; },
      getById(id){ return this._arr.find(e => e.id===id); }
    };
    sys(0.016, {}, registry);
    expect(scene.children.length).toBe(1);
    // remove component -> should cleanup
    registry._arr = [];
    sys(0.016, {}, registry);
    expect(scene.children.length).toBe(0);
  });
});
