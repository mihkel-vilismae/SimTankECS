export function createMouseFollower(opts = {}) {
  return {
    yawLerp: opts.yawLerp ?? 0.15,
    pitchLerp: opts.pitchLerp ?? 0.0 // reserved
  };
}
