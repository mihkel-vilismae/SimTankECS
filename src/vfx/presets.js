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
    sound: "cannon_fire_01"
  },
  SHELL_EXPLOSION_LARGE: {
    flash: { sprites: 3, size: [1.2, 2.2], life: 0.12, color: 0xfff5c0 },
    light: { intensity: 7.0, radius: 9.0, decay: 6, life: 0.30 },
    smoke: { count: 64, size: [0.7, 1.8], life: [2.0, 3.8], drift: [0.8,1.6], upward: 1.2 , opacity: 0.45},
    sparks:{ count: 120, speed: [9,18], life: [0.8,1.4], gravity: -14, spread: 0.9 },
    shock: { enabled: true, radius: 2.6, life: 0.14 },
    sound: "big_explosion_01"
  },
  BULLET_SPARK_STORM: {
    flash: { sprites: 1, size: [0.4, 0.7], life: 0.10, color: 0xfff2cc },
    light: { intensity: 2.2, radius: 3.5, decay: 4, life: 0.30 },
    smoke: { count: 14, size: [0.25, 0.55], life: [0.9, 1.6], drift: [0.4,0.9], upward: 0.7 , opacity: 0.35},
    sparks:{ count: 220, speed: [6,13], life: [1.2,2.0], gravity: -11, spread: 1.2 },
    shock: { enabled: false }
  
,
    SHELL_TRAIL_PUFF: {
    smoke: { count: 4, size: [0.18, 0.32], life: [0.7, 1.2], drift: [0.15,0.35], upward: 0.7, opacity: 0.4 }
  }}
  ,
  BULLET_TRAIL_PUFF: {
    smoke: { count: 1, size: [0.08, 0.15], life: [0.3, 0.5], drift: [0.1,0.2], upward: 0.3, opacity: 0.25 }
  }
};
