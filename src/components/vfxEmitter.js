export function createVfxEmitter({
  preset = "MG_MUZZLE",
  localPos = { x: 0, y: 0.10, z: 0.55 },
  localYaw = 0, localPitch = 0, localRoll = 0,
} = {}) {
  return { preset, localPos, localYaw, localPitch, localRoll };
}
