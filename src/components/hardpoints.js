export function createHardpoints(slots = []) {
  // slots: [{id, localPos:{x,y,z}, localYaw, localPitch, localRoll}]
  return { slots };
}

export function createMount({ parent, slotId, offset } = {}) {
  return {
    parent: parent ?? null,
    slotId: slotId ?? null,
    offset: offset ?? { pos: { x:0,y:0,z:0 }, yaw:0, pitch:0, roll:0 },
  };
}
