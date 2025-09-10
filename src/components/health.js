export function Health({ max = 100, hp = null } = {}) { const m=Math.max(1,Math.floor(max)); return { max:m, hp:(hp==null?m:Math.min(m,hp)) }; }
