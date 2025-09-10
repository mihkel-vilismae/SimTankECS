export function rubbleUpdateSystem(dt, world, registry){
  if (!world._rubble || !world._rubble.length) return;
  const arr = world._rubble;
  for (let i = arr.length - 1; i >= 0; i--) {
    const r = arr[i];
    r.t += dt;
    const a = Math.max(0, 1 - r.t / r.life);
    if (r.group) {
      r.group.traverse(obj => {
        if (obj.material && 'opacity' in obj.material) {
          obj.material.transparent = true;
          obj.material.opacity = a * 0.9;
        }
      });
    }
    if (r.t >= r.life) {
      if (r.group && r.group.parent) r.group.parent.remove(r.group);
      arr.splice(i,1);
    }
  }
}
