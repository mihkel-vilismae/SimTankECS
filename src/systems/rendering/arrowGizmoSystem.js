import * as THREE from "three";
import { Logger } from "../../utils/logger.js";
import { yawToForward } from "../../utils/math3d.js";

export function arrowGizmoSystemFactory(scene) {
  const helpers = new Map();
  Logger.info("[arrowGizmoSystem] init");

  function disposeHelper(helper) {
    try {
      if (helper?.line) {
        helper.line.geometry?.dispose?.();
        helper.line.material?.dispose?.();
      }
      if (helper?.cone) {
        helper.cone.geometry?.dispose?.();
        helper.cone.material?.dispose?.();
      }
    } catch {}
  }

  return function arrowGizmoSystem(dt, world, registry) {
    for (const ent of registry.query(["Transform", "ArrowGizmo"])) {
      const { Transform: t, ArrowGizmo: a } = ent.components;
      const origin = new THREE.Vector3(t.position.x, t.position.y, t.position.z);
      const fwd = yawToForward(t.rotation.yaw);
      const dir = new THREE.Vector3(fwd.x, 0, fwd.z).normalize();

      let helper = helpers.get(ent.id);
      if (!helper) {
        helper = new THREE.ArrowHelper(dir, origin, a.length, a.color, a.headLength, a.headWidth);
        helper.userData = { isGizmo: true };
        scene.add(helper);
        helpers.set(ent.id, helper);
        Logger.info("[arrowGizmoSystem] created helper", { id: ent.id });
      } else {
        helper.visible = a.visible;
        helper.position.copy(origin);
        helper.setDirection(dir);
        helper.setLength(a.length, a.headLength, a.headWidth);
      }
    }

    // cleanup
    for (const [id, helper] of helpers) {
      const ent = registry.getById?.(id);
      const has = !!ent && !!ent.components?.Transform && !!ent.components?.ArrowGizmo;
      if (!has) {
        scene.remove(helper);
        disposeHelper(helper);
        helpers.delete(id);
        Logger.info("[arrowGizmoSystem] removed helper", { id });
      }
    }
  };
}
