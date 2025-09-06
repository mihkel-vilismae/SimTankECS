import * as THREE from "three";
import { createTransform } from "../components/transform.js";
import { createInputMove, createLocomotion } from "../components/motion.js";
import { createArrowGizmo } from "../components/arrowGizmo.js";
import { createHardpoints, createMount } from "../components/hardpoints.js";
import { createTurret } from "../components/turret.js";
import { createGun } from "../components/gun.js";

/** Creates a hull, a turret mounted on the hull, and two guns mounted on the turret. */
export function createTank(registry, scene) {
  // HULL (blue box)
  const hullMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x3388ff })
  );
  hullMesh.castShadow = true;
  hullMesh.position.y = 0.5;

  const hull = {
    id: registry.nextId(),
    object3D: hullMesh,
    components: {
      Transform: createTransform(0, 0.5, 0, 0, 0, 0),
      InputMove: createInputMove(),
      Locomotion: createLocomotion(4.0, 2.0),
      ArrowGizmo: createArrowGizmo({ length: 2.0 }),
      Hardpoints: createHardpoints([
        { id: "hp_turret", localPos: { x:0, y:0.5, z:0 }, localYaw: 0, localPitch: 0 }
      ]),
    },
  };
  registry.add(hull);
  if (scene) scene.add(hull.object3D);

  // TURRET (dark gray disc)
  const turretMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  turretMesh.castShadow = true;

  const turret = {
    id: registry.nextId(),
    object3D: turretMesh,
    components: {
      Transform: createTransform(0, 0.9, 0, 0, 0, 0),
      Turret: createTurret({ yawSpeed: 2.0 }),
      Mount: createMount({ parent: hull.id, slotId: "hp_turret" }),
      Hardpoints: createHardpoints([
        { id: "hp_mg", localPos: { x: 0.35, y: 0.10, z: 0.35 }, localYaw: 0 },
        { id: "hp_cannon", localPos: { x: 0.0, y: 0.10, z: 0.45 }, localYaw: 0 },
      ]),
    },
  };
  registry.add(turret);
  if (scene) scene.add(turret.object3D);

  // MACHINE GUN (small barrel + receiver)
  const mgGroup = new THREE.Group();
  const mgBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  mgBarrel.rotation.x = Math.PI / 2;
  mgBarrel.position.z = 0.25;
  const mgBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.1, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  mgBody.position.z = 0.05;
  mgGroup.add(mgBarrel, mgBody);

  const mg = {
    id: registry.nextId(),
    object3D: mgGroup,
    components: {
      Transform: createTransform(0, 1.0, 0, 0, 0, 0),
      Gun: createGun({ type: "MachineGun", fireRate: 12, ammo: 300, spreadRad: 0.02, muzzleVel: 450, recoilKick: 0.02, recoilRecover: 22, recoilMax: 0.15 , recoilImpulseScale: 60 } ),
      Mount: createMount({ parent: turret.id, slotId: "hp_mg" }),
    },
  };
  registry.add(mg);
  if (scene) scene.add(mg.object3D);

  // CANNON (long barrel + muzzle brake)
  const cannonGroup = new THREE.Group();
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x666666 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.6;
  const muzzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.z = 1.2;
  cannonGroup.add(barrel, muzzle);

  const cannon = {
    id: registry.nextId(),
    object3D: cannonGroup,
    components: {
      Transform: createTransform(0, 1.0, 0, 0, 0, 0),
      Gun: createGun({ type: "Cannon", fireRate: 0.5, ammo: 20, spreadRad: 0.002, muzzleVel: 900, pitchMin: -0.05, pitchMax: 0.25, recoilKick: 0.08, recoilRecover: 14, recoilMax: 0.35 , recoilImpulseScale: 120 } ),
      Mount: createMount({ parent: turret.id, slotId: "hp_cannon" }),
    },
  };
  registry.add(cannon);
  if (scene) scene.add(cannon.object3D);

  return hull;
}
