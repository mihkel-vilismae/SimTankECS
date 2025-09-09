export function createProjectile({ kind = "bullet", speed = 600 } = {}) {
  return { kind, speed, createdAt: performance.now() };
}
