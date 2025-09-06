export function createGun({
  recoilKick = 0.03,
  recoilRecover = 8,
  recoilOffset = 0,
  type = "MachineGun",          // "MachineGun" | "Cannon"
  pitch = 0,
  pitchMin = -0.15,
  pitchMax = 0.35,
  pitchSpeed = 1.6,
  fireRate = 10,               // per second
  ammo = 200,
  spreadRad = 0.01,
  muzzleVel = 350,
  cooldown = 0,
} = {}) {
  return { type, pitch, pitchMin, pitchMax, pitchSpeed, fireRate, ammo, spreadRad, muzzleVel, cooldown, recoilKick, recoilRecover, recoilOffset };
}
