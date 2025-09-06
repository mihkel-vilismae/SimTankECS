import { Logger } from "../../utils/logger.js";

export function transformApplySystem(dt, world, registry) {
  for (const ent of registry.query(["Transform"])) {
    const t = registry.getComponent(ent, "Transform");
    if (ent.object3D) {
      ent.object3D.position.set(t.position.x, t.position.y, t.position.z);
      // object3D: x->pitch, y->yaw, z->roll
      ent.object3D.rotation.x = t.rotation.pitch;
      ent.object3D.rotation.y = t.rotation.yaw;
      ent.object3D.rotation.z = t.rotation.roll;
    }
  }
  Logger.info("[transformApplySystem] mirrored Transform -> object3D");
}