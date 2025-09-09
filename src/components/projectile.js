export function createProjectile({ kind = "bullet", speed = 300 } = {}) {
  return { kind, speed, createdAt: performance.now() };
}
