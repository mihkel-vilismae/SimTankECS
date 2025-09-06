export const VFX_PRESETS = {
  MG_MUZZLE: {
    flash: { sprites: 1, size: [0.25, 0.45], life: 0.06, color: 0xffe7a3 },
    light: { intensity: 1.6, radius: 2.5, decay: 3, life: 0.06 },
    smoke: { count: 10, size: [0.15, 0.35], life: [0.6, 0.9], drift: [0.2,0.5], upward: 0.6 },
    sparks:{ count: 10, speed: [3,7], life: [0.1,0.25], gravity: -7, spread: 0.35 },
    sound: "mg_fire_01",
  },
  CANNON_MUZZLE: {
    flash: { sprites: 2, size: [0.7, 1.3], life: 0.08, color: 0xfff1b0 },
    light: { intensity: 4.5, radius: 6.0, decay: 6, life: 0.10 },
    smoke: { count: 28, size: [0.35, 0.9], life: [1.2, 2.2], drift: [0.6,1.2], upward: 1.0 },
    sparks:{ count: 26, speed: [6,13], life: [0.15,0.35], gravity: -12, spread: 0.5 },
    shock: { enabled: true, radius: 1.2, life: 0.06 },
    sound: "cannon_fire_01",
  }
};
