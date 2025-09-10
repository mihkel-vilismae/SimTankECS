import { movementInputSystem } from "../systems/input/movementInputSystem.js";
import { flyInputSystem } from "../systems/input/flyInputSystem.js";
import { movementTransformationSystem } from "../systems/motion/movementTransformationSystem.js";
import { flyMovementSystem } from "../systems/motion/flyMovementSystem.js";
import { transformApplySystem } from "../systems/motion/transformApplySystem.js";
import { mouseRaycastSystem } from "../systems/perception/mouseRaycastSystem.js";
import { lookAtMouseSystem } from "../systems/perception/lookAtMouseSystem.js";
import { lookAtTargetSystem } from "../systems/camera/lookAtTargetSystem.js";
import { createOrbitControlsSystem } from "../systems/camera/orbitControlsSystem.js";
import { cameraFollowSystem } from "../systems/camera/cameraFollowSystem.js";
import { cameraFollowGunSystem } from "../systems/camera/cameraFollowGunSystem.js";
import { arrowGizmoSystemFactory } from "../systems/rendering/arrowGizmoSystem.js";
import { healthSystem } from "../systems/combat/healthSystem.js";
import { autoHealthAttachSystem } from "../systems/combat/autoHealthAttachSystem.js";
import { buildingSpawnSystem } from "../systems/world/buildingSpawnSystem.js";
import { crosshairSystem } from "../systems/rendering/crosshairSystem.js";
import { hardpointMountSystem } from "../systems/attachment/hardpointMountSystem.js";
import { turretAimingSystem } from "../systems/aim/turretAimingSystem.js";
import { weaponElevationSystem } from "../systems/aim/weaponElevationSystem.js";
import { weaponInputSystem } from "../systems/weapons/weaponInputSystem.js";
import { weaponSelectionSystem } from "../systems/weapons/weaponSelectionSystem.js";
import { weaponFireEventSystem } from "../systems/weapons/weaponFireEventSystem.js";
import { vfxSpawnSystem } from "../systems/vfx/vfxSpawnSystem.js";
import { vfxUpdateSystem } from "../systems/vfx/vfxUpdateSystem.js";
import { weaponRecoilSystem } from "../systems/weapons/weaponRecoilSystem.js";

// NEW projectile systems
import { projectileSpawnFromVfxQueueSystem } from "../systems/weapons/projectileSpawnFromVfxQueueSystem.js";
import { projectileFlightSystem } from "../systems/projectiles/projectileFlightSystem.js";
import { lifespanSystem } from "../systems/projectiles/lifespanSystem.js";
import { tracerRenderSystem } from "../systems/projectiles/tracerRenderSystem.js";
import { colliderDebugSystem } from "../systems/debug/colliderDebugSystem.js";
import { autoColliderAttachSystem } from "../systems/physics/autoColliderAttachSystem.js";
import { projectileCollisionSystem } from "../systems/projectiles/projectileCollisionSystem.js";

export function registerSystems({ loop, scene, registry, camera, renderer }) {
  const arrowGizmoSystem = arrowGizmoSystemFactory(scene);

  loop.addSystem(movementInputSystem);        // WASD
  loop.addSystem(flyInputSystem);             // Q/E (+ boost)
  loop.addSystem(movementTransformationSystem);
  loop.addSystem(flyMovementSystem);

  loop.addSystem(weaponSelectionSystem); // cycle weapons
  loop.addSystem(weaponRecoilSystem);  // weapon recoil - Order: after movement, before transform

  // Aiming & mounting happen before we mirror Transforms to object3D
  loop.addSystem(mouseRaycastSystem);
  loop.addSystem(crosshairSystem);            // UI crosshair follows raycast hit
  loop.addSystem(turretAimingSystem);
  loop.addSystem(weaponElevationSystem);
  loop.addSystem(hardpointMountSystem);
  loop.addSystem(buildingSpawnSystem);
  loop.addSystem(autoHealthAttachSystem);
  loop.addSystem(autoColliderAttachSystem);

  // Fire input (ammo/cooldowns)
  loop.addSystem(weaponInputSystem);

  // Convert FireEvent -> VFX queue
  loop.addSystem(weaponFireEventSystem);

  // Spawn projectiles from fire events
  loop.addSystem(projectileSpawnFromVfxQueueSystem);
  // Update projectile flight + lifespans
  loop.addSystem(projectileFlightSystem);
  loop.addSystem(projectileCollisionSystem);
  loop.addSystem(lifespanSystem);
  // --- end Projectiles ---
  // Spawn then update VFX
  loop.addSystem(vfxSpawnSystem);
  loop.addSystem(vfxUpdateSystem);
  loop.addSystem(healthSystem);

  // Render tracers (after VFX updates, before transforms applied)
  loop.addSystem(tracerRenderSystem);

  // Apply transforms to meshes last
  loop.addSystem(transformApplySystem);
  loop.addSystem(colliderDebugSystem);

  // Camera / look systems
  loop.addSystem(lookAtTargetSystem);
  const orbitSystem = createOrbitControlsSystem(camera, (renderer && renderer.domElement) ? renderer.domElement : { addEventListener(){}, removeEventListener(){} });
  loop.addSystem(orbitSystem);         // camera LOOK mode
  loop.addSystem(lookAtMouseSystem);          // face mouse ground
  loop.addSystem(cameraFollowSystem);
  loop.addSystem(cameraFollowGunSystem);
  loop.addSystem(arrowGizmoSystem);
}
