// Segment (p0->p1) vs Axis-Aligned Box (center, half extents). Returns t[0..1] or null.
export function segmentAabbHit(p0, p1, center, half, radius=0){
  // Convert to box space where box centered at origin
  const r = { x: half.x + radius, y: half.y + radius, z: half.z + radius };
  const s = { x: p0.x - center.x, y: p0.y - center.y, z: p0.z - center.z };
  const e = { x: p1.x - center.x, y: p1.y - center.y, z: p1.z - center.z };
  const d = { x: e.x - s.x, y: e.y - s.y, z: e.z - s.z };

  let tmin = 0, tmax = 1;
  for (const axis of ["x","y","z"]) {
    const ds = d[axis], s0 = s[axis], r0 = r[axis];
    if (Math.abs(ds) < 1e-8) {
      if (s0 < -r0 || s0 > r0) return null;
    } else {
      const ood = 1.0 / ds;
      let t1 = (-r0 - s0) * ood;
      let t2 = ( r0 - s0) * ood;
      if (t1 > t2) { const tmp=t1; t1=t2; t2=tmp; }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }
  }
  const tHit = (tmin >= 0 && tmin <= 1) ? tmin : (tmax >= 0 && tmax <= 1 ? tmax : null);
  return (tHit != null) ? tHit : null;
}
