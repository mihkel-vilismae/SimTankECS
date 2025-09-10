export function Building(data={}){ return { kind:"building", maxHp:data.maxHp ?? 100, hp:data.hp ?? (data.maxHp ?? 100) }; }
