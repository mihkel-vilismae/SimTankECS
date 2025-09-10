export function cameraExplosionCinematicSystem(dt, world, registry) {
  const cam = world.camera;
  const c = world.cinematicExplosion;
  if (!cam || !c || !c.active) return;
  c.t += dt;
  if (c.phase === "orbit") {
    if (typeof world.cinematicTimeScale === "number") world.timeScale = world.cinematicTimeScale;
  }
  if (c.phase === "return" && c.t >= (c.returnDur || 1.2)) {
    world.timeScale = 1.0;
    world.cinematicExplosion = null;
    world.cinematicBanner = null;
  }
}
