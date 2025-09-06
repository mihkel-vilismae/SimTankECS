/** Local +Z forward rotated by yaw (around Y) and pitch (around X in our convention).
 * Pitch < 0 tilts up, so vertical component uses -sin(pitch).
 */
export function muzzleForward(yaw, pitch) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return { x: cp * Math.sin(yaw), y: -sp, z: cp * Math.cos(yaw) };
}

/** Rotate a local (x, z) offset by yaw into world XZ plane. */
export function rotateXZByYaw(x, z, yaw) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  return { x: (x * cy + z * sy), z: (z * cy - x * sy) };
}
