export function createTransform(x=0, y=0, z=0, yaw=0, pitch=0, roll=0) {
  return {
    position: { x, y, z },
    rotation: { yaw, pitch, roll },
  };
}
