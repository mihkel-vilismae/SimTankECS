export function createTurret({ yaw = 0, yawSpeed = 1.8, yawMin = -Math.PI, yawMax = Math.PI } = {}) {
  return { yaw, yawSpeed, yawMin, yawMax };
}
