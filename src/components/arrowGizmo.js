export function createArrowGizmo(overrides = {}) {
  return {
    length: overrides.length ?? 1.8,
    headLength: overrides.headLength ?? 0.35,
    headWidth: overrides.headWidth ?? 0.22,
    color: overrides.color ?? 0xffaa00,
    visible: overrides.visible ?? true,
  };
}
