export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function normalizeAngle(rad) {
  let r = rad % (Math.PI * 2);
  if (r <= -Math.PI) r += Math.PI * 2;
  if (r > Math.PI) r -= Math.PI * 2;
  return r;
}
export function yawToForward(yaw) {
  return { x: Math.sin(yaw), y: 0, z: Math.cos(yaw) };
}
